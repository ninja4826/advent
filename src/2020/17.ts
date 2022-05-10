export function part1(input: string[]): any {
    let data = input.map(c => c.split(''));
    let grid = new Grid(data);
    // grid.print();
    // grid.print();
    grid.step();
    grid.step();
    grid.step();
    // grid.print();
    grid.step();
    grid.step();
    grid.step();
    return grid.getCount();
}

export function part2(input: string[]): any {
    let data = input.map(c => c.split(''));
    let grid = new Grid2(data);
    // grid.print();
    // grid.print();
    grid.step();
    // grid.print();
    grid.step();
    grid.step();
    // grid.print();
    grid.step();
    grid.step();
    grid.step();
    return grid.getCount();
}

class Grid {
    map: Map<string, boolean> = new Map();

    constructor(start: string[][]) {
        for (let i = 0; i < start.length; i++) {
            for (let j = 0; j < start[i].length; j++) {
                if (start[i][j] == '#') {
                    this.map.set(`${j},${i},0`, true);
                }
            }
        }
    }

    print(): void {
        // let strGrid: string[][] = [];

        let { x, y, z } = this.getSize();

        for (let i = z.min; i <= z.max; i++) {
            console.log(`\nz=${i}`);
            for (let j = y.min; j <= y.max; j++) {
                let str = '';
                for (let k = x.min; k <= x.max; k++) {
                    if (this.map.has(`${k},${j},${i}`)) {
                        str += '#';
                    } else {
                        str += '.';
                    }
                }
                console.log(str);
            }
        }
    }

    step(): void {
        let clone: Map<string, boolean> = new Map();

        for (let [k, v] of this.map) {
            clone.set(k, v);
        }

        let { x, y, z } = this.getSize();

        for (let i = x.min; i <= x.max; i++) {
            for (let j = y.min; j <= y.max; j++) {
                for (let k = z.min; k <= z.max; k++) {
                    let key = `${i},${j},${k}`;
                    let self = this.map.get(key);
                    let neighs = this.getNeighbors(key);

                    if (self) {
                        if (neighs.length != 2 && neighs.length != 3) {
                            clone.set(key, false);
                            clone.delete(key);
                        }
                    } else {
                        if (neighs.length == 3) {
                            clone.set(key, true);
                        }
                    }
                }
            }
        }

        this.map = new Map();
        for (let [k, v] of clone) {
            this.map.set(k, v);
        }
    }

    getSize(): PointRange {
        let x: Range = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER
        };
        let y: Range = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER
        };
        let z: Range = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER
        };

        for (let [ k, v ] of this.map) {
            // console.log(k, v);
            if (v) {
                let nums = k.split(',').map(c => parseInt(c));
                
                x.min = Math.min(x.min, nums[0]);
                x.max = Math.max(x.max, nums[0]);
                
                y.min = Math.min(y.min, nums[1]);
                y.max = Math.max(y.max, nums[1]);
                
                z.min = Math.min(z.min, nums[2]);
                z.max = Math.max(z.max, nums[2]);
            }
        }

        x.min -= 1;
        y.min -= 1;
        z.min -= 1;

        x.max += 1;
        y.max += 1;
        z.max += 1;

        return { x, y, z };
    }

    getNeighbors(point: string): string[] {
        let neighs = [];

        let [ px, py, pz ] = point.split(',').map(c => parseInt(c));

        for (let x = px - 1; x < px + 2; x++) {
            for (let y = py - 1; y < py + 2; y++) {
                for (let z = pz - 1; z < pz + 2; z++) {
                    if (x == px && y == py && z == pz) continue;
                    let key = `${x},${y},${z}`
                    let neigh = this.map.get(key);
                    if (neigh) {
                        neighs.push(key);
                    }
                }
            }
        }

        return neighs;
    }

    getCount(): number {
        let cnt = 0;
        for (let [k, v] of this.map) {
            if (v) {
                cnt++;
            }
        }
        return cnt;
    }
}

