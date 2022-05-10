export function part1(input: string[]): any {
    let herd = new Herd(input);

    // herd.print();
    // herd.step();
    // herd.print();

    let i = 1;
    while (herd.step()) {
        // // // console.log(`Herd after ${i} step(s).`);
        i++;
        // herd.print();
        if (i > 1000) {
            // // console.log('ugh');
            break;
        }
    }
    return i;
}

export function part2(input: string[]): any {
    
}

enum Direction {
    None = ".",
    East = ">",
    South = "v"
};

interface Cucumber {
    x: number;
    y: number;
    dir: Direction;
}

// class Herd {
//     map: Cucumber[][];

//     constructor(input: string[]) {
//         this.map = [];
//         for (let y = 0; y < input.length; y++) {
//             let i = input[y];
            
//             let _map: Cucumber[] = [];

//             for (let x = 0; x < i.length; x++) {
//                 let j = i[x];
//                 let dir: Direction = Direction.None;

//                 if (j == '>') {
//                     dir = Direction.East;
//                 } else if (j == 'v') {
//                     dir = Direction.South;
//                 }

//                 _map.push({
//                     x,
//                     y,
//                     dir
//                 });
//             }

//             this.map.push(_map);
//         }
//     }

//     print(): void {
//         let str: string[] = [];
//         for (let y of this.map) {
//             str.push(y.map(c => c.dir).join(''));
//         }
//         // // console.log(str.join('\n'));
//     }
// }

class Herd {
    map: string[];

    constructor(input: string[]) {
        this.map = input;
    }

    step(): boolean {
        // Do East herd first
        let oldMap: string[] = [];
        let newMap: string[] = [];

        for (let i of this.map) {
            newMap.push(i);
            oldMap.push(i);
        }
        for (let i = 0; i < this.map.length; i++) {
            // for (let j = this.map[i].length - 1; j >= 0; j--) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (this.map[i][j] != '>') continue;
                // // // console.log(j);
                // let str = newMap[i];
                let nextIdx = j + 1;
                if (nextIdx >= this.map[i].length) {
                    nextIdx = 0;
                }

                if (this.map[i][nextIdx] == '.') {
                    // // // console.log('need to move');
                    // // // console.log(this.map[i]);
                    // // // console.log(`${j} ${nextIdx}`);
                    newMap[i] = setCharAt(newMap[i], nextIdx, '>');
                    newMap[i] = setCharAt(newMap[i], j, '.');
                }

                // newMap[i] = str;
            }
        }

        this.map = newMap;

        newMap = [];
        for (let i of this.map) {
            newMap.push(i);
        }

        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (this.map[i][j] != 'v') continue;

                let str = newMap[i];
                let nextIdx = i + 1;
                if (nextIdx >= this.map.length) {
                    nextIdx = 0;
                }

                if (this.map[nextIdx][j] == '.') {
                    newMap[nextIdx] = setCharAt(newMap[nextIdx], j, 'v');
                    newMap[i] = setCharAt(newMap[i], j, '.');
                }
            }
        }

        this.map = newMap;

        for (let i = 0; i < this.map.length; i++) {
            if (this.map[i] != oldMap[i]) {
                return true;
            }
        }
        return false;
    }

    print(): void {
        // // console.log(this.map.join('\n'));
        // // console.log();
    }
}

function setCharAt(str: string, index: number, chr: string) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index+1);
}