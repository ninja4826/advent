import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: string): number | string {
    let grid = new Grid();

    grid.parseRegex(input);
    return grid.findFurthestRoom();
}

export function part2(input: any): number | string {
    let grid = new Grid();

    grid.parseRegex(input);
    return grid.countRooms(1000);
}

const directions = {
    N: [-1, 0],
    S: [1, 0],
    W: [0, -1],
    E: [0, 1]
};

class Grid {
    map: string[][];
    offset: [number, number] = [0, 0];
    start: [number, number] = [1, 1];

    constructor(size: number = 3) {
        this.map = new Array(size).fill(0).map(() => new Array(size).fill('#'));
        this.map[this.start[0]][this.start[1]] = 'X';
    }

    pushRow(): void {
        this.map.push(new Array(this.map[0].length).fill('#'));
        this.map.push(new Array(this.map[0].length).fill('#'));
    }

    unshiftRow(): void {
        this.map.unshift(new Array(this.map[0].length).fill('#'));
        this.map.unshift(new Array(this.map[0].length).fill('#'));
        this.offset[0] += 2;
    }

    pushColumn(): void {
        this.map.forEach(r => r.push('#', '#'));
    }

    unshiftColumn(): void {
        this.map.forEach(r => r.unshift('#', '#'));
        this.offset[1] += 2;
    }

    writeDoors(_p: [number, number], direction: [number, number]): [number, number] {
        let __p = _p.slice();
        let p: [number, number] = [__p[0], __p[1]];

        let my = p[0] + direction[0] * 2 + this.offset[0];
        let mx = p[1] + direction[1] * 2 + this.offset[1];

        if (my >= this.map.length) {
            this.pushRow();
        } else if (my <= 0) {
            this.unshiftRow();
        }

        if (mx >= this.map[0].length) {
            this.pushColumn();
        } else if (mx <= 0) {
            this.unshiftColumn();
        }

        direction.forEach((v, i) => p[i] += v);
        let symbol = '|';
        if (direction[0] != 0) symbol = '-';

        this.map[p[0] + this.offset[0]][p[1] + this.offset[1]] = symbol;
        direction.forEach((v, i) => p[i] += v);
        this.map[p[0] + this.offset[0]][p[1] + this.offset[1]] = '.';

        return p;
    }

    displayMap(): void {
        logger.log(this.map.map(a => a.join('')).join('\n'));
    }

    findFurthestRoom(): number {
        let map = this.map.map(row => row.slice());
        let positions: Position[] = [{
            position: [this.start[0] + this.offset[0], this.start[1] + this.offset[1]],
            doorsPassed: 0
        }];

        let visited;

        let furthestRoom = 0;

        do {
            let nextPositions: Position[] = [];
            positions.forEach(pos => {
                const position = pos.position;
                furthestRoom = Math.max(furthestRoom, pos.doorsPassed);

                for (const [dirName, dirVect] of Object.entries(directions)) {
                    let symbol = map[position[0] + dirVect[0]][position[1] + dirVect[1]];

                    if (symbol == '|' || symbol == '-') {
                        map[position[0] + dirVect[0]][position[1] + dirVect[1]] = '#';
                        nextPositions.push({
                            position: [position[0] + dirVect[0] * 2, position[1] + dirVect[1] * 2],
                            doorsPassed: pos.doorsPassed + 1
                        });
                    }
                }
            });
            positions = nextPositions;
        } while (positions.length > 0);

        return furthestRoom;
    }

    countRooms(maxDoors: number): number {
        let map = this.map.map(row => row.slice());

        let positions: Position[] = [{
            position: [this.start[0] + this.offset[0], this.start[1] + this.offset[1]],
            doorsPassed: 0,
            roomsVisited: []
        }];

        let visited;

        let count = 0;

        do {
            let nextPositions: Position[] = [];

            for (const pos of positions) {
                const position = pos.position;

                if (pos.doorsPassed >= maxDoors) {
                    count++;
                }

                for (const [dirName, dirVect] of Object.entries(directions)) {
                    let symbol = map[position[0] + dirVect[0]][position[1] + dirVect[1]];

                    if (symbol == '|' || symbol == '-') {
                        map[position[0] + dirVect[0]][position[1] + dirVect[1]] = '#';
                        nextPositions.push({
                            position: [position[0] + dirVect[0] * 2, position[1] + dirVect[1] * 2],
                            doorsPassed: pos.doorsPassed + 1,
                            roomsVisited: pos.roomsVisited
                        });
                    }
                }
            }
            positions = nextPositions;
        } while (positions.length > 0);

        return count;
    }

    traceSymbols(regex: string[], startPosition: [number, number]): [number, number] {
        let _p = (startPosition || this.start).slice();
        let position: [number, number] = [_p[0], _p[1]];
        let dirs: any = {
            N: directions.N,
            E: directions.E,
            W: directions.W,
            S: directions.S
        }
        for (let i = 0; i < regex.length; i++) {
            position = this.writeDoors(position, dirs[regex[i]]);
        }

        return position;
    }

    parseRegexGroup(regex: string, regexPosition: number, mapPositions: [number, number][]): [number, [number, number][]] {
        let i = regexPosition;
        let positions: [number, number][] = [];

        while (regex[i] !== ')') {
            let parsedPositions: [number, number][];
            [i, parsedPositions] = this.parseRegexPart(regex, i, mapPositions);
            positions = positions.concat(parsedPositions);
            switch (regex[i]) {
                case '|':
                    i++;
                case ')':
                    break;
                default:
                    throw "Unexpected symbol at regex["+i+"] \""+regex[i]+'"';
            }
        }

        return [i, positions];
    }

    parseRegexPart(regex: string, regexPosition: number, mapPositions: [number, number][]): [number, [number, number][]] {
        let positions = mapPositions;
        let dirs: any = {
            N: directions.N,
            E: directions.E,
            W: directions.W,
            S: directions.S
        }
        for (let i = regexPosition; i < regex.length; i++) {
            switch (regex[i]) {
                case 'N':
                case 'W':
                case 'S':
                case 'E':
                    positions = positions.map(position => this.writeDoors(position, dirs[regex[i]]));
                    break;
                case '(':
                    [i, positions] = this.parseRegexGroup(regex, i + 1, positions);

                    if (regex[i + 1] === ')') {
                        return [i + 1, positions];
                    }
                    break;
                default:
                    return [i, positions];
            }
        }

        return [regex.length, positions];
    }

    parseRegex(regex: string): [number, number][] {
        if (regex[0] !== '^') {
            throw 'Wrong start symbol of regex[0]: "'+regex[0] + '"';
        }

        let p, parts;
        [p, parts] = this.parseRegexPart(regex, 1, [this.start]);

        if (regex[p] !== '$') {
            throw "Wrong end symbol of regex["+p+']: "' + regex[p] + '"';
        }

        return parts;
    }
}

interface Position {
    position: number[];
    doorsPassed: number;
    roomsVisited?: number[];
}

function mergeParts(parts1: string[], parts2: string[]) {
    if (parts1.length === 0) return parts2;
    if (parts2.length === 0) return parts1;

    let mergedParts: string[] = [];

    parts1.forEach(p1 => {
        parts2.forEach(p2 => {
            mergedParts.push(p1 + p2);
        });
    });
    return mergedParts;
}

const transform = (d: string): string => d;

const testData = {
    part1: [
        '^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$',
        '^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$'
    ],
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };