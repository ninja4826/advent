// https://0xdf.gitlab.io/adventofcode2020/20

export function part1(input: string[]): any {
    input = input.join('\n').split('\n\n');

    let tiles: Map<number, Tile> = new Map();

    for (let i = 0; i < input.length; i++) {
        let lines = input[i].split('\n');
        let idn = parseInt(lines[0].split(' ')[1].split(':')[0]);
        let grid = lines.slice(1);

        let sides = [
            grid[0],
            grid[grid.length - 1],
            grid.map(g => g[0]).join(''),
            grid.map(g => g[g.length - 1]).join('')
        ];

        sides.push(...sides.map(s => s.split('').reverse().join('')));

        tiles.set(idn, {
            grid: grid,
            sides: sides,
            neighbors: new Map()
        });

        for (let [i, tile] of tiles) {
            if (i === idn) continue;

            let shared = tile.sides.filter(s => sides.includes(s));
            for (let s of shared) {
                let t1 = tiles.get(idn);
                if (t1) {
                    // t1.neighbors[i] = s;
                    t1.neighbors.set(i, s);
                    tiles.set(idn, t1);
                }
                let t2 = tiles.get(i);
                if (t2) {
                    // t2.neighbors[idn] = s;
                    t2.neighbors.set(idn, s);
                    tiles.set(i, t2);
                }
            }
        }
    }
    let ret = 1;
    for (let [k, v] of tiles) {
        if (v.neighbors.size == 2) {
            console.log(k);
            ret *= k;
        }
    }

    return ret;
}

export function part2(input: string[]): any {
    
}

function getSide(grid: string[], side: string): string {
    switch (side) {
        case 'top':
            return grid[0];
        case 'bottom':
            return grid[grid.length - 1].split('').reverse().join('');
        case 'right':
            return grid.map(g => g[g.length - 1]).join('');
        case 'left':
            return grid.map(g => g[0]).join('');
    }
    throw new Error('invalid value');
}

function getSides(grid: string[]): string[] {
    return ['top', 'right', 'bottom', 'left'].map(s => getSide(grid, s));
}

function rotate(grid: string[]): string[] {
    let R = grid.length;
    let C = grid[0].length;

    let _new: string[][] = [];
    for (let i = 0; i < R; i++) {
        _new.push('x'.repeat(C).split(''));
    }

    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            _new[r][c] = grid[C - c - 1][r];
        }
    }

    return _new.map(n => n.join(''));
}

var fullpic: string[] = [];
function addFullPic(grid: string[], newLine = false): void {
    if (fullpic.length = 0) {
        fullpic = grid.slice(0);
    } else if (newLine) {
        for (let l of grid) {
            fullpic.push(l);
        }
    } else {
        let R = fullpic.length - grid.length;
        for (let i = 0; i < grid.length; i++) {
            fullpic[i + R] += grid[i];
        }
    }
}

interface Tile {
    grid: string[];
    sides: string[];
    neighbors: Map<number, string>;
}