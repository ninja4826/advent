export function part1(input: string[]): any {
    let routes = findPaths(input);
    return routes.length;
}

export function part2(input: string[]): any {
    let routes = findPaths(input, true);
    return routes.length;
}

type Map = {
    [key: string]: string[]
};

function findPaths(mapStr: string[], doubleVisit: boolean = false): string[] {
    let map: Map = {};
    // let routes: string[] = [];
    for (let str of mapStr) {
        let split = str.split('-');
        if (!(split[0] in map)) {
            map[split[0]] = [ split[1] ];
        } else {
            map[split[0]] = [ split[1], ...map[split[0]] ];
        }
        
        if (!(split[1] in map)) {
            map[split[1]] = [ split[0] ];
        } else {
            map[split[1]] = [ split[0], ...map[split[1]] ];
        }
    }

    for (let key in map) {
        map[key] = map[key].filter((v, i, self) => self.indexOf(v) === i);
    }
    // // // console.log('map:');
    // // // console.log(map);
    let traverse = (cList: string[] = ['start']): string[] => {
        let currFork = cList.slice(-1)[0];
        let neighbors = map[currFork];
        let retRoutes: string[] = [];
        for (let n of neighbors) {
            // // // console.log('n: '+n);
            if (n == 'start') continue;
            if (n == 'end') {
                let str = [ ...cList, 'end' ].join('-');
                retRoutes.push(str);
                continue;
            }
            let isBig = (n.toUpperCase() == n);
            let canStep: boolean = false;

            if (isBig) {
                canStep = true;
            } else {
                // let allSmallCount = cList.filter(x => x == x.toLowerCase()).length;
                // if (allSmallCount == 0) {
                //     canStep = true;
                // } else {
                //     if (cList.includes(n) && cList.filter(x => x == n).length < smallVisit) {
                //         canStep = true;
                //     }
                // }

                if (cList.filter(x => x == n).length == 0) {
                    canStep = true;
                } else if (doubleVisit) {
                    let smalls = cList.filter(x => x == x.toLowerCase());
                    let counts: any = {};
                    for (let small of smalls) {
                        counts[small] = counts[small] ? counts[small] + 1 : 1;
                    }

                    canStep = true;
                    for (let small of smalls) {
                        if (counts[small] > 1) {
                            canStep = false;
                        }
                    }
                }
            }
            if (canStep) {
                retRoutes.push(...traverse([...cList, n]));
            }
        }

        return retRoutes;
    };

    return traverse();
}