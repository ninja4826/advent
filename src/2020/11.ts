export function part1(_input: string[]): any {
    let input: string[][] = _input.map(c => c.split(''));
    let old = input.map(c => c.slice());

    let didChange = true;

    while (didChange) {
        [didChange, input] = step(input);
    }
    let cnt = 0;
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] == '#') cnt++; 
        }
    }
    return cnt;
}

export function part2(_input: string[]): any {
    let input: string[][] = _input.map(c => c.split(''));
    let old = input.map(c => c.slice());

    let didChange = true;
    // console.log(input.map(c => c.join('')).join('\n'));
    // [didChange, input] = step(input, true);
    // console.log();
    // console.log(input.map(c => c.join('')).join('\n'));
    // [didChange, input] = step(input, true);
    // console.log();
    // console.log(input.map(c => c.join('')).join('\n'));

    while (didChange) {
        [didChange, input] = step(input, true);
    }
    let cnt = 0;
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] == '#') cnt++; 
        }
    }
    return cnt;
}

function step(data: string[][], p2 = false): [ boolean, string[][] ] {
    let old = data.map(c => c.slice());
    let didChange = false;

    let doStep = (cx: number, cy: number): boolean => {
        let self = data[cy][cx];

        if (self == '.') return false;
        let neighbors: [number, number][] = [];

        for (let _y = -1; _y < 2; _y++) {
            for (let _x = -1; _x < 2; _x++) {
                if (_x == 0 && _y == 0) continue;

                let relX = 0;
                let relY = 0;

                if (p2) {
                    let found = false;
                    relX = cx;
                    relY = cy;
                    while (!found) {
                        relX += _x;
                        relY += _y;

                        if (relX < 0 || relX >= data[0].length) {
                            break;
                        }
                        if (relY < 0 || relY >= data.length) {
                            break;
                        }
                        if (found) break;
                        if (old[relY][relX] !== '.') {
                            found = true;
                        }
                    }
                    if (!found) continue;
                } else {
                    relX = cx + _x;
                    relY = cy + _y;
                    if (relX < 0 || relX >= data[0].length) continue;
                    if (relY < 0 || relY >= data.length) continue;
                }

                // console.log(relX, relY);
                // console.log(_x, _y);

                if (data[relY][relX] == '.') continue;

                neighbors.push([relX, relY]);
            }
        }

        if (self == 'L') {


            // console.log(neighbors);


            let occ = false;

            for (let nP of neighbors) {
                if (old[nP[1]][nP[0]] == '#') {
                    occ = true;
                    break;
                }
            }

            if (!occ) {
                data[cy][cx] = '#';
                return true;
            }
        } else {
            // self == '#' (occupied)
            let cnt = 0;
            
            for (let nP of neighbors) {
                if (old[nP[1]][nP[0]] == '#') {
                    cnt++;
                }
            }
            
            if (cnt >= (p2 ? 5 : 4)) {
                data[cy][cx] = 'L';
                return true;
            }
        }

        return false;
    };

    for (let cy = 0; cy < data.length; cy++) {
        for (let cx = 0; cx < data[cy].length; cx++) {
            if (doStep(cx, cy)) {
                didChange = true;
            }
        }
    }

    return [ didChange, data ];
}