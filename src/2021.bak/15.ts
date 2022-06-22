import  Graph from 'node-dijkstra';
import { v4 as uuid } from 'uuid';

export function part1(input: string[]): any {
    let grid = new Grid(input);
    // // // console.log(grid.toString());
    return grid.path.cost;
}

export function part2(input: string[]): any {
    input = Grid.tile(input, 5);
    let grid = new Grid(input);
    // // // console.log(grid.toString());
    return grid.path.cost;
}

interface GridInt {
    names: string[][];
    weights: number[][];
}

class Grid {
    grid: GridInt = { names: [], weights: [] };
    route: Graph;
    path: any;

    static getNeighbors(map: any[][], x: number, y: number): [number, number][] {
        let neighs: [number, number][] = [];

        if ((x - 1) >= 0) {
            neighs.push([y, x - 1]);
        }
        if ((x + 1) < map[y].length) {
            neighs.push([y, x + 1]);
        }
        if ((y - 1) >= 0) {
            neighs.push([y - 1, x]);
        }
        if ((y + 1) < map.length) {
            neighs.push([y + 1, x]);
        }

        return neighs;
    }

    static tile(_input: string[], num: number): string[] {
        let input: number[][] = _input.map(c => c.split('').map(c2 => parseInt(c2)));
        let matrix: number[][] = [];

        for (let i = 0; i < num; i++) {
            matrix.push(new Array(num).fill(0).map((c, idx) => idx + i));
        }
        let newArr: number[][] = [];

        // // // console.log(matrix.map(c => c.join('')).join('\n'));
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < input.length; j++) {
                let tempRow: number[] = [];
                for (let k = 0; k < num; k++) {
                    tempRow.push(...input[j].map(c => {
                        c += matrix[i][k];
                        if (c > 9) {
                            c = c - 9;
                        }
                        return c;
                    }));
                }
                newArr.push(tempRow);
            }
        }

        return newArr.map(c => c.join(''));
    }

    constructor(input: string[]) {
        this.grid.weights = input.map(c => c.split('').map(c2 => parseInt(c2)));
        this.grid.names = input.map(c => c.split('').map(c2 => uuid()));

        this.route = new Graph();

        for (let y = 0; y < this.grid.weights.length; y++) {
            for (let x = 0; x < this.grid.weights[0].length; x++) {
                let name = this.grid.names[y][x];
                let neighs = Grid.getNeighbors(this.grid.weights, x, y);
                let nodeMap: any = {};
                for (let n of neighs) {
                    nodeMap[this.grid.names[n[0]][n[1]]] = this.grid.weights[n[0]][n[1]];
                }
                // if (x == 1 && y == 0) {
                //     // // console.log(nodeMap);
                // }

                this.route.addNode(name, nodeMap);
            }
        }
        let h = this.grid.names.length - 1;
        let w = this.grid.names[0].length - 1;
        this.path = this.route.path(this.grid.names[0][0], this.grid.names[h][w], { cost: true });
    }

    toString(path: boolean = true): string {
        let str = '';
        if (path) {
            for (let r of this.grid.names) {
                r = r.map(c1 => this.path.path.includes(c1) ? '#' : '.');
                str += r.join('') + '\n';
            }
        } else {
            for (let r of this.grid.weights) {
                str += r.join('') + '\n';
            }
        }
        return str;
    }
}