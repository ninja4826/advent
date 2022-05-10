import { transforms } from 'advent-of-code-client';
import Graph from 'node-dijkstra';
import { stringify } from 'querystring';
import { logger } from '../util';
import { SortedList } from '../util/sorted_list';
import { GraphBuilder } from '../util/graph_builder';

export function part1(_input: string): number | string {
    const input = transforms.lines(_input);
    const possibleKeys = (reachableKeySet: any, currentNode: string, collectedKeys: SortedList<string>): [string, number][] => {
        const result: [string, number][] = [];
        const reachableKeys = reachableKeySet[currentNode];
    
        for (let key in reachableKeys) {
            if (collectedKeys.has(key)) {
                continue;
            }
    
            const { distance: distance, keys: requiredKeys } = reachableKeys[key];
    
            if (!requiredKeys.find((requiredKey: string) => !collectedKeys.has(requiredKey))) {
                result.push([ key, distance ]);
            }
        }
        return result;
    };

    const shortestPathCache: Map<string, number> = new Map();
    const findMinDistance = (reachableKeySet: any, currentNode: string, pendingKeyCount: number, collectedKeys: SortedList<string> = new SortedList()): number => {
        const cacheKey = '' + currentNode + collectedKeys;
        if (shortestPathCache.has(cacheKey)) {
            return <number>shortestPathCache.get(cacheKey);
        }

        if (pendingKeyCount == 0) {
            return 0;
        }

        let minDistance = Number.POSITIVE_INFINITY;
        pendingKeyCount--;

        let posKeys = possibleKeys(reachableKeySet, currentNode, collectedKeys);

        for (let node of posKeys) {
            const [key, dist] = node;
            collectedKeys.add(key);
            const totalDist = dist + findMinDistance(reachableKeySet, key, pendingKeyCount, collectedKeys);
            collectedKeys.delete(key);
            if (totalDist < minDistance) {
                minDistance = totalDist;
            }
        }

        shortestPathCache.set(cacheKey, minDistance);

        return minDistance;
    }

    const grid = input.map(row => row.split(''));
    const graph = (new GraphBuilder(grid)).build();
    const keyCount = Object.keys(graph)
        .filter(node => /^[a-z]$/.test(node))
        .length;
    const reachableKeySet: any = {};
    for (let key in graph) {
        reachableKeySet[key] = getReachableKeys(graph, key, ['@']);
    }

    return findMinDistance(reachableKeySet, '@', keyCount);
}

