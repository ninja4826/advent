export function part1(input: string[]): any {
    let rules: any = {};

    let testStart = 0;
    for (let i = 0; i < input.length; i++) {
        let rule = input[i];
        if (rule == '') {
            testStart = i + 1;
            break;
        }

        let [num, r] = rule.split(': ');

        rules[num] = r.split(' | ').map((c: any) => c.split(' '));
    }

    let regStr = '^'+genRegex(rules)+'$';
    console.log(regStr);
    let reg = new RegExp(regStr);
    let cnt = 0;
    for (let i = testStart; i < input.length; i++) {
        let test = input[i];
        let match = test.match(reg);
        if (match) {
            cnt++;
        }
    }
    return cnt;
}

export function part2(input: string[]): any {
    let rules: any = {};

    let testStart = 0;
    for (let i = 0; i < input.length; i++) {
        let rule = input[i];
        if (rule == '') {
            testStart = i + 1;
            break;
        }

        let [num, r] = rule.split(': ');

        rules[num] = r.split(' | ').map((c: any) => c.split(' '));
    }

    rules['8'] = [['42'], ['42', '8']];
    rules['11'] = [['42', '31'], ['42', '11', '31']];

    let regStr = '^'+genRegex(rules)+'$';
    console.log(regStr);
    let reg = new RegExp(regStr);
    let cnt = 0;
    for (let i = testStart; i < input.length; i++) {
        let test = input[i];
        let match = test.match(reg);
        if (match) {
            cnt++;
        }
    }
    return cnt;
}

function matcher(reg: RegExp, str: string): RegExpMatchArray {
    let match = reg.exec(str);
    if (!match) throw new Error('invalid regex');
    return match;
}

function genRegex(rules: any, r = '0', depth = 15): string {
    if (depth == 0) {
        return '';
    }
    if (rules[r][0][0].startsWith('"')) {
        return rules[r][0][0].slice(1, rules[r][0][0].length - 1);
    }

    let str = '(';
    str += rules[r].map((subrule: any) => subrule.map((sub: any) => genRegex(rules, sub, depth - 1)).join('')).join('|');
    str += ')';

    return str;
}