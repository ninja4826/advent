import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar } from '../util';
import { roll, range } from '../util/py';

export function part1(input: string[]): number | string {
    let plain = 'abcdefgh';

    let first = new Scrambler(plain, input);
    first.scramble();
    
    return first.pw.join('');
}

export function part2(input: string[]): number | string {
    let pw = 'fbgdceah';

    let second = new Scrambler(pw, input);

    second.unscramble();

    return second.pw.join('');
}

class Scrambler {
    static INSTRUCTIONS: string[];
    pw: string[];

    constructor(pw: string, inst: string[]) {
        this.pw = pw.split('');
        Scrambler.INSTRUCTIONS = inst;
    }

    swapPositions(x: number, y: number): void {
        [this.pw[x], this.pw[y]] = [this.pw[y], this.pw[x]];
    }

    swapLetters(x: string, y: string): void {
        this.swapPositions(this.pw.indexOf(x), this.pw.indexOf(y));
    }

    rotate(x: number): void {
        x %= this.pw.length;
        this.pw = roll(this.pw, x);
    }

    rotateLetter(x: string): void {
        let xPos = this.pw.indexOf(x);
        if (xPos >= 4) {
            xPos += 1;
        }
        this.rotate(xPos + 1);
    }

    derotateLetter(x: string): void {
        let xPos = this.pw.indexOf(x);
        let rot = -1;
        if (xPos % 2) {
            rot = Math.floor((xPos + 1) / 2) * -1;
        } else if (xPos) {
            rot = Math.floor((6 - xPos) / 2);
        }

        this.rotate(rot);
    }

    reverse(x: number, y: number): void {
        y += 1;

        let tmp = this.pw.slice(x, y);
        tmp.reverse();
        this.pw.splice(x, y - x, ...tmp);
    }

    move(x: number, y: number): void {
        this.pw.splice(y, 0, this.pw.splice(x, 1)[0]);
    }

    scramble(reversed: boolean = false): Scrambler {
        // let rangeArgs: [[number, number], number] = [[0, Scrambler.INSTRUCTIONS.length], 1];
        // if (reversed) {
        //     rangeArgs = [[Scrambler.INSTRUCTIONS.length - 1, -1], -1];
        // }
        let rangeRet = [...range(Scrambler.INSTRUCTIONS.length)];

        if (reversed) {
            rangeRet.reverse();
        }

        for (let inst of rangeRet) {
            const instruction = Scrambler.INSTRUCTIONS[inst];
            const line = instruction.split(' ');

            if (instruction.startsWith('swap')) {
                let [x, y] = [line[2], line[5]];
                if (line[1] == 'position') {
                    this.swapPositions(+x, +y);
                } else {
                    this.swapLetters(x, y);
                }
            } else if (instruction.startsWith('rotate')) {
                if (line[1] == 'based') {
                    if (reversed) {
                        this.derotateLetter(line[6]);
                    } else {
                        this.rotateLetter(line[6]);
                    }
                } else {
                    let xPos = +line[2];
                    if (line[1] == 'left') xPos *= -1;
                    if (reversed) xPos *= -1;
                    this.rotate(xPos);
                }
            } else {
                let xPos = +line[2];
                let yPos = +line[line.length - 1];

                if (instruction.startsWith('reverse')) {
                    this.reverse(xPos, yPos);
                } else {
                    if (reversed) {
                        [xPos, yPos] = [yPos, xPos];
                    }
                    this.move(xPos, yPos);
                }
            }
            console.log('pw', this.pw.join(''));
        }

        return this;
    }

    unscramble(): Scrambler {
        return this.scramble(true);
    }
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`swap position 4 with position 0
swap letter d with letter b
reverse positions 0 through 4
rotate left 1 step
move position 1 to position 4
move position 3 to position 0
rotate based on position of letter b
rotate based on position of letter d`],
    part2: [``]
};

const testAnswers = {
    part1: ['decab'],
    part2: [0]
};

export { transform, testData, testAnswers };