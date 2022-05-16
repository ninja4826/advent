import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    let [grid, carts, width] = prep(input);
    let crash: [ number, number ] | null = null;

    while (crash === null) {
        crash = tick(grid, carts);
    }
    console.log(trackToString(grid, carts, width));
    return crash.join(',');
}

export function part2(input: any): number | string {
    let [grid, carts, width] = prep(input);
    let crash: [ number, number ] | null = null;

    while (crash === null) {
        crash = tick(grid, carts);
    }

    carts = carts.filter(cart => cart.direction != 4);
    while (carts.length > 1) {
        crash = tick(grid, carts);
        logger.log(trackToString(grid, carts, width));
        if (crash) {
            carts = carts.filter(cart => cart.direction != 4);
        }
    }

    return `${carts[0].x},${carts[0].y}`;
}

enum Directions {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3
}

const CartDirectionToString = [
    '^', '>', 'v', '<', 'X'
];

const DirectionsToString = function(): any {
    let up_s = Directions.UP.toString();
    let right_s = Directions.RIGHT.toString();
    let down_s = Directions.DOWN.toString();
    let left_s = Directions.LEFT.toString();

    let directionsToString: any = {};
    directionsToString[up_s + down_s] = '|';
    directionsToString[right_s + left_s] = '-';
    directionsToString[up_s + right_s] = '\\';
    directionsToString[down_s + left_s] = '\\';
    directionsToString[up_s + left_s] = '/';
    directionsToString[right_s + down_s] = '/';
    directionsToString[up_s + right_s + down_s + left_s] = '+';
    return directionsToString;
}();

function trackToString(grid: number[][][], carts: Cart[], width: number): string {
    let lines = [];
    for (let y in grid) {
        let line = "";
        for (let x = 0; x < width; x++) {
            let track = grid[y][x];
            if (track == null) {
                line += ' ';
            } else {
                let code = track.map(x => x.toString()).join('');
                let c = DirectionsToString[code] || '?';
                line += c;
            }
        }
        lines.push(line);
    }

    for (let i in carts) {
        let cart = carts[i];
        let line: string = lines[cart.y];
        lines[cart.y] =
            line.substring(0, cart.x)
            + CartDirectionToString[cart.direction]
            + line.substring(cart.x + 1);
    }
    return lines.join('\n');
}

function tick(grid: number[][][], carts: Cart[]): [ number, number ] | null {
    let crash: [number, number] | null = null;

    for (let i in carts) {
        let cart = carts[i];

        if (cart.direction == 4) continue;

        switch (cart.direction) {
            case Directions.UP:
                cart.y--;
                break;
            case Directions.RIGHT:
                cart.x++;
                break;
            case Directions.DOWN:
                cart.y++;
                break;
            case Directions.LEFT:
                cart.x--;
                break;
        }

        let track = grid[cart.y][cart.x];
        // console.log('grid:');
        // console.log(grid);
        // console.log('track:');
        // console.log(track);
        // console.log('cart:');
        // console.log(cart);
        if (track == null) debugger;

        if (track.length == 4) {
            let nextTurn = cart.nextTurn || 0;

            let directionChange = 0;
            if (nextTurn == 0) {
                directionChange = -1 + 4;
            } else if (nextTurn == 2) {
                directionChange = 1;
            }

            cart.direction = (cart.direction + directionChange) % 4;
            cart.nextTurn = (nextTurn + 1) % 3;
        } else if (track.indexOf(cart.direction) == -1) {
            let nextDirection = (cart.direction + 1) % 4;
            if (track.indexOf(nextDirection) == -1) {
                nextDirection = (cart.direction + 3) % 4;
            }
            cart.direction = nextDirection;
        }

        for (let j in carts) {
            if (i == j) continue;
            if (carts[i].x == carts[j].x && carts[i].y == carts[j].y) {
                carts[i].direction = 4;
                carts[j].direction = 4;
                crash = [carts[i].x, carts[i].y];
            }
        }
    }

    return crash;
}

function prep(gridString: string[]): [number[][][], Cart[], number] {
    let height = gridString.length;
    let width = gridString.reduce((p, c) => Math.max(p, c.length), 0);

    let grid: number[][][] = new Array(height).fill(0).map(c => new Array(width));
    let carts: Cart[] = [];

    for (let y = 0; y < gridString.length; y++) {
        for (let x = 0; x < gridString[y].length; x++) {
            switch (gridString[y][x]) {
                case '+':
                    grid[y][x] = [
                        Directions.UP,
                        Directions.RIGHT,
                        Directions.DOWN,
                        Directions.LEFT
                    ];
                    break;
                case '>':
                    carts.push({ y, x, direction: Directions.RIGHT });
                    grid[y][x] = [Directions.RIGHT, Directions.LEFT];
                    break;
                case '<':
                    carts.push({ y, x, direction: Directions.LEFT });
                case '-':
                    grid[y][x] = [Directions.RIGHT, Directions.LEFT];
                    break;
                case '^':
                    carts.push({ y, x, direction: Directions.UP });
                    grid[y][x] = [Directions.UP, Directions.DOWN];
                    break;
                case 'v':
                    carts.push({ y, x, direction: Directions.DOWN });
                case '|':
                    grid[y][x] = [Directions.UP, Directions.DOWN];
                    break;
                case '/':
                    if (y > 0 && grid[y - 1][x] && grid[y-1][x].indexOf(Directions.DOWN) !== -1) {
                        grid[y][x] = [Directions.UP, Directions.LEFT];
                    } else {
                        grid[y][x] = [Directions.RIGHT, Directions.DOWN];
                    }
                    break;
                case '\\':
                    if (y > 0 && grid[y-1][x] && grid[y-1][x].indexOf(Directions.DOWN) !== -1) {
                        grid[y][x] = [Directions.UP, Directions.RIGHT];
                    } else {
                        grid[y][x] = [Directions.DOWN, Directions.LEFT];
                    }
                    break;
            }
        }
    }

    return [grid, carts, width];
}

interface Cart {
    y: number;
    x: number;
    direction: number;
    nextTurn?: number;
}

const transform = transforms.lines;

const testData = {
    part1: `/->-\\        
|   |  /----\\
| /-+--+-\\  |
| | |  | v  |
\\-+-/  \\-+--/
    \\------/   
`,
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };