import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

export function part1(data: any): number | string {
    let reactions: any = {};

    let chemNeeds: any = { 'FUEL': 1 };
    Object.defineProperty(chemNeeds, 'size', {
        get: function(): number { return Object.keys(this).length }
    });
    Object.defineProperty(chemNeeds, 'first', {
        get: function(): string { return Object.keys(this)[0] }
    });

    let chemHave: { [key: string]: number } = {};
    // logger.log(JSON.stringify(data, null, 2));
    for (let line of data) {
        let [ inputs, output ] = line;
        // logger.log(line);

        let obj: any = {
            out: parseInt(output[0][0]),
            in: {}
        };
        for (let inp of inputs) {
            obj.in[inp[1]] = parseInt(inp[0]);
        }
        reactions[output[0][1]] = obj;
    }
    logger.log(JSON.stringify(reactions, null, 2));

    let ore = 0;

    while (chemNeeds.size > 0) {
        let item = chemNeeds.first;

        if (chemNeeds[item] <= chemHave[item]) {
            chemHave[item] -= chemNeeds[item];
            delete chemNeeds[item];
            continue;
        }

        if (!(item in chemHave)) {
            chemHave[item] = 0;
        }
        let numNeeded = chemNeeds[item] - chemHave[item];
        // delete chemHave[item];
        delete chemNeeds[item];

        let numProduced = reactions[item].out;
        let numReactions = 0;
        if (numNeeded / numProduced == Math.floor(numNeeded / numProduced)) {
            numReactions = Math.floor(numNeeded / numProduced);
        } else {
            numReactions = Math.floor(numNeeded / numProduced) + 1;
        }

        chemHave[item] += (numReactions * numProduced) - numNeeded;
        for (let chem in reactions[item].in) {
            if (chem == 'ORE') {
                ore += reactions[item].in[chem] * numReactions;
            } else {
                if (!(chem in chemNeeds)) {
                    chemNeeds[chem] = 0;
                }
                chemNeeds[chem] += reactions[item].in[chem] * numReactions;
            }
        }
    }

    return ore;
}

export function part2(input: any): number | string {
    return 0;
}

const transform = (data: string): any[] => data.split('\n').map(c1 => c1.split(' => ').map(c2 => c2.split(', ').map(c3 => c3.split(' '))));

const testData = {
    part1: `171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX`,
    part2: ''
};

const testAnswers = {
    part1: 13312,
    part2: 0
};

export { transform, testData, testAnswers };