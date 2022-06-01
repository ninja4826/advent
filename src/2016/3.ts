import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar, zip } from '../util';

export function part1(input: string[]): number | string {
    input[0] = '  '+input[0];
    let reg = /\s{0,4}(\d{1,5})\s{0,4}(\d{1,5})\s{0,4}(\d{1,5})/;

    let count = 0;

    for (let inp of input) {

        let match = matcher(inp, reg);

        let nums: [number, number, number] = [+match[1], +match[2], +match[3]];
        nums.sort((a, b) => a - b);
        
        if (nums[2] >= nums[0] + nums[1]) continue;
        
        count++;
    }
    return count;
}

export function part2(input: string[]): number | string {
    input[0] = '  '+input[0];

    let reg = /\s{0,4}(\d{1,5})\s{0,4}(\d{1,5})\s{0,4}(\d{1,5})/;

    let count = 0;

    for (let i = 0; i < input.length; i += 3) {
        let group = zip(...input.slice(i, i+3).map(g => matcher(g, reg)).map(m => [+m[1], +m[2], +m[3]]));
        for (let g of group) {
            g.sort((a, b) => a - b);

            if (g[2] >= g[0] + g[1]) continue;
            count++;
        }
    }
    return count;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`5   10   25
810  679   10
2  284  335`,
`810  679   10
783  255  616
545  626  626
84  910  149
607  425  901
556  616  883`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };