import { logger } from './logger';

function padEnd<T>(array: T[], minLength: number, fillValue: T): T[] {
    return Object.assign(new Array(minLength).fill(fillValue), array);
}

export class Computer {

    program: number[];
    inputList: number[];
    instance: Generator<number, number, number>;
    done: boolean;
    defaultInput: number;

    constructor(program: number[], input: number[] = [], defaultInput = 0) {
        this.program = [...program];
        this.inputList = input;
        this.instance = this._execute();
        this.done = false;
        this.defaultInput = defaultInput;
    }

    reset(program?: number[], input: number[] = []): void {
        this.instance.return(0);
        if (!program) {
            program = this.program;
        }
        this.init(this.program, input);
    }

    init(program: number[], input: number[] = []) {
        this.program = [...program];
        this.inputList = input;
        this.instance = this._execute();
        this.done = false;
    }

    input(val: string | number | number[], clearPastInputs = false): Computer {
        if (clearPastInputs === true) {
            this.inputList = [];
        }
        if (typeof val === 'string') {
            val = parseInt(val);
        }
        this.inputList = this.inputList.concat(Array.isArray(val) ? val : [val]);
        return this;
    }

    isInputEmpty(): boolean {
        return this.inputList.length === 0;
    }

    output(): number {
        let result;

        do {
            result = this.next();
        } while (result === Computer.INPUT_EVENT);

        return result;
    }

    next(): number {
        return this.instance.next().value;
    }

    halted(): boolean {
        return this.done;
    }

    finalOutput(): number {
        let result = 0;
        let temp = 0;

        do {
            result = temp;
            // temp = <number>this.output();
            temp = this.output();
        } while (!this.halted());

        return result;
    }

    *_execute(): Generator<number, number, number> {
        let program = [...this.program];
        let pointer = 0;
        let relativeBase = 0;

        while (pointer < program.length) {
            const opcode = this.processOpcode(program[pointer++]);

            let arg1 = program[pointer];
            let arg2 = program[pointer+1];
            let arg3 = program[pointer+2];

            (opcode.mode1 == 2) && (arg1+=relativeBase);
            (opcode.mode2 == 2) && (arg2+=relativeBase);
            (opcode.mode3 == 2) && (arg3+=relativeBase);

            let address1 = arg1;

            (opcode.mode1 != 1) && (arg1 = program[arg1] || 0);
            (opcode.mode2 != 1) && (arg2 = program[arg2] || 0);

            switch (opcode.code) {
                case 1:
                    program[arg3] = arg1 + arg2;
                    pointer += 3;
                    break;
                case 2:
                    program[arg3] = arg1 * arg2;
                    pointer += 3;
                    break;
                case 3:
                    program[address1] = this.getNextInput();
                    yield Computer.INPUT_EVENT;
                    pointer++;
                    break;
                case 4:
                    pointer++;
                    yield arg1;
                    break;
                case 5:
                    pointer += 2;
                    (arg1 != 0) && (pointer = arg2);
                    break;
                case 6:
                    pointer += 2;
                    (arg1 == 0) && (pointer = arg2);
                    break;
                case 7:
                    program[arg3] = (arg1 < arg2) ? 1 : 0;
                    pointer += 3;
                    break;
                case 8:
                    program[arg3] = (arg1 == arg2) ? 1 : 0;
                    pointer += 3;
                    break;
                case 9:
                    relativeBase += arg1;
                    pointer++;
                    break;
                case 99:
                    this.done = true;
                    return program[0];
            }
        }
        this.done = true;
        return program[0];
    }

    private getNextInput(): number {
        return this.isInputEmpty() ? this.defaultInput : <number>this.inputList.shift();
    }

    private processOpcode(opcode: number) {
        let parts = opcode.toString().split('').reverse();

        return {
            code: opcode % 100,
            mode1: parts[2] || 0,
            mode2: parts[3] || 0,
            mode3: parts[4] || 0
        };
    }

    static get INPUT_EVENT(): number {
        return Number.POSITIVE_INFINITY;
    }
}

export class AsciiComputer extends Computer {
    init(program: number[], input: string | number[] = '') {
        if (typeof input !== 'string') {
            input = input.join('');
        }
        super.init(program, this.inputToCharCode(input));
    }

    input(input: string | number | number[], clearPastInputs = false) {
        if (typeof input !== 'string') {
            if (Array.isArray(input)) {
                input = input.join('');
            } else {
                input = input.toString();
            }
        }
        super.input(this.inputToCharCode(input));
        return this;
    }

    outputStr(): string {
        const result = [];

        while (true) {
            const output = <number>super.output();

            if (super.halted() || output == 10) {
                break;
            }

            result.push(
                this.isAscii(output) ? String.fromCharCode(output) : output
            );
        }

        return result.join('');
    }

    finalOutputStr(): string {
        let result = '';
        let temp = '';

        do {
            result = temp;
            temp = this.outputStr();
        } while (!this.halted());

        return result;
    }

    private inputToCharCode(input: string): number[] {
        if (input.length === 0) {
            return [];
        }

        return (input + '\n')
            .split('')
            .map(c => c.charCodeAt(0));
    }

    private isAscii(code: number): boolean {
        return code >= 0 && code < 255;
    }
}

interface Opcode {
    code: number;
    mode1: number;
    mode2: number;
    mode3: number;
};