// export function knot(_data: string | number[]): number[] {
//     const data: number[] = [];
//     if (typeof _data === 'string') {
//         data.push(..._data.split('').map(i => i.charCodeAt(0)));
//         data.push(17, 31, 73, 47, 23);
//     } else {
//         data.push(..._data);
//     }
//     let currPos = 0;
//     let skip = 0;
//     let ring: number[] = [];
//     for (let i = 0; i < 256; i++) {
//         ring.push(i);
//     }

//     for (let j = 0; j < 64; j++) {
//         for (let inp of data) {
//             let targetIDs: number[] = [];
//             let targetVals: number[] = [];

//             for (let i = currPos; i < currPos + inp; i++) {
//                 targetIDs.push(i % ring.length);
//                 targetVals.push(ring[i % ring.length]);
//             }

//             targetIDs.reverse();
//             for (let i = 0; i < targetIDs.length; i++) {
//                 ring[targetIDs[i]] = targetVals[i];
//             }

//             currPos += inp + skip;
//             skip++;
//         }
//     }

//     let dense: number[] = [];

//     for (let i = 0; i < ring.length; i += 16) {
//         dense.push(ring.slice(i+1, i + 16).reduce((p, c) => p ^ c, ring[i]));
//     }

//     return dense;
//     // return dense.map(d => d.toString(16).padStart(2, '0')).join('');
// }

// export function knotHex(_data: string | number[]): string {
//     return knot(_data).map(d => d.toString(16).padStart(2, '0')).join('');
// }

// export function knotBin(_data: string | number[]): string {
//     return knotHex(_data).split('').map(h => parseInt(h, 16).toString(2).padStart(4, '0')).join('');
// }

export class Knot {
    private dense: number[];

    constructor(_data: string | number[]) {
        const data: number[] = [];
        if (typeof _data === 'string') {
            data.push(..._data.split('').map(i => i.charCodeAt(0)));
            data.push(17, 31, 73, 47, 23);
        } else {
            data.push(..._data);
        }
        let currPos = 0;
        let skip = 0;
        let ring: number[] = [];
        for (let i = 0; i < 256; i++) {
            ring.push(i);
        }

        for (let j = 0; j < 64; j++) {
            for (let inp of data) {
                let targetIDs: number[] = [];
                let targetVals: number[] = [];

                for (let i = currPos; i < currPos + inp; i++) {
                    targetIDs.push(i % ring.length);
                    targetVals.push(ring[i % ring.length]);
                }

                targetIDs.reverse();
                for (let i = 0; i < targetIDs.length; i++) {
                    ring[targetIDs[i]] = targetVals[i];
                }

                currPos += inp + skip;
                skip++;
            }
        }

        let dense: number[] = [];

        for (let i = 0; i < ring.length; i += 16) {
            dense.push(ring.slice(i+1, i + 16).reduce((p, c) => p ^ c, ring[i]));
        }

        this.dense = dense;
    }

    get hex(): string {
        return this.dense.map(d => d.toString(16).padStart(2, '0')).join('');
    }

    get bin(): string {
        return this.dense.map(d => d.toString(2).padStart(8, '0')).join('');
    }
}