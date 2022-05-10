export function part1(input: string[]): any {
    let cnt = 0;
    for (let i of input) {
        let ret = evaluateString(i);
        cnt += ret;
        console.log(`${i} = ${ret}`);
        if (isNaN(ret)) {
            return;
        }
    }
    return cnt;
}

export function part2(input: string[]): any {
    let cnt = 0;
    for (let i of input) {
        let ret = evaluateString2(i);
        cnt += ret;
        console.log(`${i} = ${ret}`);
        if (isNaN(ret)) {
            return;
        }
    }
    return cnt;
}

function evaluateString(_str: string): number {
    let str = '';

    for (let s of _str) {
        if (s !== ' ') {
            str += s;
        }
    }
    let arr: string[] = str.split('');

    let depth = 0;
    let cursors: number[] = [];
    let cursor = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == '(') {
            cursors.push(i);
            // cursor = i;
            depth++;
        }

        if (arr[i] == ')') {
            depth--;
            if (depth == 0) {
                let cursor = cursors.pop();
                if (cursor === undefined) throw new Error('ugh');
                str = arr.slice(cursor + 1, i).join('');
                let ret = evaluateString(str);
                arr.splice(cursor, str.length + 2, ret.toString());
                // i = cursor + ret.toString().length - 1;
                i = cursor + 1;
            }
            cursors.pop();
        }
    }
    // console.log(arr.join(''));
    let num = 0;
    let op = '+';
    for (let i = 0; i < arr.length; i++) {
        let a = arr[i];

        if (a == '+') {
            op = '+';
        } else if (a == '*') {
            op = '*';
        } else {
            if (op == '+') {
                num += parseInt(a);
            } else if (op == '*') {
                num *= parseInt(a);
            }
        }
    }

    return num;
}

function evaluateString2(_str: string): number {
    let str = '';

    for (let s of _str) {
        if (s !== ' ') {
            str += s;
        }
    }
    let arr: string[] = str.split('');

    let depth = 0;
    let cursors: number[] = [];
    let cursor = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == '(') {
            cursors.push(i);
            // cursor = i;
            depth++;
        }

        if (arr[i] == ')') {
            depth--;
            if (depth == 0) {
                let cursor = cursors.pop();
                if (cursor === undefined) throw new Error('ugh');
                str = arr.slice(cursor + 1, i).join('');
                let ret = evaluateString2(str);
                arr.splice(cursor, str.length + 2, ret.toString());
                // i = cursor + ret.toString().length - 1;
                i = cursor + 1;
            }
            cursors.pop();
        }
    }
    
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == '+') {
            let a = arr[i - 1];
            let b = arr[i + 1];
            let c = parseInt(a) + parseInt(b);
            arr.splice(i - 1, 3, c.toString());
            i = i - 1;
        }
    }

    let num = 1;

    for (let i = 0; i < arr.length; i++) {
        let a = arr[i];

        if (a !== '*') {
            num *= parseInt(a);
        }
    }

    return num;
}