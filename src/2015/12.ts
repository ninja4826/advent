import { transforms } from 'advent-of-code-client';

export function part1(input: string): number | string {
    return counter(input);
}

export function part2(input: string): number | string {
    return counter(input, true);
}

function counter(input: string, removeRed: boolean = false): number {
    let obj: any = JSON.parse(input);
    let count = 0;
    
    const recursor: any = {
        object: (obj: any) => {
            if (removeRed) {
                for (let [k, v] of Object.entries(obj)) {
                    if (typeof v == 'string' && v == 'red') return; 
                }
            }
            for (let [k, v] of Object.entries(obj)) {
                if (Array.isArray(v)) {
                    recursor.array(v);
                } else if (typeof v == 'number') {
                    count += v;
                } else if (typeof v !== 'string') {
                    recursor.object(v);
                }
            }
        },
        array: (obj: any[]) => {
            for (let v of obj) {
                if (Array.isArray(v)) {
                    recursor.array(v);
                } else if (typeof v == 'number') {
                    count += v;
                } else if (typeof v !== 'string') {
                    recursor.object(v);
                }
            }
        }
    };

    recursor.object(obj);

    return count;
}

// const transform = transforms.lines;
const transform = (d: string): string => d;

const testData = {
    part1: [`[1,2,3]`, `{"a":2,"b":4}`, `[[[3]]]`, `{"a":{"b":4},"c":-1}`,
        `{"a":[-1,1]}`, `[-1,{"a":1}]`, '[]', '{}'],
    part2: [`[1,{"c":"red","b":2},3]`]
};

const testAnswers = {
    part1: [6, 6, 3, 3, 0, 0, 0, 0],
    part2: [4]
};

export { transform, testData, testAnswers };