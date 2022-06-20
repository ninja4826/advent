import { transforms } from 'advent-of-code-client';
import { permutator } from '../util';

export function part1(_input: string[]): number | string {
    const input = _input.map(Number);
    input.sort((a, b) => b - a);
    return getCombinations(input).length;
}

export function part2(_input: string[]): number | string {
    const input = _input.map(Number);
    input.sort((a, b) => b - a);
    let combos = getCombinations(input);
    let leastUsed = Math.min(...combos);
    combos = combos.filter(c => c === leastUsed);
    console.log(combos);
    return combos.length;
}

function getCombinations(data: number[]): number[] {
    const usedContainers: number[] = [];
    const aux = (remaining: number, containers: number[], used: number): void => {
        if (remaining == 0) {
            usedContainers.push(used);
        } else if (remaining > 0 && containers.length > 0) {
            aux(remaining, containers.slice(1), used);
            aux(remaining - containers[0], containers.slice(1), used + 1);
        }
    };

    aux(150, data, 0);
    return usedContainers;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`20
15
10
5
5`],
    part2: [``]
};

const testAnswers = {
    part1: [4],
    part2: [3]
};

export { transform, testData, testAnswers };