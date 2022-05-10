export function part1(_input: string[]): any {
    let input = [0, ..._input.map(c => parseInt(c))];

    input = input.sort((a, b) => a - b);
    input.push(Math.max(...input) + 3);
    console.log(input);

    let jolts = 0;

    let counts: [number, number] = [0, 0];

    for (let i = 1; i < input.length; i++) {
        let j = i - 1;
        let diff = input[i] - input[j];
        if (diff == 1) {
            counts[0]++;
        } else if (diff == 3) {
            counts[1]++;
        }
    }

    return counts[0] * counts[1];
}

export function part2(_input: string[]): any {
    let input = [0, ..._input.map(c => parseInt(c))];

    input = input.sort((a, b) => a - b);
    input.push(Math.max(...input) + 3);
    console.log('len:', input.length);

    // for (let i = 1; i < input.length; i++) {

    // }

    // let recursed = [input, ...recurseValidation(input)];
    // for (let r of recursed) {
    //     console.log(r.join(', '));
    // }
    // console.log(recursed);
    let recursed = pathsToEnd(0, input);
    // return recursed.length;
    return recursed;
}

function validate(input: number[]): boolean {
    for (let i = 1; i < input.length; i++) {
        let j = i - 1;
        let diff = input[i] - input[j];
        if (diff > 3) {
            return false;
        }
    }
    return true;
}

function pathsToEnd(idx: number, input: number[]): number {
    if (idx == input.length - 1) {
        return 1;
    }
    // console.log(idx);
    // let ret = 0;
    let range: number[] = [];
    
    for (let j = idx + 1; j < Math.min(idx + 4, input.length); j++) {
        if (input[j] - input[idx] <= 3) {
            if (idx == 0) {
                console.log(j);
            }
            range.push(pathsToEnd(j, input));
        }
    }
    // console.log('returning');
    return range.reduce((p, c) => p+c, 0);
}

function recurseValidation(input: number[]): Set<string> {
    // console.log(input);
    let patterns: Set<string> = new Set();

    for (let remIdx = 2; remIdx < input.length - 1; remIdx++) {
        let newInput = [...input.slice(0, remIdx - 1), ...input.slice(remIdx)];
        if (validate(newInput)) {
            // patterns.push(newInput, ...recurseValidation(newInput));
            // patterns.push(newInput.join(', '), ...recurseValidation(newInput));
            patterns.add(newInput.join(','));
            let rec = recurseValidation(newInput);
            for (let r of rec) {
                patterns.add(r);
            }
        }
    }
    // console.log(patterns.size);
    return patterns;
}