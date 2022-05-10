export function part1(_input: string[]): any {
    let input = _input.map(i => i.replaceAll('sw', 'S').replaceAll('se', 's').replaceAll('nw', 'N').replaceAll('ne', 'n').split(''));

    let blackTiles = getBlackTiles(input);

    return blackTiles.size;
}

export function part2(_input: string[]): any {
    let input = _input.map(i => i.replaceAll('sw', 'S').replaceAll('se', 's').replaceAll('nw', 'N').replaceAll('ne', 'n').split(''));

    let blackTiles = getBlackTiles(input);

    for (let i = 0; i < 100; i++) {
        let newTiles: Set<string> = new Set();
        let toCheck: Set<string> = new Set();

        for (let coord of blackTiles) {
            toCheck.add(coord);
            for (let k in dirs) {
                let diff = dirs[k];
                toCheck.add(coord.split(',').map((c, i2) => parseInt(c) + diff[i2]).join(','));
            }
        }
        for (let coordStr of toCheck) {
            let coord = coordStr.split(',');

            let numNeigh = 0;

            for (let k in dirs) {
                let d = dirs[k];
                let nCoord = coord.map((c, i2) => parseInt(c) + d[i2]);
                if (blackTiles.has(nCoord.join(','))) {
                    numNeigh++;
                }
            }

            if ((blackTiles.has(coordStr) && numNeigh > 0 && numNeigh <= 2) ||
                (!blackTiles.has(coordStr) && numNeigh == 2)) {
                newTiles.add(coordStr);
            }
        }
        // console.log(blackTiles.size);
        blackTiles = newTiles;
    }

    return blackTiles.size;
}

function getBlackTiles(paths: string[][]): Set<string> {
    let blackTiles: Set<string> = new Set();

    for (let path of paths) {
        let coord: Coord = [0, 0, 0];

        for (let p of path) {
            coord = <Coord> coord.map((c, i) => c + dirs[p][i]);
        }
        if (blackTiles.has(coord.join(','))) {
            blackTiles.delete(coord.join(','));
        } else {
            blackTiles.add(coord.join(','));
        }
    }
    return blackTiles;
}

const dirs: { [key: string]: [number, number, number] } = {
    e: [1, -1, 0],
    s: [0, -1, 1],
    S: [-1, 0, 1],
    w: [-1, 1, 0],
    N: [0, 1, -1],
    n: [1, 0, -1]   
};

type Coord = [number, number, number];