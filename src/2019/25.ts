import { transforms } from 'advent-of-code-client';
import { logger, AsciiComputer } from '../util';

export function part1(input: any): number | string {
    const droid = new AsciiComputer(input);

    const map: any = {};

    let currentRoom: Room = {
        entry: '',
        id: '',
        desc: '',
        doors: [],
        visited: new Map(),
        items: []
    };
    let currentDoor: string = '';
    let items: string[] = [];

    const doorInverse: any = {
        east: 'west',
        south: 'north',
        west: 'east',
        north: 'south'
    };

    const blackListedItems = [
        'giant electromagnet',
        'infinite loop',
        'photons',
        'escape pod',
        'molten lava'
    ];

    const getOptions = (output: string[], startIndex: number) => {
        const result = [];

        while (true) {
            const row = output[startIndex++];

            if (!row || !row.startsWith('-')) {
                break;
            }

            result.push(row.slice(2));
        }

        return result;
    };

    const processOutput = (output: string[]) => {
        output = output
            .filter(row => row !== '')
            .map(row => row.trim());
        processRoom(output);
    };

    const processRoom = (output: string[]) => {
        const roomIdRegex = /^== (.*) ==$/;

        if (!roomIdRegex.test(output[0])) {
            return;
        }

        const id = (<RegExpExecArray>roomIdRegex.exec(output[0]))[1];

        if (currentRoom) {
            currentRoom.visited.set(currentDoor, true);
        }

        if (map[id]) {
            currentRoom = map[id];
            return;
        }

        currentRoom = addRoom(id, output);
    };

    const addRoom = (id: string, output: string[]): Room => {
        const room: any = {};

        if (currentDoor) {
            room.entry = doorInverse[currentDoor];
        }

        room.id = id;
        room.desc = output[1];

        const doorIndex = output.indexOf('Doors here lead:') + 1;
        room.doors = getOptions(output, doorIndex);
        room.visited = new Map();

        const itemIndex = output.indexOf('Items here:') + 1;
        room.items = getOptions(output, itemIndex).filter(item => !blackListedItems.includes(item));

        items = items.concat(room.items);

        map[id] = room;

        return <Room>room;
    };

    const getUnvisitedDoor = (): string | undefined => {
        const doors = currentRoom.doors;
        const visited = currentRoom.visited;

        if (doors.length == visited.size) {
            console.log('NO UNVISITED DOORS');
            return;
        }

        let door = doors.find(
            door => !visited.has(door) && door !== currentRoom.entry
        );

        if (!door) {
            door = currentRoom.entry;
        }

        currentDoor = door;

        return door;
    };

    const hasUnpickedItems = () => currentRoom.items.length > 0;
    const getNextUnpickedItem = () => currentRoom.items.shift();
    
    const getNextInput = () => {
        if (hasUnpickedItems()) {
            return 'take '+getNextUnpickedItem();
        }

        return getUnvisitedDoor();
    };

    const droidOutput = (): string[] => {
        const maxEmptyLines = 5;
        let c = 0;

        let outputBuffer: string[] = [];
        while (true) {
            let output = droid.outputStr();
            outputBuffer.push(output);
            console.log(output);

            output == '' ? c++ : (c = 0);

            if (output == 'Command?' || c > maxEmptyLines) {
                break;
            }
        }

        return outputBuffer;
    };

    const droidInput = (_input: string) => {
        console.log(_input);
        droid.input(_input);
    };

    processOutput(droidOutput());
    const command = 'west';

    while (true) {
        processOutput(droidOutput());
        const command = <string>getNextInput();

        if (currentRoom.id == 'Security Checkpoint') {
            break;
        }

        droidInput(command);
    }

    let inventory: Set<string> = new Set(items);
    let inventoryValues = inventory.values();
    let currentItem = inventoryValues.next().value;

    const tryCombo = (combo: string[]): boolean => {
        logger.log(combo);
        for (let c of combo) {
            droidInput('take '+c);
            droidOutput();
        }
        droidInput(currentDoor);
        const output = droidOutput().join('');
        if (output.includes('ejected')) {
            for (let c of combo) {
                droidInput('drop '+c);
                droidOutput();
            }
            return false;
        }
        return true;
    };

    const invArr = Array.from(inventory);
    const combos: string[][] = [];
    let temp: string[] = [];
    let invLen = Math.pow(2, invArr.length);

    for (let i = 0; i < invLen; i++) {
        temp = [];
        for (let j = 0; j < invArr.length; j++) {
            if ((i & Math.pow(2, j))) {
                temp.push(invArr[j]);
            }
        }
        if (temp.length > 0) {
            combos.push(temp);
        }
    }

    for (let c of combos) {
        if (tryCombo(c)) {
            console.log('yaaaay');
            return 1;
        }
    }

    return 0;

    while (true) {
        droidInput(currentDoor);
        const _output = droidOutput();
        if (inventory.size == 0) {
            const itemIndex = _output.indexOf('Items here:') + 1;
            const _items = getOptions(_output, itemIndex).filter(item => !blackListedItems.includes(item));
            _items.forEach(item => {
                droidInput('take '+item);
                droidOutput();
                inventory.add(item);
            });
            inventoryValues = inventory.values();
            currentItem = inventoryValues.next().value;
            continue;
        }
        const output = _output.join('');

        if (!output.includes('ejected')) {
            break;
        }
        if (output.includes('heavier')) {
            logger.log(`'${currentItem}'`);
            droidInput('drop ' + currentItem);
            droidOutput();
            inventory.delete(currentItem);

            [...inventory.values()].forEach(item => {
                droidInput('take '+item);
                droidOutput();
            });

            inventoryValues = inventory.values();
            currentItem = inventoryValues.next().value;
            continue;
        } else if (output.includes('lighter')) {
            const nextToDrop = inventoryValues.next().value;

            droidInput('drop '+nextToDrop);
            droidOutput();
            continue;
        }
    }

    return 0;
}

interface Room {
    entry: string;
    id: string;
    desc: string;
    doors: string[];
    visited: Map<string, boolean>;
    items: string[];
}

export function part2(input: any): number | string {
    return 0;
}

const transform = (data: string): number[] => data.split(',').map(c => parseInt(c));

const testData = {
    part1: '',
    part2: ''
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };