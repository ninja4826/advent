export class GraphBuilder {

    private gridBackup: string[][];
    grid: string[][] = [];

    constructor(grid: string[][]) {
        this.gridBackup = grid;
        this.reloadGridFromBackup();
    }

    build(): any {
        const graph: any = {};

        let nodes = this.findNodes();
        for (let node of nodes) {
            const [key, x, y] = node;

            if (!graph[key]) {
                graph[key] = {};
            }

            graph[key] = Object.assign(graph[key], this.findAdjacentNodes(x, y));
            this.reloadGridFromBackup();
        }
        return graph;
    }

    private findNodes(): [string, number, number][] {
        const nodes: [string, number, number][] = [];

        for (let rowInd = 0; rowInd < this.grid.length; rowInd++) {
            let row = this.grid[rowInd];

            for (let colInd = 0; colInd < this.grid[rowInd].length; colInd++) {
                let v = row[colInd];
                if (['.', '#', ' '].includes(v)) {
                    continue;
                }
                nodes.push([v, rowInd, colInd]);
            }
        }
        return nodes;
    }

    private findAdjacentNodes(startX: number, startY: number): any {
        const pending: [number, number, number][] = [[startX, startY, 0]];
        const result: any = {};
        let depth = 0;

        while (pending.length > 0) {
            let [x, y, depth] = <[number, number, number]>pending.shift();
            const cell = this.grid[x] && this.grid[x][y];

            if (!cell || ['#', ' ', '$'].includes(cell)) {
                continue;
            }

            this.grid[x][y] = '$';
            if (cell !== '.' && depth > 0) {
                result[cell] = depth;
                continue;
            }

            depth++;
            pending.push([x-1, y, depth]);
            pending.push([x+1, y, depth]);
            pending.push([x, y-1, depth]);
            pending.push([x, y+1, depth]);
        }

        return result;
    }  

    private reloadGridFromBackup() {
        this.grid = this.gridBackup.map(row => [...row]);
    }
}