import { strictEqual } from "assert";

export function part1(input: string[]): any {
    // do rules
    let ticketGens = ticketGen(input);

    let rules: { [key: string]: number[] } = {};

    let ruleGen = ticketGens.rules.next();
    let ruleReg = /([\w\s]+): (\d+)-(\d+) or (\d+)-(\d+)/;
    let ruleKeys: string[] = [];
    while (!ruleGen.done) {
        let match = matcher(ruleReg, ruleGen.value);
        let arr: number[] = [];

        let nums: number[] = [];
        for (let i = 2; i < 6; i++) {
            nums.push(parseInt(match[i], 10));
        }

        for (let i = nums[0]; i < nums[1] + 1; i++) {
            arr.push(i);
        }
        for (let i = nums[2]; i < nums[3] + 1; i++) {
            arr.push(i);
        }
        rules[match[1]] = arr;
        ruleKeys.push(match[1]);

        ruleGen = ticketGens.rules.next();
    }

    let cnt = 0;

    let nearbyGen = ticketGens.nearby.next();
    while (!nearbyGen.done) {
        for (let i = 0; i < nearbyGen.value.length; i++) {
            let num = nearbyGen.value[i];
            let found = false;
            for (let j = 0; j < ruleKeys.length; j++) {
                if (rules[ruleKeys[j]].includes(num)) {
                    found = true;
                }
                if (found) break;
            }
            if (!found) {
                cnt += num;
            }
        } 
        nearbyGen = ticketGens.nearby.next();
    }
    return cnt;
}

export function part2(input: string[]): any {
    let ticketGens = ticketGen(input);

    let rules: { [key: string]: number[] } = {};

    let ruleGen = ticketGens.rules.next();
    let ruleReg = /([\w\s]+): (\d+)-(\d+) or (\d+)-(\d+)/;
    let ruleKeys: string[] = [];
    while (!ruleGen.done) {
        let match = matcher(ruleReg, ruleGen.value);
        let arr: number[] = [];

        let nums: number[] = [];
        for (let i = 2; i < 6; i++) {
            nums.push(parseInt(match[i], 10));
        }

        for (let i = nums[0]; i < nums[1] + 1; i++) {
            arr.push(i);
        }
        for (let i = nums[2]; i < nums[3] + 1; i++) {
            arr.push(i);
        }
        rules[match[1]] = arr;
        ruleKeys.push(match[1]);

        ruleGen = ticketGens.rules.next();
    }
    
    let tickets: number[][] = [];
    let possibleFields: string[][] = [];

    let nearbyGen = ticketGens.nearby.next();
    while (!nearbyGen.done) {
        let allFound = true;
        for (let i = 0; i < nearbyGen.value.length; i++) {
            let num = nearbyGen.value[i];
            let found = false;
            for (let j = 0; j < ruleKeys.length; j++) {
                if (rules[ruleKeys[j]].includes(num)) {
                    found = true;
                }
                if (found) break;
            }
            if (!found) {
                allFound = false;
                break;
            }
        }
        if (allFound) {
            tickets.push(nearbyGen.value);
        }
        nearbyGen = ticketGens.nearby.next();
    }
    
    for (let i = 0; i < ruleKeys.length; i++) {
        possibleFields.push(ruleKeys.slice(0));
    }

    for (let i = 0; i < tickets.length; i++) {
        for (let j = 0; j < tickets[i].length; j++) {
            let num = tickets[i][j];

            for (let k = 0; k < possibleFields[j].length; k++) {
                let field = possibleFields[j][k];

                if (!rules[field].includes(num)) {
                    let fields = possibleFields[j].slice(0);
                    fields.splice(k, 1);
                    possibleFields[j] = fields;
                    break;
                }
            }
        }
    }
    // console.log(JSON.stringify(possibleFields, null, 2));

    let checker = (dta: string[][]): boolean => {
        for (let i = 0; i < dta.length; i++) {
            if (dta[i].length != 1) {
                return true;
            }
        }
        return false;
    };

    while (checker(possibleFields)) {
        for (let i = 0; i < possibleFields.length; i++) {
            if (possibleFields[i].length == 1) {
                let subj = possibleFields[i][0];
                for (let j = 0; j < possibleFields.length; j++) {
                    if (i == j) continue;
                    if (possibleFields[j].includes(subj)) {
                        let idx = possibleFields[j].indexOf(subj);
                        let fields = possibleFields[j].slice(0);
                        fields.splice(idx, 1);
                        possibleFields[j] = fields;
                    }
                }
            }
        }
    }

    let newRules: string[] = [];

    for (let i = 0; i < possibleFields.length; i++) {
        newRules.push(possibleFields[i][0]);
    }

    let ticket: number[] = ticketGens.ticket.next().value;
    let vals: number[] = [];

    for (let i = 0; i < newRules.length; i++) {
        let rule = newRules[i];
        if (rule.slice(0, 'departure'.length) == 'departure') {
            console.log('found!');
            vals.push(ticket[i]);
        }
    }
    console.log(vals);
    return vals.reduce((p, c) => p*c, 1);
}

interface TicketGen {
    rules: IterableIterator<string>;
    ticket: IterableIterator<number[]>;
    nearby: IterableIterator<number[]>;
}

function ticketGen(input: string[]): TicketGen {
    let rules = function*(data: string[]): IterableIterator<string> {
        let str = data[0];
        let i = 0;
        while (str != '') {
            yield str;
            i++;
            str = data[i];
        }
        return '';
    };

    let ticket = function*(data: string[]): IterableIterator<number[]> {
        let i_start = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i] == 'your ticket:') {
                i_start = i + 1;
                break;
            }
        }

        yield data[i_start].split(',').map(c => parseInt(c));
        return '';

        // let str = data[i_start];
        // let i = i_start;
        // while (str != '') {
        //     yield str;
        //     i++;
        //     str = data[i];
        // }
        return '';
    };

    let nearby = function*(data: string[]): IterableIterator<number[]> {
        let i_start = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i] == 'nearby tickets:') {
                i_start = i + 1;
                break;
            }
        }
        for (let i = i_start; i < data.length; i++) {
            yield data[i].split(',').map(c => parseInt(c));
        }
        return '';
    };

    return {
        rules: rules(input),
        ticket: ticket(input),
        nearby: nearby(input)
    };
}

function matcher(reg: RegExp, str: string): RegExpMatchArray {
    let match = reg.exec(str);
    if (!match) {
        throw new Error('invalid regex');
    }
    return match;
}