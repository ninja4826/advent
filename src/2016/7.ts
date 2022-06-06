import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar, zip } from '../util';

export function part1(_input: string[]): number | string {
    const input = _input.map(i => i.split(''));

    const checker = (inp: string[], i: number): boolean => {
        let chars = inp.slice(i, i + 2);
        if (chars[0] == chars[1]) return false;
        chars.push(...chars.slice(0).reverse());
        if (chars.length < 4) return false;
        if (inp.slice(i, i + 4).join('') == chars.join('')) return true;
        return false;
    }
    logger.enable();
    let count = 0;
out:for (let inp of input) {
        let bracketArr: number[][] = [];

        let inBrack = false;
        let currBrack: number[] = [];
        for (let i =0; i < inp.length; i++) {
            if (inp[i] === '[' && inBrack) {
                throw 'is this a thing??';
            }
            if (inp[i] === '[' && !inBrack) {
                inBrack = true;
                currBrack.push(i);
            }
            if (inp[i] === ']' && inBrack) {
                inBrack = false;
                currBrack.push(i);
                bracketArr.push(currBrack.slice(0));
                currBrack = [];
            }
        }

        for (let brack of bracketArr) {
            let str = inp.slice(brack[0], brack[1]);

            for (let i = 0; i < str.length; i++) {
                if (checker(str, i)) {
                    continue out;
                }
            }
        }

        for (let i = 0; i < inp.length; i++) {
            for (let brack of bracketArr) {
                if (i > brack[0] && i < brack[1]) continue;
            }
            if (checker(inp, i)) {
                count++;
                continue out;
            }
        }

        // for (let i = 0; i < inp.length; i++) {
        //     let chars = inp.slice(i, i + 2);
        //     if (chars[0] == chars[1]) continue;
        //     chars.push(...chars.slice(0).reverse());
        //     if (chars.length < 4) continue;
        //     if (inp.slice(i, i + 4).join('') == chars.join('')) {
        //         // if (i > openBracket && i < closeBracket) continue out;
        //         for (let brack of bracketArr) {
        //             if (i > brack[0] && i < brack[1]) continue out;
        //         }
        //         // logger.log(chars.join(''));
        //         logger.log(inp.join(''));
        //         count++;
        //         continue out;
        //     }
        // }

        // for (let i = 0; i < back.length; i++) {
        //     let chars = back.slice(i, i + 2);
        //     if (chars[0] == chars[1]) continue;
        //     chars.push(...chars.slice(0).reverse());
        //     if (chars.length < 4) continue;
        //     if (back.slice(i, i + 4).join('') == chars.join('')) {
        //         console.log(chars.join(''));
        //         count++;
        //         continue out;
        //     }
        // }
    }
    return count;
}

