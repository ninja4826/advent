export function part1(input: string[]): any {
    return detectLoop(input)[1];
}

export function part2(input: string[]): any {
    for (let i = 0; i < input.length; i++) {
        let copy = [ ...input ];
        let ln = copy[i];
        let act = ln.slice(0, 3);
        let doBreak = false;

        let fin: boolean = false;
        let acc: number = 0;

        if (act === 'jmp') {
            copy[i] = 'nop'+ln.slice(3);
            [ fin, acc ] = detectLoop(copy);
            if (fin) {
                doBreak = true;
            }
        }

        if (act === 'nop') {
            copy[i] = 'jmp'+ln.slice(3);
            [ fin, acc ] = detectLoop(copy);
            if (fin) {
                doBreak = true;
            }
        }

        if (doBreak) {
            return acc;
        }
    }
}

function detectLoop(data: string[]): [boolean, number] {
    let reg = /(\w{3})\s(\+\d+|\-\d+)/;
    let ret = true;
    let acc = 0;

    let i = 0;
    let hist: number[] = [];
    while (i < data.length) {
        if (hist.includes(i)) {
            ret = false;
            break;
        }
        hist.push(i);

        let match = matcher(data[i], reg);
        let act = match[1];
        let num = parseInt(match[2]);

        if (act === 'jmp') {
            i += num;
            continue;
        }
        if (act === 'acc') {
            acc += num;
        }
        i++;
    }
    return [ ret, acc ];
}

function matcher(str: string, reg: RegExp): RegExpMatchArray {
    let _match = str.match(reg);
    if (!_match) throw new Error("ugh");
    let match: RegExpMatchArray = _match;
    return match;
}