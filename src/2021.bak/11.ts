export function part1(input: string[]): any {
    let map = input.map(c1 => c1.split('').map(c2 => parseInt(c2)));

    let grid = Grid.getInstance(map);

    // // // console.log(grid.getPoint(2, 1)?.neighbors);
    // // // // console.log(map);
    // // // console.log('blah');
    // // // console.log('Before any steps');
    // // // console.log(grid.toString());
    for (let i = 1; i <= 100; i++) {
        // // // console.log('After step '+i);
        grid.step();
        // // // console.log(grid.toString());
    }
    return grid.flashes;
}

export function part2(input: string[]): any {
    let map = input.map(c1 => c1.split('').map(c2 => parseInt(c2)));

    let grid = Grid.getInstance(map);
    let sync: boolean;
    let i = 1;
    while (true) {
        grid.step();
        sync = true;
        grid.iter(p => {
            if (!p.flashed) {
                sync = false;
            }
        });
        if (sync) {
            break;
        }
        i++;
    }
    return i;
}

class Grid {
    private static instance: Grid;

    grid: Point[][];
    height: number;
    width: number;

    flashes: number = 0;
    
    private constructor(points: number[][]) {
        this.grid = [];

        for (let i = 0; i < points.length; i++) {
            let arr = [];
            for (let j = 0; j < points[0].length; j++) {
                arr.push(new Point(j, i, points[i][j]));
            }

            this.grid.push(arr);
        }

        this.height = this.grid.length;
        this.width = this.grid[0].length;
    }

    static getInstance(points?: number[][]): Grid {
        if (!Grid.instance) {
            if (typeof points !== 'undefined') {
                Grid.instance = new Grid(points);
            } else {
                throw new Error("Instantiate Grid before grabbing instance.");
            }
        }
        return Grid.instance;
    }

    // static getInstance(): Grid {
    //     if (!Grid.instance) {
    //         throw new Error("Instantiate Grid before grabbing instance.");
    //     }
    //     return Grid.instance;
    // }

    checkPoint(x: number, y: number): boolean {
        if (y < 0 || y >= this.grid.length) {
            return false;
        }
        if (x < 0 || y >= this.grid[0].length) {
            return false;
        }
        return true;
    }

    getPoint(x: number, y: number): Point | null {
        if (!this.checkPoint(x, y)) {
            return null;
        }
        return this.grid[y][x];
    }

    setPoint(x: number, y: number, v: number): void {
        if (!this.checkPoint(x, y)) {
            return;
        }
        this.grid[y][x].value = v;
    }

    upPoint(x: number, y: number): void {
        if (!this.checkPoint(x, y)) {
            return;
        }

        let point = this.getPoint(x, y);
        if (point === null) {
            return;
        }
        this.grid[y][x].value = point.value + 1;
    }

    step(): void {
        this.unflash();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.upPoint(x, y);
            }
        }

        this.iter((p: Point) => p.flash());
    }

    iter(fn: (p: Point) => void) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let p = this.getPoint(x, y);
                if (p !== null) {
                    fn(p);
                }
            }
        }
    }

    unflash(): void {
        this.iter(p => {
            this.grid[p.y][p.x].flashed = false;
            if (p.value > 9) {
                this.setPoint(p.x, p.y, 0);
            }
        });
    }

    toString(): string {
        let str = '';
        for (let r of this.grid) {
            str += r.join('') + '\n';
        }
        return str;
    }
}

class Point {
    x: number;
    y: number;
    value: number;
    flashed: boolean = false;

    constructor(x: number, y: number, v: number) {
        this.x = x;
        this.y = y;
        this.value = v;
    }

    getNeighbors(): Point[] {
        let points: Point[] = [];
        let grid = Grid.getInstance();
        let p: Point | null;
        let x = this.x;
        let y = this.y;

        let refs: number[][] = [
            [-1, 1],
            [-1, 0],
            [-1, -1],
            [0, -1],
            [1, -1],
            [1, 0],
            [1, 1],
            [0, 1]
        ].map(c => [c[0] + x, c[1] + y]);
        for (let ref of refs) {
            p = grid.getPoint(ref[0], ref[1]);

            if (p !== null && p !== undefined) {
                points.push(p);
            }
        }

        return points;
    }

    flash(): void {
        if (this.value > 9  && !this.flashed) {
            // this.value = 0;
            this.flashed = true;
            let grid = Grid.getInstance();
            grid.flashes += 1;
            let neighbors = this.getNeighbors();

            // // // console.log(`(${this.x}, ${this.y})`);
            // // // console.log(grid.toString());

            for (let n of neighbors) {
                grid.upPoint(n.x, n.y);
                if (!n.flashed) {
                    n.flash();
                }
            }
        }
    }

    public equals(p: Point): boolean {
        return this.x === p.x &&
            this.y === p.y &&
            this.value === p.value ;
    }

    toString(): string {
        return this.value + '';
    }
}