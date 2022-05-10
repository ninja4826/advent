export function part1(input: string[]): any {
    let pol = new Polymer(input);
    pol.step(10);
    let count = 0;

    for (let k in pol.letterMap) {
        count += pol.letterMap[k];
    }

    // // // console.log(count);
    // // // console.log(pol.letterMap);

    let flipped: any = {};

    for (let k in pol.letterMap) {
        let v = pol.letterMap[k];
        flipped[v] = k;
    }

    const sizes: number[] = Object.keys(flipped).map(Number);

    let min = Math.min(...sizes);
    let max = Math.max(...sizes);

    return max - min;
}

class Polymer {
    rules: Rule[];
    original: string;
    currMap: any = {};
    nextMap: any = {};
    letterMap: any = {};

    constructor(input: string[]) {
        let polymer = input.shift();
        input.shift();
        if (!polymer) throw new Error("Input formatted incorrectly.");

        this.original = polymer;

        this.rules = input.map(c => {
            let match = c.match(/(\w)(\w)\s->\s(\w)/);
            if (!match) throw new Error("Input formatted incorrectly.");
            return {
                first: match[1],
                second: match[2],
                wedge: match[3]
            };
        });

        for (let i = 0; i < polymer.length - 1; i++) {
            let polStr: string = polymer[i] + polymer[i+1];
            if (polStr in this.currMap) {
                this.currMap[polStr] += 1;
            } else {
                this.currMap[polStr] = 1;
            }
            
            if (polymer[i] in this.letterMap) {
                this.letterMap[polymer[i]] += 1;
            } else {
                this.letterMap[polymer[i]] = 1;
            }
            if (i == polymer.length - 2) {
                if (polymer[i+1] in this.letterMap) {
                    this.letterMap[polymer[i+1]] += 1;
                } else {
                    this.letterMap[polymer[i+1]] = 1;
                }
            }
        }
        // // // console.log('initial lettermap');
        // // // console.log(this.letterMap);
    }

    step(n: number = 1) {
        for (let i = 1; i <= n; i++) {
            this.nextMap = {};
            for (let k in this.currMap) {
                this.nextMap[k] = this.currMap[k];
            }
            // if (i == n) {
            //     // // console.log('BEFORE');
            //     // // console.log(this.currMap);
            // }
            // for (let r of this.rules) {
            //     let key = r.first + r.second;
            //     if (key in this.currMap && this.currMap[key] > 0) {
            //         let firstKey = r.first + r.wedge;
            //         let secondKey = r.wedge + r.second;

            //         if (firstKey in this.nextMap) {
            //             this.nextMap[firstKey] += 1;
            //         } else {
            //             this.nextMap[firstKey] = 1;
            //         }

            //         if (secondKey in this.nextMap) {
            //             this.nextMap[secondKey] += 1;
            //         } else {
            //             this.nextMap[secondKey] = 1;
            //         }

            //         if (r.wedge in this.letterMap) {
            //             this.letterMap[r.wedge] += 1;
            //         } else {
            //             this.letterMap[r.wedge] = 1;
            //         }

            //         this.nextMap[key] += -1;
            //     }
            //     if (i == n) {
            //         // // console.log('AFTER THIS RULE');
            //         // // console.log(r);
            //         // // console.log(this.nextMap);
            //     }
            // }

            if (i == n) {
            // if (true) {
                // // // console.log('BEFORE '+i);
                // // // console.log(this.currMap);
            }
            for (let r of this.rules) {
                let key = r.first + r.second;
                if (key in this.currMap && this.currMap[key] > 0) {
                    let firstKey = r.first + r.wedge;
                    let secondKey = r.wedge + r.second;
                    let polyVal = this.currMap[key];
                    if (firstKey in this.nextMap) {
                        this.nextMap[firstKey] += polyVal;
                    } else {
                        this.nextMap[firstKey] = polyVal;
                    }

                    if (secondKey in this.nextMap) {
                        this.nextMap[secondKey] += polyVal;
                    } else {
                        this.nextMap[secondKey] = polyVal;
                    }

                    if (r.wedge in this.letterMap) {
                        this.letterMap[r.wedge] += polyVal;
                    } else {
                        this.letterMap[r.wedge] = polyVal;
                    }

                    this.nextMap[key] -= polyVal;
                }
            }



            // // // console.log('AFTER '+i);
            // // // console.log(this.nextMap);

            this.currMap = {};
            for (let k in this.nextMap) {
                this.currMap[k] = this.nextMap[k];
            }
        }
    }

    get length(): number {
        let count = 1;
        for (let k in this.currMap) {
            count += this.currMap[k];
        }
        return count;
    }
}

export function part2(input: string[]): any {
    let pol = new Polymer(input);
    pol.step(40);
    let count = 1;

    for (let k in pol.currMap) {
        count += pol.currMap[k];
    }

    // // // console.log(count);
    // // // console.log(pol.letterMap);

    let flipped: any = {};
    for (let k in pol.letterMap) {
        let v = pol.letterMap[k];
        flipped[v] = k;
    }
    const sizes: number[] = Object.keys(flipped).map(Number);

    let min = Math.min(...sizes);
    let max = Math.max(...sizes);

    return max - min;
}

// export function part2(input: string[]): any {
//     let polymer = input.shift();
//     let original = polymer;
//     if (!polymer) return;
//     input.shift();

//     let rules = input.map(c => {
//         let match = c.match(/(\w)(\w)\s->\s(\w)/);
//         if (!match) throw new Error("Input formatted incorrectly.");
//         return {
//             first: match[1],
//             second: match[2],
//             wedge: match[3]
//         };
//     });
//     // // // console.log(`Template: ${original}`);
//     for (let i = 1; i <= 40; i++) {
//         polymer = step(polymer, rules);
//         // // console.log(`${i} - ${polymer.length}`);
//         // // // console.log(`After step ${i}: ${polymer}`);
//     }

//     let countMap: any = {};

//     let keys = [...new Set(polymer.split(''))];
//     let counts = [];

//     for (let k of keys) {
//         let count = polymer.split('').filter(p => p == k).length;
//         counts.push(count);
//         countMap[k] = count;
//     }

//     // // console.log(polymer.length);
//     // // console.log(countMap);

//     let min = Math.min(...counts);
//     let max = Math.max(...counts);

//     return max - min;
// }

interface Rule {
    first: string;
    second: string;
    wedge: string;
}

function step(polymer: string, rules: Rule[]): string {
    let str = polymer[0];
    for (let i = 0; i < polymer.length; i++) {
        if ((i + 1) >= polymer.length) break;

        for (let r of rules) {
            if (polymer[i] == r.first && polymer[i+1] == r.second) {
                str += r.wedge;
            }
        }
        str += polymer[i+1];
    }
    return str;
}


// function check(str) {
//     let map = {};
//     for (let i = 0; i < str.length - 1; i++) {
//         let polStr = str[i] + str[i+1];
//         if (polStr in map) {
//             map[polStr] += 1;
//         } else {
//             map[polStr] = 1;
//         }
//     }
//     return map;
// }