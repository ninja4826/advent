const _ = require('underscore');
const assert = require('assert');

export function part1(input: string[]): any {
    let scanners = parseData(input);

    let res_data = calculateScannersAndBeacons(scanners);
    return res_data.beacons.size;
}

export function part2(input: string[]): any {
    let scanners = parseData(input);
    let res_data = calculateScannersAndBeacons(scanners);
    let manDist = calculateBeaconsMaxManhattanDistance(res_data);
    return manDist;
}

function parseData(data: string[]): IScanner {
    let scanners: IScanner = {};
    let current_scanner_id = 0;
    let rg_scanner = /--- scanner (?<id>\d+) ---/;
    let rg_location = /(?<x>[-\d]+),(?<y>[-\d]+),(?<z>[-\d]+)/;
    _.reduce(data, (sc: any, line: string) => {
        let m = rg_scanner.exec(line);
        if (m && m.groups) {
            current_scanner_id = parseInt(m.groups.id, 10);
            scanners[current_scanner_id] = [];
        } else {
            let m = rg_location.exec(line);
            if (m && m.groups) {
                assert(current_scanner_id in scanners);
                scanners[current_scanner_id].push({
                    x: parseInt(m.groups.x, 10),
                    y: parseInt(m.groups.y, 10),
                    z: parseInt(m.groups.z, 10)
                });
            }
        }
        return sc;
    }, scanners);
    _.each(scanners, (scanner: any) => {
        sortPointsArray(scanner);
    });
    return scanners;
}

function sortPointsArray(pointsArray: Point[]) {
    pointsArray.sort((p1, p2) => {
        if (p1.x === p2.x) {
            if (p1.y === p2.y) {
                return p1.z - p2.z;
            } else {
                return p1.y - p2.y;
            }
        } else {
            return p1.x - p2.x;
        }
    });
}

let position_variant_indexes = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0]
];

let index_name = ['x', 'y', 'z'];

function setPositionVariant(pos_in: Point, pos_out: Point, rot: number): void {
    pos_out.x = pos_in[index_name[position_variant_indexes[rot][0]]];
    pos_out.y = pos_in[index_name[position_variant_indexes[rot][1]]];
    pos_out.z = pos_in[index_name[position_variant_indexes[rot][2]]];
}

