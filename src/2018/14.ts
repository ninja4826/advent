import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: number): number | string {
    let recipe = new Recipe(input);
    return recipe.stepToEnd();
}

export function part2(input: any): number | string {
    // let recipe = new Recipe(input);
    // console.log(recipe.findEndNum());
    // recipe.currScores = [3, 7, 1, 0, 1, 0, 1, 2, 4, 5, 1, 5, 8, 9, 1, 6, 7, 7, 9, 2];
    // console.log(recipe.findEndNum());
    let recipe = new Recipe(input);
    return recipe.findEndNum();
    // return 0;
}

class Recipe {
    currScores: number[] = [3, 7];

    e1: number = 0;
    e2: number = 1;
    endNum: number;
    constructor(endNum: number) {
        this.endNum = endNum;
    }

    stepToEnd(): string {
        while (this.currScores.length < this.endNum + 10) {
            this.step();
        }

        // return this.currScores.slice(-10).join('');
        return this.currScores.slice(this.endNum, this.endNum + 10).join('');
    }

    findEndNum(): number {
        const checkArr = this.endNum.toString().split('').map(c => Number(c));
        const checker = (): number => {
            let idx = 0;
            for (let i = 0; i < this.currScores.length; i++ ) {
                let score = this.currScores[i];
                if (idx === checkArr.length) {
                    return i - checkArr.length;
                }
                if (score === checkArr[idx]) {
                    idx++;
                } else {
                    idx = 0;
                }
            }
            return 0;
        };

        while (checker() === 0) {
            this.step();
        }

        return checker();
    }

    step(): void {
        let newScore = this.currScores[this.e1] + this.currScores[this.e2];
        this.currScores.push(...newScore.toString().split('').map(c => Number(c)));

        this.e1 = (this.e1 + this.currScores[this.e1] + 1) % this.length;
        this.e2 = (this.e2 + this.currScores[this.e2] + 1) % this.length;
    }

    get length(): number {
        return this.currScores.length;
    }
}

const transform = (d: string): number => Number(d);

const testData = {
    part1: ['9', '5', '18', '2018'],
    part2: ['51589', '01245', '92510', '59414']
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };