import { transforms } from 'advent-of-code-client';
import { logger } from '../util';
import { GraphBuilder } from '../util/graph_builder';

export function part1(input: string[]): number | string {
    const findMinDistanceNode = (vertexDistances: any, visitedVertexes: Map<string, boolean>): string => {
        let minDist = Number.POSITIVE_INFINITY;
        let result: string = '';

        Object.keys(vertexDistances).forEach(node => {
            logger.log(node);
            logger.log(!visitedVertexes.has(node));
            logger.log(minDist);
            logger.log(vertexDistances[node]);
            if (!(visitedVertexes.has(node)) && vertexDistances[node].dist < minDist) {
                result = node;
                minDist = vertexDistances[node].dist;
            }
        });

        return result;
    };
    const dijikstras = (graph: any, start: string) => {
        const visitedVertexes: Map<string, boolean> = new Map();
        const vertexDistances: any = {};
        let count = Object.keys(graph).length;

        Object.keys(graph).forEach(node => {
            vertexDistances[node] = {
                dist: Number.POSITIVE_INFINITY,
                parent: null
            }
        });

        vertexDistances[start].dist = 0;

        while (count-- > 0) {
            const nextNode = findMinDistanceNode(vertexDistances, visitedVertexes);
            visitedVertexes.set(nextNode, true);

            const adjacents = graph[nextNode];
            
            const baseDistance = vertexDistances[nextNode].dist;

            Object.keys(adjacents).forEach(node => {
                const dist = adjacents[node] + baseDistance;

                if (dist < vertexDistances[node].dist) {
                    vertexDistances[node] = {
                        dist: dist,
                        parent: nextNode
                    };
                }
            });
        }

        return vertexDistances;
    };

    let grid = input.map(c => c.split(''));
    grid = preProcessGrid(grid);

    const graph = (new GraphBuilder(grid)).build();
    const vertexDistances = dijikstras(graph, 'AA');

    let node = vertexDistances['ZZ'];
    let dist = node.dist;

    while (node.parent != null) {
        dist++;
        node = vertexDistances[node.parent];
    }

    return dist - 1;
}

export function part2(input: any): number | string {
    return 0;
}

function preProcessGrid(grid: string[][]): string[][] {
    const _isAdjacentToMaze = (_grid: string[][], x: number, y: number): [number, number] => {
        return <[number, number]>[
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1]
        ].find(coord => {
            const [x, y] = coord;
            return grid[x] && ['.', '#'].includes(grid[x][y]);
        });
    };
    const _isNode = (_grid: string[][], x: number, y: number): boolean => {
        return grid[x] && grid[x].length > y && (/^[A-Z]$/.test(grid[x][y]));
    };

    grid.forEach((row, rowInd) => {
        row.forEach((v, colInd) => {
            if (['.', '#', ' '].includes(v) || !_isAdjacentToMaze(grid, rowInd, colInd)) {
                return;
            }

            const prevRow = rowInd - 1;
            const nextRow = rowInd + 1;
            const prevCol = rowInd - 1;
            const nextCol = rowInd + 1;

            if (_isNode(grid, prevRow, colInd)) {
                grid[nextRow][colInd] = grid[prevRow][colInd] + v;
                grid[rowInd][colInd] = ' ';
                grid[prevRow][colInd] = ' ';
            } else if (_isNode(grid, rowInd, prevCol)) {
                grid[rowInd][nextCol] = grid[rowInd][prevCol] + v;
                grid[rowInd][colInd] = ' ';
                grid[rowInd][prevCol] = ' ';
            } else if (_isNode(grid, nextRow, colInd)) {
                grid[prevRow][colInd] = v + grid[nextRow][colInd];
                grid[rowInd][colInd] = ' ';
                grid[nextRow][colInd] = ' ';
            } else if (_isNode(grid, rowInd, nextCol)) {
                grid[rowInd][prevCol] = v + grid[rowInd][nextCol];
                grid[rowInd][colInd] = ' ';
                grid[rowInd][nextCol] = ' ';
            }
        });
    });

    return grid;
}

const transform = transforms.lines;

const testData = {
    part1: `         A           
         A           
  #######.#########  
  #######.........#  
  #######.#######.#  
  #######.#######.#  
  #######.#######.#  
  #####  B    ###.#  
BC...##  C    ###.#  
  ##.##       ###.#  
  ##...DE  F  ###.#  
  #####    G  ###.#  
  #########.#####.#  
DE..#######...###.#  
  #.#########.###.#  
FG..#########.....#  
  ###########.#####  
             Z       
             Z     `,
    part2: ''
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };