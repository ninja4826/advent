export class Computer {
    opcodes: { [key:string]: (a: number, b: number, c: number) => void };
    state: number[];
    ip: number;

    constructor(_state?: number[]) {
        if (!_state) {
            _state = new Array(6).fill(0);
        } else {
            [0].concat(_state);
        }
        let state = <number[]>_state;
        this.state = state;

        this.ip = 0;

        this.opcodes = {
            addr: (a, b, c) => state[c] = state[a] + state[b],
            addi: (a, b, c) => state[c] = state[a] + b,
            mulr: (a, b, c) => state[c] = state[a] * state[b],
            muli: (a, b, c) => state[c] = state[a] * b,
            banr: (a, b, c) => state[c] = state[a] & state[b],
            bani: (a, b, c) => state[c] = state[a] & b,
            borr: (a, b, c) => state[c] = state[a] | state[b],
            bori: (a, b, c) => state[c] = state[a] | b,
            setr: (a, b, c) => state[c] = state[a],
            seti: (a, b, c) => state[c] = a,
            gtir: (a, b, c) => state[c] = a > state[b] ? 1 : 0,
            gtri: (a, b, c) => state[c] = state[a] > b ? 1 : 0,
            gtrr: (a, b, c) => state[c] = state[a] > state[b] ? 1 : 0,
            eqir: (a, b, c) => state[c] = a == state[b] ? 1 : 0,
            eqri: (a, b, c) => state[c] = state[a] == b ? 1 : 0,
            eqrr: (a, b, c) => state[c] = state[a] == state[b] ? 1 : 0,
        };
    }

    execute(_instructions: string[][]): number {
        let instructions = _instructions.slice();

        let breakPoint = null;
        while (instructions[0][0][0] === '#') {
            const declaration = <string[]>instructions.shift();
            switch (declaration[0]) {
                case '#ip':
                    this.ip = Number(declaration[1]);
                    break;
                case '#break':
                    breakPoint = Number(declaration[1]);
                    break;
            }
        }

        let code = instructions.map((instruction: string[]): [(a: number, b: number, c: number) => void, number[]] => {
            const ag = instruction.slice(1).map(Number);
            const fn = this.opcodes[instruction[0]];
            return [fn, ag];
        });

        let iStats = new Array(code.length).fill(0);
        let n = 0;
        for (let i = this.state[this.ip]; i < code.length; i = this.state[this.ip]) {
            iStats[i]++;

            code[i][0].apply(this, [code[i][1][0], code[i][1][1], code[i][1][2]]);
            this.state[this.ip]++;
            n++;
            if (breakPoint === i) {
                break;
            }
        }
        return n;
    }

    toString(): string {
        return `ip=${this.state[this.ip]} [${this.state.join(', ')}]`;
    }
}