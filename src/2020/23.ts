export function part1(input: string[]): any {
    let nums = input[0].split('').map(c => parseInt(c));

    let newArr = runGame(nums, nums.length, 100);
    // console.log(newArr);

    let x: number = <number>newArr.get(1);
    let res = '';
    while (x != 1) {
        res += x.toString();
        x = <number>newArr.get(x);
    }

    return res;
}

export function part2(input: string[]): any {
    let nums = input[0].split('').map(c => parseInt(c));
    // let oldNum = Math.max(...nums);
    for (let i = Math.max(...nums) + 1; i <= 1000000; i++) {
        nums.push(i);
    }

    // console.log(nums.indexOf(oldNum + 1));

    let newArr = runGame(nums, 1000000, 10000000);
    let first = <number>newArr.get(1);
    let res = first * <number>newArr.get(first);

    return res;
}

// function runGame(nums: number[], moves: number, max: number): number[] {
//     for (let i = 0; i < moves; i++) {
//         let pickUp = nums.splice(1, 3);

//         let dest = nums[0] - 1;
        
//         while (true) {
//             if (dest <= 0) {
//                 // dest = Math.max(...nums);
//                 dest = max;
//             }
//             if (nums.indexOf(dest) == -1) {
//                 dest -= 1;
//                 continue;
//             }
//             break;
//         }

//         nums.splice(nums.indexOf(dest)+1, 0, ...pickUp);
//         let shifted = nums.shift();
//         if (shifted === undefined) throw new Error('uighhhhh');
//         nums.push(shifted);
//         // console.log(nums.join(''));
//         let perc = (i / moves) * 10;
//         if (perc % 5 == 0) console.log(`${i}/${moves}`);
//     }

//     return nums;
// }

function runGame(cups: number[], fullLen: number, moves: number): Map<number, number> {
    let cupList: Map<number, number> = new Map();

    for (let i = 0; i < fullLen; i++) {
        if (i < cups.length - 1) {
            cupList.set(cups[i], cups[i+1]);
        } else if (i == cups.length - 1 && cups.length == fullLen) {
            cupList.set(cups[i], cups[0]);
        } else if (i == cups.length - 1 && cups.length < fullLen) {
            cupList.set(cups[i], Math.max(...cups) + 1);
        } else if (i < fullLen - 1) {
            cupList.set(i+1, i + 2);
        } else if (i == fullLen - 1) {
            cupList.set(i+1, cups[0]);
        }
    }

    let ptr: number = cups[0];

    for (let i = 0; i < moves; i++) {
        let c1 = <number>cupList.get(ptr);
        let c2 = <number>cupList.get(c1);
        let c3 = <number>cupList.get(c2);
        cupList.set(ptr, <number>cupList.get(c3));

        // let dest = ((ptr - 2) % fullLen) + 1;
        let dest = ((((ptr - 2) % fullLen) + fullLen) % fullLen) + 1;

        while ([c1, c2, c3].includes(dest)) {
            dest = ((((dest - 2) % fullLen) + fullLen) % fullLen) + 1;
        }

        cupList.set(c3, <number>cupList.get(dest));
        cupList.set(dest, c1);

        ptr = <number>cupList.get(ptr);
    }

    return cupList;
}