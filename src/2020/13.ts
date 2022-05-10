export function part1(input: string[]): any {
    let earliest = parseInt(input[0]);
    let times = input[1].split(',').map(c => parseInt(c)).filter(v => !isNaN(v));

    console.log(times);

    let newTimes = times.map(c => (Math.floor(earliest / c) + 1) * c);

    let min = Number.MAX_SAFE_INTEGER ;
    let minIdx = 0;
    for (let i = 0; i < times.length; i++) {
        if (newTimes[i] < min) {
            minIdx = i;
            min = newTimes[i];
        }
    }
    return times[minIdx] * (min - earliest);
}

export function part2(input: string[]): any {
    let split = input[1].split(',');
    let times = split.map(c => parseInt(c)).filter(v => !isNaN(v));
    // let offsets = times.map((v, i) => v - i);
    let offsets: number[] = [];

    for (let i = 0; i < split.length; i++) {
        let p = parseInt(split[i]);
        if (!isNaN(p)) {
            console.log(`(p,i): (${p},${i}) = ${p - i}`);
            offsets.push(p - i);
        }
    }

    console.log('times:', times);
    console.log('offsets:', offsets);

    return crt(times, offsets);
}

// function chineseRemainder(num: number[], rem: number[]): number {
//     let mulInv = (a: number, b: number): number => {
//         const b0 = b;
//         let [ x0, x1 ] = [ 0, 1 ];

//         if (b === 1) {
//             return 1;
//         }

//         while (a > 1) {
//             const q = Math.floor(a / b);
//             [ a, b ] = [b, a % b];
//             [x0, x1] = [x1 - q * x0, x0];
//         }
//         if (x1 < 0) {
//             x1 += b0;
//         }
//         return x1;
//     };

//     let sum = 0;
//     const prod = num.reduce((a, c) => a * c, 1);

//     for (let i = 0; i < Math.min(num.length, rem.length); i++) {
//         const [ni, ri] = [num[i], rem[i]];
//         const p = Math.floor(prod / ni);
//         sum += ri * p * mulInv(p, ni);
//     }
//     return sum % prod;
// }

function crt(num: number[], rem: number[]): number {
    let sum = 0;
    const prod = num.reduce((a, c) => a * c, 1);

    for (let i = 0; i < num.length; i++) {
        const [ni, ri] = [num[i], rem[i]];
        const p = Math.floor(prod / ni);
        sum += ri * p * mulInv(p, ni);
    }
    return sum % prod;
}

function mulInv(a: number, b: number): number {
    const b0 = b;
    let [x0, x1] = [0,1];

    if (b === 1) {
        return 1;
    }

    while (a > 1) {
        const q = Math.floor(a / b);
        [a, b] = [b, a % b];
        [x0, x1] = [x1 - q * x0, x0];
    }
    if (x1 < 0) {
        x1 += b0;
    }
    return x1;
}