class Grid2 {
    map: Map<string, boolean> = new Map();

    constructor(start: string[][]) {
        for (let i = 0; i < start.length; i++) {
            for (let j = 0; j < start[i].length; j++) {
                if (start[i][j] == '#') {
                    this.map.set(`${j},${i},0,0`, true);
                }
            }
        }
    }

    print(): void {
        // let strGrid: string[][] = [];

        let { x, y, z, w } = this.getSize();
        for (let l = w.min; l <= w.max; l++) {
            for (let i = z.min; i <= z.max; i++) {
                console.log(`\nz=${i}, w=${l}`);
                for (let j = y.min; j <= y.max; j++) {
                    let str = '';
                    for (let k = x.min; k <= x.max; k++) {
                        if (this.map.has(`${k},${j},${i},${l}`)) {
                            str += '#';
                        } else {
                            str += '.';
                        }
                    }
                    console.log(str);
                }
            }
        }
    }

    step(): void {
        let clone: Map<string, boolean> = new Map();

        for (let [k, v] of this.map) {
            clone.set(k, v);
        }

        let { x, y, z, w } = this.getSize();

        for (let i = x.min; i <= x.max; i++) {
            for (let j = y.min; j <= y.max; j++) {
                for (let k = z.min; k <= z.max; k++) {
                    for (let l = w.min; l <= w.max; l++) {
                        let key = `${i},${j},${k},${l}`;
                        let self = this.map.get(key);
                        let neighs = this.getNeighbors(key);

                        if (self) {
                            if (neighs.length != 2 && neighs.length != 3) {
                                clone.set(key, false);
                                clone.delete(key);
                            }
                        } else {
                            if (neighs.length == 3) {
                                clone.set(key, true);
                            }
                        }
                    }
                }
            }
        }

        this.map = new Map();
        for (let [k, v] of clone) {
            this.map.set(k, v);
        }
    }

    getSize(): PointRange2 {
        let x: Range = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER
        };
        let y: Range = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER
        };
        let z: Range = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER
        };
        let w: Range = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER
        };

        for (let [ k, v ] of this.map) {
            // console.log(k, v);
            if (v) {
                let nums = k.split(',').map(c => parseInt(c));
                
                x.min = Math.min(x.min, nums[0]);
                x.max = Math.max(x.max, nums[0]);
                
                y.min = Math.min(y.min, nums[1]);
                y.max = Math.max(y.max, nums[1]);
                
                z.min = Math.min(z.min, nums[2]);
                z.max = Math.max(z.max, nums[2]);
                
                w.min = Math.min(w.min, nums[3]);
                w.max = Math.max(w.max, nums[3]);
            }
        }

        x.min -= 1;
        y.min -= 1;
        z.min -= 1;
        w.min -= 1;

        x.max += 1;
        y.max += 1;
        z.max += 1;
        w.max += 1;

        return { x, y, z, w };
    }

    getNeighbors(point: string): string[] {
        let neighs = [];

        let [ px, py, pz, pw ] = point.split(',').map(c => parseInt(c));

        for (let x = px - 1; x < px + 2; x++) {
            for (let y = py - 1; y < py + 2; y++) {
                for (let z = pz - 1; z < pz + 2; z++) {
                    for (let w = pw - 1; w < pw + 2; w++) {
                        if (x == px && y == py && z == pz && w == pw) continue;
                        let key = `${x},${y},${z},${w}`
                        let neigh = this.map.get(key);
                        if (neigh) {
                            neighs.push(key);
                        }
                    }
                }
            }
        }

        return neighs;
    }

    getCount(): number {
        let cnt = 0;
        for (let [k, v] of this.map) {
            if (v) {
                cnt++;
            }
        }
        return cnt;
    }
}

interface Range {
    min: number;
    max: number;
}

interface PointRange {
    x: Range;
    y: Range;
    z: Range;
}

interface PointRange2 {
    x: Range;
    y: Range;
    z: Range;
    w: Range;
}