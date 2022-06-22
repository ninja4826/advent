export function part1(input: string[]): any {
    let bin = hexToBin(input[0]);
    // // // console.log(bin);
    let packet = genPacket(bin);
    // // console.log(packet[0].children[0]);
    // // console.log(packet[0].children[1]);
    // // // console.log(genPacket(bin));
}

export function part2(input: string[]): any {
    let bin = hexToBin(input[0]);

    let packet = genPacket(bin)[0];

    // // // console.log(packet[0]);
    packet = resolve(packet);
    // // // console.log('resolved');
    // // // console.log(packet);
    return packet.value;
}

function strSplice(str: string, start: number, end?: number) {
    let arr = str.split('');
    if (!end) {
        end = arr.length;
    }
    arr.splice(start, end);
    return arr.join('');
}

function matcher(str: string, reg: RegExp): RegExpMatchArray {
    let _match = str.match(reg);
    if (!_match) throw new Error("ugh");
    let match: RegExpMatchArray = _match;
    return match;
}

function hexToBin(hex: string): string {
    let lookup: any = {
        0: '0000',
        1: '0001',
        2: '0010',
        3: '0011',
        4: '0100',
        5: '0101',
        6: '0110',
        7: '0111',
        8: '1000',
        9: '1001',
        'A': '1010',
        'B': '1011',
        'C': '1100',
        'D': '1101',
        'E': '1110',
        'F': '1111'
    };
    return hex.split('').map(c => lookup[c]).join('');
}

function genPacket(bin: string): [Packet, string] {
    let packet: any = {
        bin,
        children: [],
        value: 0
    };
    let regs = {
        norm: /^(\d{3})(\d{3})/,
        literal: /^\d{3}100((?:1\d{4})*(?:0\d{4}))/,
        operator: /^\d{3}(?!100)\d{3}(\d)/,
        op0: /^\d{3}(?!100)\d{3}0(\d{15})/,
        op1: /^\d{3}(?!100)\d{3}1(\d{11})/
    };
    // let match = bin.match(regs.norm);
    // let _match = bin.match(regs.norm);
    let match: RegExpMatchArray = matcher(bin, regs.norm);
    packet.version = parseInt(match[1], 2);
    packet.type = parseInt(match[2], 2);

    let newBin = '';

    if (packet.type == 4) {
        match = matcher(bin, regs.literal);
        // newBin = strSplice(bin, match[0].length);
        packet.bin = bin.slice(0, match[0].length);
        newBin = bin.slice(match[0].length);

        let digits: RegExpMatchArray = matcher(match[1], /.{1,5}/g);
        let binStr = '';
        for (let d of digits) {
            binStr += d.substring(1);
        }
        packet.value = parseInt(binStr, 2);
        // // // console.log('val: '+packet.value);
    } else {
        if (bin[6] == '0') {
            match = matcher(bin, regs.op0);
            // // // console.log(`MATCH: ${match}`);
            let len = parseInt(match[1], 2);

            newBin = bin.slice(match[0].length + len);

            let workBin = bin.slice(match[0].length, match[0].length + len);

            // // // console.log(`NEW BIN: ${newBin}`);
            // // // console.log(`WORK BIN: ${workBin}`);

            while (true) {
                if (parseInt(workBin) > 0) {
                    // // // console.log('workBin: '+parseInt(workBin));
                    let [ newPacket, nextBin ] = genPacket(workBin);
                    packet.children.push(newPacket);
                    workBin = nextBin;
                } else {
                    break;
                }
            }
        } else {
            match = matcher(bin, regs.op1);
            let count = parseInt(match[1], 2);

            // newBin = strSplice(bin, match[0].length);
            newBin = bin.slice(match[0].length);
            // // // console.log(newBin);
            let workBin = newBin;
            for (let i = 0; i < count; i++) {
                let [ newPacket, nextBin ] = genPacket(workBin);
                // // // console.log(nextBin);
                packet.children.push(newPacket);
                workBin = nextBin;
            }
            newBin = workBin;
            // // // console.log('final: '+newBin);
        }
    }

    // if (parseInt(newBin) > 0) {
        
    // }

    return [ packet, newBin ];
}

function resolve(packet: Packet): Packet {
    // // // console.log(`curr packet:`);
    // // // console.log(packet.type == PacketType.Literal);
    // // // console.log(packet);
    if (packet.type == PacketType.Literal) return packet;

    for (let _c = 0; _c < packet.children.length; _c++) {
        let c: Packet = packet.children[_c];

        c = resolve(c);
        packet.children[_c] = c;
    }
    switch (packet.type) {
        case PacketType.Sum: {
            let v = 0;
            for (let c of packet.children) {
                v += c.value;
            }
            packet.value = v;
            break;
        }
        case PacketType.Product: {
            let v = 1;
            for (let c of packet.children) {
                v *= c.value;
            }
            packet.value = v;
            break;
        }
        case PacketType.Minimum: {
            let cArr = [];
            for (let c of packet.children) {
                cArr.push(c.value);
            }
            packet.value = Math.min(...cArr);
            break;
        }
        case PacketType.Maximum: {
            let cArr = [];
            for (let c of packet.children) {
                cArr.push(c.value);
            }
            packet.value = Math.max(...cArr);
            break;
        }
        case PacketType.GT: {
            let a = packet.children[0].value;
            let b = packet.children[1].value;
            packet.value = (a > b ? 1 : 0);
            break;
        }
        case PacketType.LT: {
            let a = packet.children[0].value;
            let b = packet.children[1].value;
            packet.value = (a < b ? 1 : 0);
            break;
        }
        case PacketType.EQ: {
            let a = packet.children[0].value;
            let b = packet.children[1].value;
            packet.value = (a == b ? 1 : 0);
            break;
        }
    }

    return packet;
}

enum PacketType {
    Sum = 0,
    Product = 1,
    Minimum = 2,
    Maximum = 3,
    Literal = 4,
    GT = 5,
    LT = 6,
    EQ = 7
};

interface Packet {
    version: number;
    type: PacketType;
    bin: string;
    children: Packet[];
    value: number;
}