let to_negate_indexes = [
    [0, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
    [0, 1, 1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 1, 1]
];

function setPositionSignVariant(pos: Point, rot: number): void {
    if (to_negate_indexes[rot][0] === 1) {
        pos.x = -pos.x;
    }
    if (to_negate_indexes[rot][1] === 1) {
        pos.y = -pos.y;
    }
    if (to_negate_indexes[rot][2] === 1) {
        pos.z = -pos.z;
    }
}

function setBeaconsCoordinatesVariant(input: Point[], output: Point[], rot: number): void {
    _.each(input, (pos: Point, index: number) => setPositionVariant(pos, output[index], rot));
}

function setBeaconsCoordinatesSignVariant(output: Point[], size: number, rot: number): void {
    for (let n = 0; n < size; ++n) {
        setPositionSignVariant(output[n], rot);
    }
}

let x_arr = Array.apply(null, Array(4000)).map(function (x, i) { return i; });
let y_arr = Array.apply(null, Array(4000)).map(function (x, i) { return i; });
let z_arr = Array.apply(null, Array(4000)).map(function (x, i) { return i; });

x_arr.fill(0);
y_arr.fill(0);
z_arr.fill(0);

let inc_arr = 0;

let beacons_copy = Array.apply(null, Array(30)).map(() => {
    return {
        x: 0,
        y: 0,
        z: 0
    };
});

function findBeaconsUnion(input: IScanner, scanner_index_1: number, scanner_index_2: number, known_scanners: ScannerObj[], known_beacons: Set<string>): boolean {
    let scanner_1_beacons = input[scanner_index_1];
    let v12_x = -1;
    let v12_y = -1;
    let v12_z = -1;
    let match_found = false;
    let pos_1;

    for (let rot1 = 0; rot1 < position_variant_indexes.length; ++rot1) {
        for (let rot2 = 0; rot2 < to_negate_indexes.length; ++rot2) {
            setBeaconsCoordinatesVariant(input[scanner_index_2], beacons_copy, rot1);
            setBeaconsCoordinatesSignVariant(beacons_copy, input[scanner_index_2].length, rot2);

            v12_x = -1;
            v12_y = -1;
            v12_z = -1;
            match_found = false;
            inc_arr += 100;

            for (let b1 = 0; b1 < scanner_1_beacons.length; ++b1) {
                for (let b2 = 0; b2 < input[scanner_index_2].length; ++b2) {
                    pos_1 = scanner_1_beacons[b1];

                    v12_x = (pos_1.x - beacons_copy[b2].x) + 2000;
                    v12_y = (pos_1.y - beacons_copy[b2].y) + 2000;
                    v12_z = (pos_1.z - beacons_copy[b2].z) + 2000;

                    if (x_arr[v12_x] < inc_arr) {
                        x_arr[v12_x] = inc_arr;
                    }
                    x_arr[v12_x]++;

                    if (y_arr[v12_y] < inc_arr) {
                        y_arr[v12_y] = inc_arr;
                    }
                    y_arr[v12_y]++;

                    if (z_arr[v12_z] < inc_arr) {
                        z_arr[v12_z] = inc_arr;
                    }
                    z_arr[v12_z]++;

                    if (x_arr[v12_x] >= inc_arr && y_arr[v12_y] >= inc_arr && z_arr[v12_z] >= inc_arr) {
                        if (x_arr[v12_x] - inc_arr >= 12 && y_arr[v12_y] - inc_arr >= 12 && z_arr[v12_z] - inc_arr >= 12) {
                            match_found = true;
                            b1 = scanner_1_beacons.length;
                            b2 = input[scanner_index_2].length;
                        }
                    }
                }
            }

            if (match_found) {
                let vec = { x: v12_x - 2000, y: v12_y - 2000, z: v12_z - 2000 };

                let scanner_1 = _.find(known_scanners, (obj: ScannerObj) => obj.id === scanner_index_1);
                let vec_total = vec;
                vec_total.x += scanner_1.vec.x;
                vec_total.y += scanner_1.vec.y;
                vec_total.z += scanner_1.vec.z;

                for (let n = 0; n < input[scanner_index_2].length; ++n) {
                    input[scanner_index_2][n].x = beacons_copy[n].x;
                    input[scanner_index_2][n].y = beacons_copy[n].y;
                    input[scanner_index_2][n].z = beacons_copy[n].z;
                }
                let new_scanner = {
                    id: scanner_index_2,
                    vec: vec_total,
                    rot: [ rot1 ],
                    rot_negate: [ rot2 ]
                };

                known_scanners.push(new_scanner);

                for (let n = 0; n < input[scanner_index_2].length; ++n) {
                    let pos = beacons_copy[n];
                    let pos2 = { ...pos };
                    pos2.x += vec_total.x;
                    pos2.y += vec_total.y;
                    pos2.z += vec_total.z;
                    let b2_pos_str = JSON.stringify(pos2);
                    known_beacons.add(b2_pos_str);
                }

                return true;
            }
        }
    }

    return false;
}

function calculateScannersAndBeacons(input: IScanner): RetScannerBeacon {
    let known_scanners: ScannerObj[] = [
        {
            id: 0,
            vec: { x: 0, y: 0, z: 0 },
            rot: [0],
            rot_negate: [0]
        }
    ];

    let known_beacons = new Set<string>();

    let were_checked_against: any = {};

    let scanners_count = Object.keys(input).length;

    input[0].forEach((org_pos: any) => {
        let pos = {...org_pos};
        known_beacons.add(JSON.stringify(pos));
    });

    let scanners_to_check: number[] = [];
    let checked_scanners = new Set();
    scanners_to_check.push(0);

    while (scanners_to_check.length !== 0) {
        let n = scanners_to_check.pop();
        if (n === undefined) {
            // // console.log('ughhh');
            continue;
        }
        checked_scanners.add(n);

        for (let k = 0; k < scanners_count; ++k) {
            if (n === k || `${n}_${k}` in were_checked_against) continue;

            were_checked_against[`${n}_${k}`] = 1;
            were_checked_against[`${k}_${n}`] = 1;

            if (_.find(known_scanners, (scanner: ScannerObj) => scanner.id === k) !== undefined) continue;

            if (findBeaconsUnion(input, n, k, known_scanners, known_beacons)) {
                scanners_to_check.push(k);
            }
        }
    }

    return {
        beacons: known_beacons,
        scanners: known_scanners
    };
}

function calculateBeaconsMaxManhattanDistance(beacons_and_scanners_data: RetScannerBeacon): number {
    let scanners_positions: Point[] = [];
    beacons_and_scanners_data.scanners.forEach((s) => scanners_positions.push(s.vec));
    let max_dist = -1;
    for (let n = 0; n < scanners_positions.length; ++n) {
        for (let k = 0; k < scanners_positions.length; ++k) {
            let dx = scanners_positions[n].x - scanners_positions[k].x;
            let dy = scanners_positions[n].y - scanners_positions[k].y;
            let dz = scanners_positions[n].z - scanners_positions[k].z;

            let sum = Math.abs(dx) + Math.abs(dy) + Math.abs(dz);
            if (sum > max_dist) max_dist = sum;
        }
    }

    return max_dist;
}

interface RetScannerBeacon {
    beacons: Set<string>;
    scanners: ScannerObj[];
}

interface IScanner {
    [key: number]: Point[];
}

interface ScannerObj {
    id: number;
    vec: Point;
    rot: number[];
    rot_negate: number[];
}

interface Point {
    x: number;
    y: number;
    z: number;
    [key: string]: number;
}