import { transforms } from 'advent-of-code-client';
import { logger, matcher } from '../util';

export function part1(input: number[]): number | string {
    let [ root, endPointer ] = traverseTree(input);
    console.log(root);
    console.log(`tree length match: ${endPointer == input.length}`);

    const squashTree = (node: INode): INode[] => {
        let nodeArr: INode[] = [node];
    
        for (let child of node.children) {
            nodeArr = nodeArr.concat(...squashTree(child));
        }
    
        return nodeArr;
    };

    const squashed = squashTree(root);

    return squashed.reduce((p1, c1) => p1+c1.metadata.reduce((p2, c2) => p2+c2, 0), 0);
}

export function part2(input: number[]): number | string {
    let [ root, endPointer ] = traverseTree(input);
    console.log(root);
    console.log(`tree length match: ${endPointer == input.length}`);

    const eVal = (node: INode): number => {
        let val = 0;
        if (node.children.length == 0) {
            val = node.metadata.reduce((p, c) => p+c, 0);
        } else {
            for (let metaIdx of node.metadata) {
                metaIdx += -1;
                if (node.children.length > metaIdx) {
                    val += eVal(node.children[metaIdx]);
                }
            }
        }
        return val;
    };

    return eVal(root);
}

function traverseTree(nums: number[], pointer: number = 0): [INode, number] {
    let numChildren = nums[pointer++];
    let numMetadata = nums[pointer++];
    let children: INode[] = [];
    for (let i = 0; i < numChildren; i++) {
        let ret = traverseTree(nums, pointer);
        children.push(ret[0]);
        pointer = ret[1];
    }
    let metadata: number[] = [];
    for (let i = 0; i < numMetadata; i++) {
        metadata.push(nums[pointer++]);
    }

    let node: INode = {
        numChildren,
        numMetadata,
        children,
        metadata
    };

    return [node, pointer];
}

interface INode {
    numChildren: number;
    numMetadata: number;
    children: INode[];
    metadata: number[];
}

const transform = (data: string): number[] => data.split(' ').map(Number);

const testData = {
    part1: `2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`,
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };