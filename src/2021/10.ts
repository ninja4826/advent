export function part1(input: string[]): any {
    let score = 0;
    let sMap: any = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137
    }
    for (let i = 0; i < input.length; i++) {
        let iStr = reduceChunks(input[i]);

        if (iStr.corrupt) {
            // // // console.log(`${input[i]} - Expected ${iStr.expected}, but found ${iStr.found} instead.`);
            score += sMap[iStr.found];
        }
    }
    return score;
}
export function part2(input: string[]): any {
    let scores: number[] = [];
    let sMap: any = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4
    }
    for (let i = 0; i < input.length; i++) {
        let iStr = reduceChunks(input[i]);

        if (!iStr.corrupt) {
            // // // console.log(`${input[i]} - Complete by adding ${iStr.autocomplete}.`);
            // score += sMap[iStr.found];
            let score = 0;
            for (let j of iStr.autocomplete) {
                score *= 5;
                score += sMap[j];
            }
            scores.push(score);
        }
    }

    scores.sort((a, b) => a - b);

    let midIdx = Math.floor(scores.length / 2);

    return scores[midIdx];
}

function setCharAt(str: string, index: number, chr: string) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index+1);
}

interface ReduceRet {
    corrupt: boolean;
    expected: string;
    found: string;
    autocomplete: string;
}

function reduceChunks(str: string): ReduceRet {
    const openers = ['(', '[', '{', '<'];
    const closers = [')', ']', '}', '>'];
    const openMap: any = {};
    for (let i = 0; i < openers.length; i++) openMap[openers[i]] = closers[i];
    let newStr = str[0];
    for (let i = 1; i < str.length; i++) {
        let s = str[i];
        if (openers.includes(s)) {
            newStr += s;
        } else {
            let expected: string = openMap[newStr.slice(-1)];
            if (s == expected) {
                newStr = newStr.slice(0, -1);
            } else {
                let reversed = newStr.split('').reverse();
                let auto = reversed.map(v => openMap[v]).join('');

                return {
                    corrupt: true,
                    expected: expected,
                    found: str[i],
                    autocomplete: auto
                };
            }
        }
    }

    let reversed = newStr.split('').reverse();
    let auto = reversed.map(v => openMap[v]).join('');
    return {
        corrupt: false,
        expected: '',
        found: '',
        autocomplete: auto
    };
}