export function part2(_input: string): number | string {
    
    const input = _input.split('\n').map(c => c.split(''));

    let midY = Math.floor(input.length / 2);
    let midX = Math.floor(input[midY].length / 2);

    input[midY-1].splice(midX - 1, 3, '@', '#', '@');
    input[midY].splice(midX - 1, 3, '#', '#', '#');
    input[midY+1].splice(midX - 1, 3, '@', '#', '@');

    const possibleKeys = (reachableKeySet: any, currentNodes: string[], collectedKeys: SortedList<string>): [string, number, number][] => {
        let result: [string, number, number][] = [];

        for (let robot = 0; robot < currentNodes.length; robot++) {
            let currentNode = currentNodes[robot];

            const reachableKeys = reachableKeySet[currentNode];
            for (const key in reachableKeys) {
                if (collectedKeys.has(key)) {
                    continue;
                }

                const { distance: distance, keys: requiredKeys } = reachableKeys[key];
                if (!requiredKeys.find((requiredKey: any) => !collectedKeys.has(requiredKey))) {
                    result.push([key, distance, robot]);
                }
            }
        }

        return result;
    };

    const shortestPathCache: Map<string, number> = new Map();
    const findMinDistance = (reachableKeySet: any, currentNodes: string[], pendingKeyCount: number, collectedKeys: SortedList<string> = new SortedList<string>()): number => {
        const cacheKey = '' + currentNodes + collectedKeys;

        if (shortestPathCache.has(cacheKey)) {
            return <number>shortestPathCache.get(cacheKey);
        }
        if (pendingKeyCount == 0) {
            return 0;
        }

        let minDistance = Number.POSITIVE_INFINITY;
        pendingKeyCount--;

        let posKeys = possibleKeys(reachableKeySet, currentNodes, collectedKeys);

        for (let node of posKeys) {
            const [key, dist, robot] = node;

            const prevState = currentNodes[robot];
            currentNodes[robot] = key;
            collectedKeys.add(key);

            const totalDist = dist + findMinDistance(reachableKeySet, currentNodes, pendingKeyCount, collectedKeys);

            collectedKeys.delete(key);
            currentNodes[robot] = prevState;

            if (totalDist < minDistance) {
                minDistance = totalDist;
            }
        }

        shortestPathCache.set(cacheKey, minDistance);
        return minDistance;
    };

    const ENTRY_POINTS = ['@', '^', '&', '*'];

    const updateEntryPoints = (grid: string[][]): string[][] => {
        const newEntryPoints = [...ENTRY_POINTS];

        return grid.map(row => row.map(cell => {
            return cell != '@' ? cell : <string>newEntryPoints.shift();
        }));
    };

    let grid = updateEntryPoints(input);

    const graph = (new GraphBuilder(grid)).build();
    const keyCount = Object.keys(graph)
        .filter(node => /^[a-z]$/.test(node))
        .length;
    
    const reachableKeySet: any = {};
    for (let key in graph) {
        reachableKeySet[key] = getReachableKeys(graph, key, [...ENTRY_POINTS]);
    }

    return findMinDistance(reachableKeySet, ENTRY_POINTS, keyCount);
}

const isDoor = (node: string): boolean => /^[A-Z]$/.test(node);

function findNextUnvisitedNode(shortestPathTree: any, visitedVertexes: Map<string, boolean>): string {
    let minDist = Number.POSITIVE_INFINITY;
    let result: string = '';

    for (let node in shortestPathTree) {
        if (!visitedVertexes.has(node) && shortestPathTree[node].distance < minDist) {
            result = node;
            minDist = shortestPathTree[node].distance;
        }
    }

    return result;
}

function dijikstras(graph: any, start: string): any {
    const visitedVertexes: Map<string, boolean> = new Map();
    const shortestPathTree: any = {};
    let count = Object.keys(graph).length;

    for (let node in graph) {
        shortestPathTree[node] = {
            distance: Number.POSITIVE_INFINITY,
            keys: []
        };
    }

    shortestPathTree[start].distance = 0;

    while (count-- > 0) {
        const currentNode = findNextUnvisitedNode(shortestPathTree, visitedVertexes);

        if (!currentNode || currentNode == '') break;

        visitedVertexes.set(currentNode, true);

        const adjacentNodes = graph[currentNode];
        const baseDistance = shortestPathTree[currentNode].distance;
        const baseKeys = shortestPathTree[currentNode].keys;

        for (let node in adjacentNodes) {
            const distance = adjacentNodes[node] + baseDistance;
            if (distance < shortestPathTree[node].distance) {
                shortestPathTree[node] = {
                    distance: distance,
                    keys: isDoor(currentNode) ? baseKeys.concat(currentNode.toLowerCase()) : baseKeys
                };
            }
        }
    }

    return shortestPathTree;
}

function getReachableKeys(graph: any, start: string, excludeList: string[] = []): any {
    const result: any = {};
    excludeList.push(start);

    const shortestPathTree = dijikstras(graph, start);

    for (let node in shortestPathTree) {
        let properties = shortestPathTree[node];
        if (properties.distance < Number.POSITIVE_INFINITY && !isDoor(node) && !excludeList.includes(node)) {
            result[node] = properties;
        }
    }

    return result;
}

const transform = (data: string) => data;

const testData = {
    part1: `########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`,
    part2: `#############
#g#f.D#..h#l#
#F###e#E###.#
#dCba@#@BcIJ#
#############
#nK.L@#@G...#
#M###N#H###.#
#o#m..#i#jk.#
#############`
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };