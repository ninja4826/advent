import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

export function part1(_input: string[]): number | string {
    const serialize = (data: string[][]): number => {
        data = data.map(c => c.slice(1, 6)).slice(1, 6);
        let flat = data.flat();

        return flat
            .map((v, i) => v === '#' ? Math.pow(2, i) : 0)
            .reduce((p, c) => p+c, 0);
    }

    let input = _input.map((c: string) => c.split(''));
    input = [['.', '.', '.', '.', '.'], ...input, ['.', '.', '.', '.', '.']];
    input = input.map((c: string[]) => ['.', ...c, '.']);

    let clone: string[][] = input.slice(0);
    let orig: string[][] = clone.map(c => c.slice(0));
    let past: number[] = [ serialize(clone) ];

    let getNeighborsCount = (x: number, y: number): number => {
        let cnt = 0;
        let neighs = [
            [x+1, y],
            [x-1, y],
            [x, y+1],
            [x, y-1]
        ];
        for (let i = 0; i < neighs.length; i++) {
            let n = orig[neighs[i][1]][neighs[i][0]];
            if (n === '#') {
                cnt++;
            }
        }
        return cnt;
    };
    // console.log(clone.map(c => c.join('')).join('\n'));
    while (true) {
        for (let i = 1; i < 6; i++) {
            for (let j = 1; j < 6; j++) {
                let nCount = getNeighborsCount(j, i);
                
                if (orig[i][j] === '#') {
                    if (nCount !== 1) {
                        clone[i][j] = '.';
                    }
                } else {
                    if (nCount === 1 || nCount === 2) {
                        clone[i][j] = '#';
                    }
                }
            }
        }
        // console.log(clone.map(c => c.join('')).join('\n'));
        // console.log('');
        let serial = serialize(clone);
        if (past.includes(serial)) {
            // console.log(clone.map(c => c.join('')).join('\n'));
            return serial;
        }
        past.push(serial);
        orig = clone.map(c => c.slice(0));
        // if (true) {
        //     break;
        // }
    }
    return 0;
}

export function part2(input: string[]): number | string {
    let grid: Map<string, boolean> = new Map();

    let lowerLevel = 0;
    let upperLevel = 0;

    const getKey = (level: number | string, r: number, c: number) => `${level}${r}${c}`;

    const expandKeyRegex = (pattern: string) => {
        const result = [];
        let i = 0;

        while (i < 5) {
            result.push(pattern.replace('.', (i++).toString()));
        }

        return result;
    };

    const getAdjacentLocationsAtCurrentLevel = (level: number, r: number, c: number) => {
        return [
            [r-1, c],
            [r+1, c],
            [r, c-1],
            [r, c+1]
        ].filter(coord => {
            const [r, c] = coord;

            return r >= 0 && r < 5 && c >= 0 && c < 5 && (r != 2 || c != 2);
        }).map(coord => getKey(level, coord[0], coord[1]));
    };

    const getAdjacentLocationsAtLowerLevel = (level: number, r: number, c: number) => {
        const key = getKey('', r, c);
        level--;

        return [
            ['12', '0.'],
            ['23', '.4'],
            ['32', '4.'],
            ['21', '.0']
        ].filter(pattern => pattern[0] == key)
            .reduce((result, pattern) => {
                return result.concat(expandKeyRegex(level + pattern[1]));
            }, []);
    };

    const getAdjacentLocationsAtUpperLevel = (level: number, r: number, c: number) => {
        const key = getKey('', r, c);
        level++;

        return [
            [/0./, '12'],
            [/.4/, '23'],
            [/4./, '32'],
            [/.0/, '21']
        ].filter(pattern => (<RegExp>pattern[0]).test(key))
            .map(pattern => level + <string>pattern[1]);
    };

    const getAdjacentLocations = (level: number, r: number, c: number): string[] => {
        return [].concat(
            <never[]>getAdjacentLocationsAtCurrentLevel(level, r, c),
            <never[]>getAdjacentLocationsAtLowerLevel(level, r, c),
            <never[]>getAdjacentLocationsAtUpperLevel(level, r, c)
        )
    };

    const findAdjacentBugCount = (level: number, r: number, c: number): number => {
        return getAdjacentLocations(level, r, c)
            .filter(key => grid.has(key))
            .length;
    };

    const processLevel = (level: number): string[] => {
        const result = [];

        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                if (r == 2 && c == 2) continue;

                const key = getKey(level, r, c);
                const isBug = grid.has(key);
                const adjBugCount = findAdjacentBugCount(level, r, c);

                if (isBug && adjBugCount != 1) {
                    continue;
                } else if (!isBug && ![1, 2].includes(adjBugCount)) {
                    continue;
                }

                result.push(key);
            }
        }

        return result;
    };

    const resetLevels = () => {
        if ([...grid.keys()].find(key => key.startsWith(lowerLevel.toString()))) {
            lowerLevel--;
        }
        if ([...grid.keys()].find(key => key.startsWith(upperLevel.toString()))) {
            upperLevel++;
        }
    };

    const processLevels = () => {
        let newGrid: Map<string, boolean> = new Map();
        resetLevels();

        for (let i = lowerLevel; i <= upperLevel; i++) {
            processLevel(i)
                .forEach(key => newGrid.set(key, true));
        }

        grid = newGrid;
    };

    input.map(row => row.split(''))
        .forEach((row: string[], rowInd: number) => {
            row.forEach((v: string, colInd: number) => {
                if (v != '#') return;

                grid.set(getKey(0, rowInd, colInd), true);
            });
        });
    
    let i = 0;
    while (i++ < 200) {
        processLevels();
    }
    return grid.size;
}

const transform = transforms.lines;

const testData = {
    part1: `....#
#..#.
#..##
..#..
#....`,
    part2: `....#
#..#.
#.?##
..#..
#....`
};

const testAnswers = {
    part1: 2129920,
    part2: 99
};

export { transform, testData, testAnswers };