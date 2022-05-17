import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(_input: string[]): number | string {
    const input = _input.map(i => i.split(': ')).map(i => i[1]);

    let depth = Number(input[0]);
    let split = input[1].split(',').map(Number);

    let cave = new Cave(depth, new Coord(split[0], split[1]));
    return cave.riskLevel();
}

export function part2(_input: string[]): number | string {
    const input = _input.map(i => i.split(': ')).map(i => i[1]);

    let depth = Number(input[0]);
    let split = input[1].split(',').map(Number);

    let cave = new Cave(depth, new Coord(split[0], split[1]));
    return cave.findTidiestPath();
}

enum Tool {
    neither = 0,
    torch = 1,
    climbingGear = 2
}

class Coord {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(c: Coord): boolean {
        if (this.y === c.y && this.x === c.x) {
            return true;
        }
        return false;
    }

    manhattan(c: Coord): number {
        return Math.abs(this.x - c.x) + Math.abs(this.y - c.y);
    }

    toString(): string {
        return `${this.x},${this.y}`;
    }
}

class Cave {
    depth: number;
    target: Coord;
    caveMouth: Coord;

    calculatedLevels: { [key: string]: number } = {};
    calculatedErosion: { [key: string]: number } = {};

    constructor(depth: number, target: Coord) {
        this.depth = depth;
        this.target = target;
        this.caveMouth = new Coord(0, 0);
    }

    display(): void {
        let map: string[][] = new Array(this.target.y + 1 + 5).fill('');
        map = map.map(() => new Array(this.target.x + 1 + 5).fill(''));

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                map[y][x] = this.caveCellSymbol(new Coord(x, y));
            }
        }
    }

    riskLevel(): number {
        let riskLevel = 0;
        for (let y = 0; y <= this.target.y; y++) {
            for (let x = 0; x <= this.target.x; x++) {
                riskLevel += this.regionType(new Coord(x, y));
            }
        }

        return riskLevel;
    }

    caveCellSymbol(c: Coord): string {
        switch (this.regionType(c)) {
            case 0:
                return '.';
            case 1:
                return '=';
            case 2:
                return '|';
            default:
                throw "Wrong region type";
        }
    }

    erosionLevel(c: Coord): number {
        let erosion = 0;
        if (erosion = this.calculatedErosion[c.toString()]) {
            return erosion;
        }
        erosion = (this.depth + this.geologicalLevel(c)) % 20183;
        this.calculatedErosion[c.toString()] = erosion;
        return erosion;
    }

    regionType(c: Coord): number {
        return this.erosionLevel(c) % 3;
    }

    geologicalLevel(c: Coord): number {
        if (c.equals(this.caveMouth) || c.equals(this.target)) {
            return 0;
        }

        if (c.y === 0) {
            return c.x * 16807;
        } else if (c.x === 0) {
            return c.y * 48271;
        }

        let level: number;

        if (level = this.calculatedLevels[c.toString()]) {
            return level;
        }

        level = this.erosionLevel(new Coord(c.x - 1, c.y)) * this.erosionLevel(new Coord(c.x, c.y - 1));
        this.calculatedLevels[c.toString()] = level;

        return level;
    }

    findTidiestPath(): number {
        let walkers = [new Walker(this, new Coord(0, 0), 0, Tool.torch)];
    let fastestRoute = walkers[0].coord.manhattan(this.target) * (TIME_REGION_TRAVEL + TIME_TOOLS_SWITCH);

    let reached: any = {};

    while (walkers.length > 0) {
        let walker = <Walker>walkers.shift();

        if (walker.time + walker?.coord.manhattan(this.target) >= fastestRoute) {
            continue;
        }
        if (walker.coord.equals(this.target)) {
            fastestRoute = Math.min(fastestRoute, walker.time);
            continue;
        }

        walkers = walkers.concat(walker.walkVariants().filter(walker => {
            let reachedData = reached[walker.toStateString()];
            if (reachedData === undefined || reachedData > walker.time) {
                reached[walker.toStateString()] = walker.time;

                return true;
            }
            return false;
        }));

        walkers.sort((a, b) => a.aproxTravelTime - b.aproxTravelTime);
    }

    return fastestRoute;
    }
}

const possibleTools: any = {
    0: new Set().add(Tool.torch).add(Tool.climbingGear),
    1: new Set().add(Tool.neither).add(Tool.climbingGear),
    2: new Set().add(Tool.torch).add(Tool.neither)
};

const TIME_REGION_TRAVEL = 1;
const TIME_TOOLS_SWITCH = 7;

class Walker {
    coord: Coord;
    cave: Cave;
    tool: Tool;
    time: number;
    aproxTravelTime: number;

    log: Walker[];

    constructor(cave: Cave, coord: Coord, time: number, tool: Tool) {
        this.coord = coord;
        this.cave = cave;
        this.tool = tool;
        this.time = time;

        this.aproxTravelTime = this.coord.manhattan(this.cave.target) * (TIME_REGION_TRAVEL) + this.time;

        this.log = [this];
    }

    walkVariants(): Walker[] {
        let coordVariants = [
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1]
        ].map(dir => new Coord(this.coord.x + dir[0], this.coord.y + dir[1]))
        .filter(c => c.x >= 0 && c.y >= 0);

        const sourceRegionTools = possibleTools[this.cave.regionType(this.coord)];
        let walkerVariants: Walker[] = [];

        for (let coord of coordVariants) {
            if (coord.equals(this.cave.target)) {
                if (this.tool == Tool.torch) {
                    walkerVariants.push(new Walker(this.cave, coord, this.time + TIME_REGION_TRAVEL, this.tool));
                } else {
                    if (sourceRegionTools.has(Tool.torch)) {
                        walkerVariants.push(new Walker(this.cave, coord, this.time + TIME_REGION_TRAVEL + TIME_TOOLS_SWITCH, Tool.torch));
                    }
                }
                continue;
            }

            const targetRegionTools = possibleTools[this.cave.regionType(coord)];

            if (targetRegionTools.has(this.tool)) {
                walkerVariants.push(new Walker(this.cave, coord, this.time + TIME_REGION_TRAVEL, this.tool));
            } else {
                (<Tool[]>Array.from(sourceRegionTools)).filter(tool => targetRegionTools.has(tool)).forEach(tool => {
                    walkerVariants.push(new Walker(this.cave, coord, this.time + TIME_REGION_TRAVEL + TIME_TOOLS_SWITCH, tool));
                });
            }
        }

        for (let walker of walkerVariants) {
            walker.log = this.log.concat(walker.log);
        }

        return walkerVariants;
    }

    toString(): string {
        return `@${this.coord} time: ${this.time} tool: ${this.tool}`;
    }

    toStateString(): string {
        return `${this.coord}!${this.tool}`;
    }
}

function checkPath(cave: Cave, log: Walker[]) {
    for (let i = 1; i < log.length; i++) {
        const walker = log[i];
        const prev = log[i - 1];

        let timeIncrement = TIME_REGION_TRAVEL;
        if (walker.tool != prev.tool) {
            timeIncrement += TIME_TOOLS_SWITCH;
        }
        if (walker.time != prev.time + timeIncrement) {
            throw `Wrong time change ${prev} → ${walker}`;
        }

        if (walker.coord.manhattan(prev.coord) !== 1) {
            throw `Wrong coord change ${prev} → ${walker}`;
        }

        if (!possibleTools[cave.regionType(prev.coord)].has(walker.tool)) {
            throw `Impossible tool switch @${prev.coord}(${cave.regionType(prev.coord)}) ${walker}`;
        }

        if (!possibleTools[cave.regionType(walker.coord)].has(walker.tool)) {
            throw `Wrong tool used @${walker.coord}(${cave.regionType(walker.coord)}) ${walker}`;
        }
    }
}

const transform = transforms.lines;

const testData = {
    part1: [`depth: 510
target: 10,10`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };