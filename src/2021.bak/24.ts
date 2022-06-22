export function part1(input: string[]): any {
    let sums = gatherSums(input);
    let digits: number[] = [];
    
    for (let i = 0; i < sums.length; i++) {
        let sum = sums[i];
        if (sum > 0) {
            digits.push(9 - sum);
        } else {
            digits.push(9);
        }
    }
    return digits.join('');
}

export function part2(input: string[]): any {
    let sums = gatherSums(input);
    let digits: number[] = [];
    
    for (let i = 0; i < sums.length; i++) {
        let sum = sums[i];
        if (sum > 0) {
            digits.push(1);
        } else {
            sum = Math.abs(sum);
            digits.push(sum + 1);
        }
    }
    return digits.join('');
}

function gatherSums(data: string[]): number[] {
    let reg = /(\w{3})\s(\w)\s?([\-\w\d]*)/;

    let chunkSize = 18;
    let digits: IDigit[] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        let chunk = data.slice(i, i + chunkSize);
        digits.push({
            optype: parseInt(matcher(chunk[4], reg)[3]),
            correction: parseInt(matcher(chunk[5], reg)[3]),
            offset: parseInt(matcher(chunk[15], reg)[3])
        });
    }

    let stack: number[] = [];
    let arr: number[][] = [];

    for (let i = 0; i < digits.length; i++) {
        let digit = digits[i];
        if (digit.optype == 1) {
            stack.push(i);
        } else {
            let num = stack.pop();
            if (num == undefined) {
                continue;
            }
            arr.push([num, i]);
        }
    }

    let sums: number[] = new Array(14);

    for (let i = 0; i < arr.length; i++) {
        let a = arr[i];
        let sum = digits[a[0]].offset + digits[a[1]].correction;
        sums[a[0]] = sum;
        sums[a[1]] = -sum;
    }

    return sums;
}

function matcher(str: string, reg: RegExp): RegExpMatchArray {
    let _match = str.match(reg);
    if (!_match) throw new Error("ugh");
    let match: RegExpMatchArray = _match;
    return match;
}

interface IDigit {
    optype: number;
    correction: number;
    offset: number;
}