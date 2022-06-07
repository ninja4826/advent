import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar, zip } from '../util';

export function part1(input: string[]): number | string {
    let out: string[] = [];

    for (let i = 0; i < input.length; i++) {
        const inp = input[i];
        
        if (inp === '(') {
            let sliced = input.slice(i+1);
            let closeIdx = sliced.indexOf(')');
            let split = sliced.slice(0, closeIdx).join('').split('x');
            let range = +split[0];
            let iter = +split[1];

            let str = sliced.slice(closeIdx + 1, closeIdx+range + 1).join('').repeat(iter);

            out.push(...str.split(''));
            i = i+closeIdx+range+1;
        } else {
            out.push(inp);
        }
    }
    // console.log(out.join(''));
    return out.length;
}

// export function part2(input: string[]): number | string {
//     const b1 = progBar('E in Cyber', input.length);
//     for (let i = 0; i < input.length; i++) {
//         const inp = input[i];

//         if (inp === '(') {
//             let sliced = input.slice(i+1);
//             let closeIdx = sliced.indexOf(')');
//             let [range, iter] = sliced.slice(0, closeIdx).join('').split('x').map(Number);
            
//             let str = sliced.slice(closeIdx + 1, closeIdx+range + 1).join('').repeat(iter);
//             // logger.log(str);
//             input.splice(i, closeIdx+range+2, ...str.split(''));
//             // i += closeIdx + range + 1;
//             i -= 1;
//         }
//         b1.setTotal(input.length);
//         b1.update(i + 1);
//     }
//     b1.stop();
//     if (input.length > 100) {
//         return input.length;
//     }
//     return input.join('');
// }

export function part2(input: string[]): number | string {
    let reg = /\((\d+)x(\d+)\)/;

    const unzip = (s: string): number => {
        let match = s.match(reg);
        if (match === null) return s.length;

        let length = +match[1];
        let times = +match[2];
        let start = <number>match.index + match[0].length;
        let count = unzip(s.slice(start, start + length));

        return s.slice(0, <number>match.index).length
            + times * count
            + unzip(s.slice(start + length));
    };

    return unzip(input.join(''));
}

// const transform = transforms.lines;
const transform = (d: string): string[] => d.split('');

const testData = {
    part1: ['ADVENT', 'A(1x5)BC', '(3x3)XYZ', 'A(2x2)BCD(2x2)EFG', '(6x1)(1x3)A', 'X(8x2)(3x3)ABCY'],
    part2: ['(3x3)XYZ', 'X(8x2)(3x3)ABCY', '(27x12)(20x12)(13x14)(7x10)(1x12)A', '(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN']
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };