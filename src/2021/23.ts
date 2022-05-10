const assert = require('assert');

const hallway_exit_ind = [2, 4, 6, 8];
const allowed_stay_ind = [0, 1, 3, 5, 7, 9, 10];

export function part1(input: string[]): any {
    let parsed_data = parseData(input, false);
    if (parsed_data == null) return;
    return calculateLeastEnergy(parsed_data);
}

export function part2(input: string[]): any {
    let parsed_data = parseData(input, true);
    if (parsed_data == null) return;
    return calculateLeastEnergy(parsed_data);
}

function parseData(data: string[], part2 = false): ParsedData | null {
    if (part2) {
        let ln1 = "  #D#C#B#A#";
        let ln2 = "  #D#B#A#C#";
        data.splice(3, 0, ln1);
        data.splice(4, 0, ln2);
    }
    const _hall: any = /#(?<dots>\.+)#/.exec(data[1]);
    if (_hall == null) return null;
    const hallway = _hall.groups;
    const rooms_parse = /#+(?<room1>\w+)#(?<room2>\w+)#(?<room3>\w+)#(?<room4>\w+)#+/;
    
    let parsed_data: ParsedData = {
        hallway: hallway.dots.split(''),
        rooms: [],
        least_energy: Number.MAX_SAFE_INTEGER,
        amphis: []
    };

    for (let row = 2; row < data.length - 1; ++row) {
        const _rooms: any = rooms_parse.exec(data[row]);
        // // console.log('rooms');
        // // console.log(_rooms);
        if (_rooms == null) return null;
        const rooms = _rooms.groups;
        parsed_data.rooms.push([rooms.room1[0], rooms.room2[0], rooms.room3[0], rooms.room4[0]]);
    }
    for (let row = 0; row < parsed_data.rooms.length; ++row) {
        for (let room = 0; room <= 3; ++room) {
            parsed_data.amphis.push(
                {
                    name: parsed_data.rooms[row][room],
                    room: room,
                    row: row,
                    hallway_pos: -1,
                    has_moved: false
                }
            );
        }
    }

    return parsed_data;
}

function drawRooms(data: ParsedData): void {
    return;
    // // console.log(`############# - ${data.least_energy}`);
    // // console.log(`#${data.hallway.join('')}#`);
    for (let n = 0; n < data.rooms.length; ++n) {
        let str = `${n === 0 ? "###" : "  #"}`;
        for (let i = 0; i < 4; i++) {
            str += `${data.rooms[n][i]}#`;
        }
        if (n === 0) {
            str += "##";
        }
        // // console.log(str);
    }
    // // console.log("  #########");
    // // console.log('');
}

function amphiToNum(c: string): number {
    if (c === 'A') {
        return 1;
    } else if (c === 'B') {
        return 2;
    } else if (c === 'C') {
        return 3;
    } else if (c === 'D') {
        return 4;
    } else {
        return 5;
    }
}

function amphipodeEnergyByName(c: string): number {
    return Math.pow(10, ['A', 'B', 'C', 'D'].indexOf(c));
}

function amphiDataToKey(org_data: ParsedData, prev_energy: number) {
    let key1 = 0;
    for (let n = 0; n < org_data.hallway.length; ++n) {
        key1 *= 10;
        key1 += amphiToNum(org_data.hallway[n]);
    }
    let key2 = 0;
    for (let n = 0; n < org_data.rooms.length; ++n) {
        for (let r = 0; r < org_data.rooms[n].length; ++r) {
            key2 *= 10;
            key2 += amphiToNum(org_data.rooms[n][r].charAt(0));
        }
    }

    return key1 ^ key2 ^ prev_energy;
}

