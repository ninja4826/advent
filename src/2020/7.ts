export function part1(input: string[]): any {
    let reg = /([\w\s]+)\sbags contain\s([\w\s,]+)\./;
    let nest: any = {};
    for (let i = 0; i < input.length; i++) {
        let ln = input[i];
        let match = matcher(ln, reg);
        nest[match[1]] = [];
        if (match[2] != 'no other bags') {
            let insides = match[2].split(', ');
            let insideMatches = insides.map(c => matcher(c, /(\d+)\s([\w\s]+)\sbags?\.?/)[2]);
            nest[match[1]].push(...insideMatches);
        }
    }
    let l: Set<string> = new Set();
    // console.log(nest);
    l.add('shiny gold');
    let s = searchForGold(nest, l);
    s.delete('shiny gold');
    // console.log(s);
    return s.size;
    // console.log(nest);
}

export function part2(input: string[]): any {
    let reg = /([\w\s]+)\sbags contain\s([\w\s,]+)\./;
    // let nest: any = {};
    let nest: { [key: string]: Bag[] } = {};

    for (let i = 0; i < input.length; i++) {
        let ln = input[i];
        let match = matcher(ln, reg);
        nest[match[1]] = [];
        if (match[2] != 'no other bags') {
            let insides = match[2].split(', ');
            // let insideMatches = insides.map(c => matcher(c,  /(\d+)\s([\w\s]+)\sbags?\.?/)[2]);
            let insideMatches: Bag[] = insides.map(c => {
                let m = matcher(c,  /(\d+)\s([\w\s]+)\sbags?\.?/);
                return {
                    name: m[2],
                    insideCnt: parseInt(m[1])
                };
            });
            nest[match[1]].push(...insideMatches);
        }
    }
    // console.log(nest);
    return countGold('shiny gold', nest);
}

function searchForGold(nest: any, list: Set<string>): Set<string> {
    // let ret: Set<string> = new Set();
    // console.log('called search');
    // console.log(list);
    for (let k in nest) {
        for (let l of list) {
            if (nest[k].includes(l)) {
                list.add(k);
                delete nest[k];
                let rec = searchForGold(nest, list);
                for (let r of rec) {
                    list.add(r);
                }
                break;
            }
        }
    }
    // console.log(nest);
    return list;
}

function countGold(name: string, nest: { [key: string]: Bag[] }): number {
    let count = 0;
    for (let b of nest[name]) {
        count += (b.insideCnt + (b.insideCnt * countGold(b.name, nest)));
    }
    return count;
}

function matcher(str: string, reg: RegExp): RegExpMatchArray {
    let _match = str.match(reg);
    if (!_match) throw new Error("ugh");
    let match: RegExpMatchArray = _match;
    return match;
}

interface Bag {
    name: string;
    insideCnt: number;
}