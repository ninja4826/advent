export function part1(_input: string[]): any {
    let input = _input[0].split(',').map(c => parseInt(c));
    
    return playGame(input, 2020);
}

export function part2(_input: string[]): any {
    let input = _input[0].split(',').map(c => parseInt(c));
    // let stack: Map<number, number> = new Map();
    // let next: number = 0;
    // for (let i = 0; i < input.length; i++) {
    //     let subj = input[i];
    //     // let idx = 0;

    //     let s = stack.get(subj);
    //     if (s !== undefined) {
    //         // idx = (i+1) - s;
    //         next = (i + 1) - s;
    //     } else {
    //         next = 0;
    //     }
    //     console.log(`Turn ${i}: ${subj}`);
    //     stack.set(subj, i);
    // }
    // let i_start = stack.size;
    // // for (let i = i_start; i < 30000000; i++) {
    // for (let i = i_start; i < 2020; i++) {
    //     let subj = next;

    //     let s = stack.get(subj);
    //     if (s !== undefined) {
    //         next = i - s;
    //     } else {
    //         next = 0;
    //     }
    //     if (i % 100000 == 0) console.log(`Turn ${i}: ${subj}`);
    //     console.log(`Turn ${i}: ${subj}`);
    //     stack.set(subj, i);
    // }

    // // console.log(stack);
    // return next;

    return playGame(input, 30000000);
}

function playGame(starter: number[], turns: number): number {
    let stack: Map<number, number> = new Map();
    let next = 0;

    for (let i = 0; i < starter.length; i++) {
        let subj = starter[i];

        let s = stack.get(subj);
        if (s !== undefined) {
            next = (i + 1) - s;
        } else {
            next = 0;
        }
        stack.set(subj, i);
    }

    let i_start = stack.size;

    for (let i = i_start; i < (turns - 1); i++) {
        let subj = next;

        let s = stack.get(subj);
        if (s !== undefined) {
            next = i - s;
        } else {
            next = 0;
        }
        stack.set(subj, i);
    }

    return next;
}