function findLeastEnergyRec(org_data: ParsedData, prev_energy: number, cache: Map<number, number>) {
    let key = amphiDataToKey(org_data, prev_energy);
    if (cache.has(key)) return;

    cache.set(key, 1);

    for (let n = 0; n < org_data.amphis.length; ++n) {
        let amp = org_data.amphis[n];

        if (amp.has_moved && amp.hallway_pos === -1) continue;

        let row = amp.row;
        let room = amp.room;

        if (row >= 0) {
            let found_non_dot = false;
            for (let n = 0; n < row && n < org_data.rooms.length; ++n) {
                if (org_data.rooms[n][room] !== '.') {
                    found_non_dot = true;
                    break;
                }
            }
            if (found_non_dot) continue;
        }

        let home_room = 0;
        if (amp.name === 'A') {
            home_room = 0;
        } else if (amp.name === 'B') {
            home_room = 1;
        } else if (amp.name === 'C') {
            home_room = 2;
        } else if (amp.name === 'D') {
            home_room = 3;
        }

        if (home_room === room) {
            let is_blocking_other_amphis = false;
            for (let n = row + 1; n < org_data.rooms.length; ++n) {
                if (org_data.rooms[n][room] !== '.' && org_data.rooms[n][room] !== amp.name) {
                    is_blocking_other_amphis = true;
                    break;
                }
            }
            if (!is_blocking_other_amphis) {
                continue;
            }
        }

        if (amp.hallway_pos !== -1) {
            let home_room_exit_pos = hallway_exit_ind[home_room];
            let is_home_free = false;
            let home_row = 0;

            for (let n = 0; n < org_data.rooms.length; ++n) {
                if (org_data.rooms[n][home_room] === '.') {
                    home_row = n;
                    is_home_free = true;
                } else {
                    break;
                }
            }

            for (let n = home_row + 1; n < org_data.rooms.length; ++n) {
                if (org_data.rooms[n][home_room] !== amp.name) {
                    is_home_free = false;
                    break;
                }
            }
            if (!is_home_free) continue;

            let is_blocked = false;
            if (home_room_exit_pos < amp.hallway_pos) {
                for (let k = home_room_exit_pos; k < amp.hallway_pos && !is_blocked; ++k) {
                    if (org_data.hallway[k] !== '.') {
                        is_blocked = true;
                    }
                }
            } else {
                for (let k = amp.hallway_pos + 1; k <= home_room_exit_pos && !is_blocked; ++k) {
                    if (org_data.hallway[k] !== '.') {
                        is_blocked = true;
                    }
                }
            }

            if (is_home_free && !is_blocked) {
                let energy = (Math.abs(home_room_exit_pos - amp.hallway_pos) + (home_row + 1)) * amphipodeEnergyByName(amp.name);
                if (prev_energy + energy >= org_data.least_energy) continue;

                let all_amphis_are_home = true;
                let prev_room_owner = org_data.rooms[home_row][home_room];
                org_data.rooms[home_row][home_room] = amp.name;
                for (let r = 0; r < org_data.rooms.length; ++r) {
                    if (!(org_data.rooms[r][0] === 'A' && org_data.rooms[r][1] === 'B' && org_data.rooms[r][2] === 'C' && org_data.rooms[r][3] === 'D')) {
                        all_amphis_are_home = false;
                        break;
                    }
                }
                org_data.rooms[home_row][home_room] = prev_room_owner;

                if (all_amphis_are_home) {
                    org_data.least_energy = energy + prev_energy;
                } else {
                    let prev_hallway_amphi = org_data.hallway[amp.hallway_pos];
                    let prev_room_amphi = org_data.rooms[home_row][home_room];
                    let prev_row = amp.row;
                    let prev_room = amp.room;
                    let prev_hallway_pos = amp.hallway_pos;

                    drawRooms(org_data);

                    org_data.hallway[amp.hallway_pos] = '.';
                    org_data.rooms[home_row][home_room] = amp.name;
                    amp.row = home_row;
                    amp.room = home_room;
                    amp.hallway_pos = -1;

                    findLeastEnergyRec(org_data, prev_energy + energy, cache);

                    org_data.hallway[prev_hallway_pos] = prev_hallway_amphi;
                    org_data.rooms[home_row][home_room] = prev_room_amphi;
                    amp.row = prev_row;
                    amp.room = prev_room;
                    amp.hallway_pos = prev_hallway_pos;
                }
            }
        } else {
            for (let i = 0; i < allowed_stay_ind.length; ++i) {
                if (org_data.hallway[allowed_stay_ind[i]] !== '.') continue;

                let is_blocked_by_amphis_above = false;
                for (let n = row - 1; n >= 0; --n) {
                    if (org_data.rooms[n][room] !== '.') {
                        is_blocked_by_amphis_above = true;
                        break;
                    }
                }

                if (is_blocked_by_amphis_above) continue;

                let energy = 0;
                let new_pos = -1;

                new_pos = allowed_stay_ind[i];

                let exit_pos = hallway_exit_ind[room];
                let is_blocked = false;
                if (new_pos < exit_pos) {
                    for (let k = new_pos; k < exit_pos && !is_blocked; ++k) {
                        if (org_data.hallway[k] !== '.') {
                            is_blocked = true;
                        }
                    }
                } else {
                    for (let k = exit_pos + 1; k <= new_pos && !is_blocked; ++k) {
                        if (org_data.hallway[k] !== '.') {
                            is_blocked = true;
                        }
                    }
                }
                if (is_blocked) continue;

                let name = org_data.rooms[row][room];
                // if (name !== '.') throw new Error('this might need to be an error?');
                assert(name !== '.');
                energy += (Math.abs(exit_pos - new_pos) + (row + 1)) * amphipodeEnergyByName(name);

                if (prev_energy + energy < org_data.least_energy) {
                    let prev_room_amphi = org_data.rooms[row][room];
                    let prev_hallway_amphi = org_data.hallway[new_pos];
                    let prev_hallway_pos = amp.hallway_pos;
                    let prev_row = amp.row;
                    let prev_room = amp.room;
                    let prev_has_moved = amp.has_moved;

                    drawRooms(org_data);

                    org_data.rooms[row][room] = '.';
                    org_data.hallway[new_pos] = name;
                    amp.hallway_pos = new_pos;
                    amp.row = -1;
                    amp.room = -1;
                    amp.has_moved = true;

                    findLeastEnergyRec(org_data, prev_energy + energy, cache);

                    org_data.rooms[row][room] = prev_room_amphi;
                    org_data.hallway[new_pos] = prev_hallway_amphi;
                    amp.hallway_pos = prev_hallway_pos;
                    amp.row = prev_row;
                    amp.room = prev_room;
                    amp.has_moved = prev_has_moved;
                }
            }
        }
    }
}

function calculateLeastEnergy(data: ParsedData): number {
    let was_checked = new Map<number, number>();

    findLeastEnergyRec(data, 0, was_checked);

    return data.least_energy;
}

interface ParsedData {
    hallway: any,
    rooms: any[],
    least_energy: number,
    amphis: Amphis[]
}

interface Amphis {
    name: string,
    room: number,
    row: number,
    hallway_pos: number,
    has_moved: boolean
}