export function part2(_input: string[]): number | string {
    const input = _input.map(i => i.split(''));

    const checker = (inp: string[], i: number): boolean => {
        let chars = inp.slice(i, i + 2);
        if (chars[0] == chars[1]) return false;
        chars.push(chars[0]);

        if (chars.length < 3) return false;
        if (inp.slice(i, i + 3).join('') == chars.join('')) return true;
        return false;
    }

    let count = 0;

out:for (let inp of input) {
        let bracketArr: number[][] = [];
        let inBrack = false;
        let currBrack: number[] = [];

        let supernets: string[][] = [];
        let hypernets: string[][] = [];

        let supernet: string[] = [];
        let hypernet: string[] = [];
        let currArr: string[] = [];

        for (let i = 0; i < inp.length; i++) {
            if (inp[i] === '[' || inp[i] === ']') {
                if (inp[i] === ']' && inBrack) {
                    inBrack = false;
                    currBrack.push(i);
                    bracketArr.push(currBrack.slice(0));
                    currBrack = [];

                    hypernets.push(currArr.slice(0));
                    currArr = [];
                } else if (inp[i] === '[' && !inBrack) {
                    inBrack = true;
                    currBrack.push(i);

                    supernets.push(currArr.slice(0));
                    currArr = [];
                }
            } else {
                if (inBrack) {
                    hypernet.push(inp[i]);
                } else {
                    supernet.push(inp[i]);
                }
                currArr.push(inp[i]);
            }
        }
        if (inp[inp.length - 1] === ']') {
            hypernets.push(currArr.slice(0));
        } else {
            supernets.push(currArr.slice(0));
        }

        let abas: string[] = [];
        let babs: string[] = [];

        for (let net of supernets) {
            for (let i = 0; i < net.length; i++) {
                if (checker(net, i)) {
                    abas.push(net.slice(i, i + 3).join(''));
                }
            }
        }
        for (let hyper of hypernets) {
            for (let i = 0; i < hyper.length; i++) {
                if (checker(hyper, i)) {
                    babs.push(hyper.slice(i, i + 3).join(''));
                }
            }
        }

        // for (let i = 0; i < supernet.length; i++) {
        //     if (checker(supernet, i)) {
        //         abas.push(supernet.slice(i, i + 3).join(''));
        //     }
        // }
        // for (let i = 0; i < hypernet.length; i++) {
        //     if (checker(hypernet, i)) {
        //         babs.push(hypernet.slice(i, i + 3).join(''));
        //     }
        // }
        // console.log(inp.join(''));
        // console.log(supernet.join(''));
        for (let aba of abas) {
            let split = aba.split('');
            let vBab = split[1]+split[0]+split[1];
            for (let bab of babs) {
                if (bab === vBab) {
                    logger.log(inp.join(''));
                    count++;
                    continue out;
                }
            }
        }
        // for (let i = 0; i < inp.length; i++) {
        //     if (inp[i] === '[' || inp[i] === ']') {
        //         if (inp[i] === ']' && inBrack) {
        //             inBrack = false;
        //             currBrack.push(i);
        //             bracketArr.push(currBrack.slice(0));
        //             currBrack = [];

        //             hypernets.push(currArr.slice(0));
        //             currArr = [];
        //         } else if (inp[i] === '[' && !inBrack) {
        //             inBrack = true;
        //             currBrack.push(i);

        //             supernets.push(currArr.slice(0));
        //             currArr = [];
        //         }
        //     } else {
        //         currArr.push(inp[i]);
        //     }
        // }

        // const hyperBabs: string[][] = [];

        // for (let hyper of hypernets) {
        //     for (let i = 0; i < hyper.length; i++) {
        //         if (checker(hyper, i)) hyperBabs.push(hyper.slice(i, i + 3));
        //     }
        // }

        // const superAbas: string[] = hyperBabs.map(h => h[1]+h[0]+h[1]);

        // for (let net of supernets) {
        //     const netStr = net.join('');
        //     for (let aba of superAbas) {
        //         if (netStr.indexOf(aba) !== -1) {
        //             count++;
        //             continue out;
        //         }
        //     }
        // }

        // for (let net of supernets) {
        //     for (let i = 0; i < net.length; i++) {
        //         if (!checker(net, i)) continue;
        //         let char1 = net[i];
        //         let char2 = net[i+1];
        //         let str = char2+char1+char2;
        //         // let str = inp.slice(i, i + 3).join('');
        //         let found = false;
        //         for (let hyper of hypernets) {
        //             if (hyper.join('').indexOf(str) !== -1) found = true;
        //         }
        //         if (found) {
        //             console.log(str, inp.join(''));
        //             count++;
        //             continue out;
        //         }
        //     }
        // }
    }
    return count;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`abba[mnop]qrst
abcd[bddb]xyyx
aaaa[qwer]tyui
ioxxoj[asdfgh]zxcvbn`],
    part2: [`aba[bab]xyz
xyx[xyx]xyx
aaa[kek]eke
zazbz[bzb]cdb `]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };