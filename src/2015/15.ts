import { transforms } from 'advent-of-code-client';
import { matcher, permutator, range } from '../util';

export function part1(input: string[]): number | string {
    return getCookie(input);
}

export function part2(input: string[]): number | string {
    return getCookie(input, true);
}

function getCookie(input: string[], countCalories: boolean = false): number {
    let reg = /(\w+): capacity (\-?\d+), durability (\-?\d+), flavor (\-?\d+), texture (\-?\d+), calories (\-?\d+)/;

    let ingredMap: Map<string, Ingredient> = new Map();

    for (let inp of input) {
        let match = matcher(inp, reg);

        let ingredient: Ingredient = {
            name: match[1],
            capacity: +match[2],
            durability: +match[3],
            flavor: +match[4],
            texture: +match[5],
            calories: +match[6]
        };

        ingredMap.set(match[1], ingredient);
    }

    let ingredNames: string[] = [...ingredMap.keys()];

    const getCalories = (perm: number[]): boolean => {
        let calories = 0;

        for (let i = 0; i < perm.length; i++) {
            let cals = (<Ingredient>ingredMap.get(ingredNames[i])).calories;
            calories += (perm[i] * cals);
        }
        return calories === 500;
    };

    let permGen = permutator([...range([0, 101])], { repeat: true, maxLen: ingredNames.length });
    let perms: number[][] = [];
    while (true) {
        let next = permGen.next();

        if (next.done) break;

        if (next.value.reduce((p, c) => p+c, 0) === 100) {
            if (countCalories) {
                if (getCalories(next.value)) {
                    perms.push(next.value);
                }
            } else {
                perms.push(next.value);
            }
        }
    }
    
    let max = 0;

    for (let perm of perms) {
        let capacity = 0;
        let durability = 0;
        let flavor = 0;
        let texture = 0;

        for (let i = 0; i < perm.length; i++) {
            let ingred = <Ingredient>ingredMap.get(ingredNames[i]);

            capacity += perm[i] * ingred.capacity;
            durability += perm[i] * ingred.durability;
            flavor += perm[i] * ingred.flavor;
            texture += perm[i] * ingred.texture;
        }

        capacity = capacity > 0 ? capacity : 0;
        durability = durability > 0 ? durability : 0;
        flavor = flavor > 0 ? flavor : 0;
        texture = texture > 0 ? texture : 0;

        let score = capacity * durability * flavor * texture;

        if (score > max) {
            max = score;
        }
    }

    return max;
}

interface Ingredient {
    name: string;
    capacity: number;
    durability: number;
    flavor: number;
    texture: number;
    calories: number;

}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`],
    part2: [``]
};

const testAnswers = {
    part1: [62842880],
    part2: [57600000]
};

export { transform, testData, testAnswers };