import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar, zip } from '../util';

export function part1(input: string[]): number | string {
    let valid = getValidRooms(input);
    return valid.reduce((p, c) => p+c.id, 0);
}

export function part2(input: string[]): number | string {
    let valid = getValidRooms(input);
    // logger.enable();
    logger.log(valid.length);
    const shifter = (name: string, num: number): string => {
        const alph = 'abcdefghijklmnopqrstuvwxyz'.split('');
        let arr: string[][] = name.split('-').map(n => n.split('').map(l => alph[(alph.indexOf(l) + num) % alph.length]));

        return arr.map(n => n.join('')).join(' ');
    }

    // for (let v of valid) {
    //     console.log(v.id, shifter(v.name, v.id));
    // }

    let wordSet: Set<string> = new Set();

    for (let v of valid) {
        let shifted = shifter(v.name, v.id);
        if (shifted == 'northpole object storage') {
            return v.id;
        }
    }
    
    return 0;
}

function getValidRooms(input: string[]): Room[] {
    let reg = /(?<name>[\w-]+)-(?<id>\d+)\[(?<checksum>\w+)\]/;

    const checker = (map: Map<string, number>, letter: string): boolean => {
        if (!map.has(letter)) return false;
        let lVal = <number>map.get(letter);

        let vals = [...map.values()];
        vals.sort((a, b) => b - a);

        return lVal == vals[0];
    }

    let valid: Room[] = [];
out:for (let inp of input) {
        let match = matcher(inp, reg);
        let name = match.groups.name;
        let id = +match.groups.id;
        let checksum = match.groups.checksum.split('');

        let nameArr = name.split('-').join('').split('');
        let nameSet: string[] = [...new Set(nameArr)];
        let nameMap: Map<string, number> = new Map();

        for (let n of nameSet) {
            nameMap.set(n, nameArr.filter(n2 => n2 === n).length);
        }

        for (let letter of checksum) {
            if (checker(nameMap, letter)) {
                nameMap.delete(letter);
            } else {
                continue out;
            }
        }
        valid.push({
            name,
            id,
            checksum
        });
    }
    return valid;
}

interface Room {
    name: string;
    id: number;
    checksum: string[];
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`aaaaa-bbb-z-y-x-123[abxyz]
a-b-c-d-e-f-g-h-987[abcde]
not-a-real-room-404[oarel]
totally-real-room-200[decoy]`],
    part2: [`qzmt-zixmtkozy-ivhz-343[zmtiq]`]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };