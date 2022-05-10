export function part1(input: string[]): any {
    let reg1 = /mask = (\w{36})/;
    let reg2 = /mem\[(\d+)\] = (\d+)/;

    let masks: Mask[] = [];
    let mem: number[] = new Array(36).fill(0);

    for (let i = 0; i < input.length; i++) {
        let match: RegExpMatchArray;
        try {
            match = matcher(reg1, input[i]);
            masks = getMasks(match[1]);
        } catch (e) {
            match = matcher(reg2, input[i]);
            let loc = parseInt(match[1]);
            let num = masker(match[2], masks);

            mem[loc] = num;
        }
    }

    return mem.reduce((p, c) => p + c, 0);
}

export function part2(input: string[]): any {
    let reg1 = /mask = (\w{36})/;
    let reg2 = /mem\[(\d+)\] = (\d+)/;

    // let masks: Mask[] = [];
    let mask = '';
    let mem: { [key: number]: number } = {};

    for (let i = 0; i < input.length; i++) {
        let match: RegExpMatchArray;
        try {
            match = matcher(reg1, input[i]);
            mask = match[1];
        } catch (e) {
            match = matcher(reg2, input[i]);
            let locs = getMems(mask, parseInt(match[1]));
            let num = parseInt(match[2]);

            for (let l of locs) {
                mem[l] = num;
                // console.log(`mem[${l}] = ${num}`);
            }
            console.log(`(${i+1}/${input.length})`);
        }
    }

    // console.log(getMems('00000000000000000000000000000000X0XX', 26));
    // return mem.reduce((p, c) => p + c, 0);
    // console.log(mem[37]);
    // mem.sort((a, b) => b - 1);
    // console.log(mem[0]);
    let newMems: number[] = [];
    for (let _m in mem) {
        let m = mem[_m];
        if (m == undefined || m === 0) break;
        newMems.push(m);
    }
    return newMems.reduce((p, c) => p + c, 0);
}

interface Mask {
    i: number;
    v: string;
}

function matcher(reg: RegExp, str: string): RegExpMatchArray {
    let match = reg.exec(str);
    if (!match) throw new Error('invalid regex match');
    return match;
}

function getMasks(str: string): Mask[] {
    let masks: Mask[] = [];

    for (let i = 0; i < str.length; i++) {
        let v = str[i];
        if (v == 'X') continue;
        masks.push({ i, v });
    }
    return masks;
}

function masker(num: number | string, masks: Mask[]): number {
    let dec: string[];

    if (typeof num == 'string') {
        dec = dec2bin(parseInt(num));
    } else {
        dec = dec2bin(num);
    }
    
    for (let m of masks) {
        dec[m.i] = m.v;
    }

    let decStr = dec.join('');
    return parseInt(decStr, 2);
}

function dec2bin(dec: number, len = 0): string[] {
    return (dec >>> 0).toString(2).padStart(len, '0').split('');
}

function getMems(_mask: string, num: number): number[] {
    let mask = _mask.split('');
    let mems: number[] = [];

    let numStr = dec2bin(num, 36);

    for (let i = 0; i < mask.length; i++) {
        if (mask[i] == '1') {
            numStr[i] = '1';
        }
    }

    let floats: number[] = [];

    for (let i = 0; i < mask.length; i++) {
        if (mask[i] == 'X') floats.push(i);
    }

    for (let i = 0; i <= parseInt('1'.repeat(floats.length), 2); i++) {
        let str = (i >>> 0).toString(2).padStart(floats.length, '0');

        for (let j = 0; j < str.length; j++) {
            numStr[floats[j]] = str[j];
        }
        mems.push(parseInt(numStr.join(''), 2));
    }

    return mems;
}