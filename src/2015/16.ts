import { transforms } from 'advent-of-code-client';

export function part1(input: string[]): number | string {
    let analysis: { [key: string]: number } = {
        children: 3,
        cats: 7,
        samoyeds: 2,
        pomeranians: 3,
        akitas: 0,
        vizslas: 0,
        goldfish: 5,
        trees: 3,
        cars: 2,
        perfumes: 1
    };

    // let sues: Sue[] = [];
    let sues: any[] = [];

    for (let inp of input) {
        let split = inp.slice(inp.indexOf(': ') + 2).split(', ').map(s => s.split(': '));
        let sue: any = {
            id: inp.split(' ')[1].split(':')[0]
        };
        for (let [k, v] of split) {
            sue[k] = +v;
        }

        sues.push(sue);
    }

    for (let [k, v] of Object.entries(analysis)) {
        sues = sues.filter((sue) => {
            if (k in sue) {
                if (sue[k] === v) {
                    return true;
                }
                return false;
            }
            return true;
        });
    }
    console.log(sues.length);
    return sues[0].id;
}

export function part2(input: string[]): number | string {
    let analysis: { [key: string]: number } = {
        children: 3,
        cats: 7,
        samoyeds: 2,
        pomeranians: 3,
        akitas: 0,
        vizslas: 0,
        goldfish: 5,
        trees: 3,
        cars: 2,
        perfumes: 1
    };

    // let sues: Sue[] = [];
    let sues: any[] = [];

    for (let inp of input) {
        let split = inp.slice(inp.indexOf(': ') + 2).split(', ').map(s => s.split(': '));
        let sue: any = {
            id: inp.split(' ')[1].split(':')[0]
        };
        for (let [k, v] of split) {
            sue[k] = +v;
        }

        sues.push(sue);
    }

    for (let [k, v] of Object.entries(analysis)) {
        sues = sues.filter((sue) => {
            if (k in sue) {
                if (k == 'cats' || k == 'trees') {
                    if (sue[k] > v) {
                        return true;
                    }
                    return false;
                }
                if (k == 'pomeranians' || k == 'goldfish') {
                    if (sue[k] < v) {
                        return true;
                    }
                    return false;
                }
                if (sue[k] === v) {
                    return true;
                }
                return false;
            }
            return true;
        });
    }
    console.log(sues.length);
    return sues[0].id;
}

interface Sue {
    children?: number;
    cats?: number;
    samoyeds?: number;
    pomeranians?: number;
    akitas?: number;
    vizslas?: number;
    goldfish?: number;
    trees?: number;
    cars?: number;
    perfumes?: number;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [``],
    part2: [``]
};

const testAnswers = {
    part1: [0],
    part2: [0]
};

export { transform, testData, testAnswers };