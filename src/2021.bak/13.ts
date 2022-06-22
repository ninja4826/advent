export function part1(input: string[]): any {
    let _coords = input.filter((v) => /\d+,\d+/g.test(v));
    // coords = coords.map(c => c.split(',').map(c2 => parseInt(c2)));
    let foldRegex = /.+(x|y)=(\d+)/;
    let folds = input.filter(v => foldRegex.test(v)).map(c => {
        let match = c.match(foldRegex);
        if (!match) throw new Error('Input formatted incorrectly.');
        return {
            axis: match[1] == 'x' ? Axis.x : Axis.y,
            num: +match[2]
        };
    });

    let coords: Point[] = _coords.map(c => {
        let [x, y] = c.split(',').map(c2 => +c2);
        return { x, y };
    });

    let grid = new Grid(coords);

    // // // console.log(grid.toString());

    grid = Grid.fold(grid, folds[0].axis, folds[0].num);
    // // // console.log(grid.toString());

    return grid.count;
}

export function part2(input: string[]): any {
    let _coords = input.filter((v) => /\d+,\d+/g.test(v));
    // coords = coords.map(c => c.split(',').map(c2 => parseInt(c2)));
    let foldRegex = /.+(x|y)=(\d+)/;
    let folds = input.filter(v => foldRegex.test(v)).map(c => {
        let match = c.match(foldRegex);
        if (!match) throw new Error('Input formatted incorrectly.');
        return {
            axis: match[1] == 'x' ? Axis.x : Axis.y,
            num: +match[2]
        };
    });

    let coords: Point[] = _coords.map(c => {
        let [x, y] = c.split(',').map(c2 => +c2);
        return { x, y };
    });

    let grid = new Grid(coords);

    for (let f of folds) {
        grid = Grid.fold(grid, f.axis, f.num);
    }

    // // console.log(grid.toString());
}
enum Axis {
    x = 'x',
    y = 'y'
};

// interface Point {
//     x: number;
//     y: number;
// }
interface Point {
    [Axis: string]: number;
}

class Grid {
    private grid: number[][];
    private coords: Point[];

    private height: number;
    private width: number;

    static fold(grid: Grid, ax: Axis, line: number): Grid {
        let mapper = (num: number): number => line - (num - line);

        for (let c of grid.coords) {
            if (c[ax] > line) {
                let val = grid.grid[c.y][c.x];
                c[ax] = mapper(c[ax]);
            }
        }
        let coords = grid.coords.slice();
        for (let i = 0; i < coords.length; i++) {
            let c = coords[i];
            if (c[ax] > line) {
                let val = grid.grid[c.y][c.x];
                c[ax] = mapper(c[ax]);
                coords[i] = c;
            }
        }

        grid = new Grid(coords);
        return grid;
    }

    constructor(coords: Point[]) {
        this.coords = coords;

        let highH = Math.max(...coords.map(c => c.y)) + 1;
        let highW = Math.max(...coords.map(c => c.x)) + 1;

        this.height = highH;
        this.width = highW;
        
        let arr: number[][] = [];

        for (let i = 0; i < highH; i++) {
            arr.push(new Array(highW).fill(0));
        }

        this.grid = arr.slice();

        for (let c of coords) {
            this.mark(c);
        }
    }

    mark(coord: Point) {
        this.grid[coord.y][coord.x] += 1;
    }

    fold(ax: Axis, line: number) {
        let mapper = (num: number): number => line - (num - line);

        for (let c of this.coords) {
            if (c[ax] > line) {
                let val = this.grid[c.y][c.x];
                c[ax] = mapper(c[ax]);
            }
        }
    }

    get count(): number {
        let count = 0;
        for (let row of this.grid) {
            for (let cell of row) {
                if (cell > 0) {
                    count++;
                }
            }
        }
        return count;
    }

    toString(): string {
        let str = '';
        for (let r of this.grid) {
            str += r.map(c => c > 0 ? '#' : '.').join('') + '\n';
            // str += r.join('').replace(/0/g, '.').replace(/\d+/g, '#') + '\n';
        }
        return str;
    }
}