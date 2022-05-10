export function part1(input: string[]): any {
    let [ingreds, allergens] = getIntersects(input);

    let allergenFoods: string[] = [];
    for (let [,a] of allergens) {
        allergenFoods.push(...a);
    }
    allergenFoods = Array.from(new Set(allergenFoods));
    let safeFoods = ingreds.filter(i => !allergenFoods.includes(i));

    return safeFoods.length;
}

export function part2(input: string[]): any {
    let [,allergens] = getIntersects(input);

    let canonical: Map<string, string> = new Map();

    while (allergens.size > 0) {
        let known: Map<string,string> = new Map();
        for (let [k,v] of allergens) {
            if (v.length == 1) {
                known.set(k, v[0]);
            }
        }
        for (let [k,v] of known) {
            canonical.set(k,v);
            allergens.delete(k);
            for (let [k2,v2] of allergens) {
                if (v2.includes(v)) {
                    let v2Set = new Set(v2);
                    v2Set.delete(v);
                    allergens.set(k2, Array.from(v2Set));
                }
            }
        }
    }
    let canonKeys = Array.from(canonical.keys());
    canonKeys.sort();
    let ingredArr: string[] = [];

    for (let c of canonKeys) {
        let ingred = canonical.get(c);
        if (!ingred) throw new Error('ughhh');
        ingredArr.push(ingred);
    }
    return ingredArr.join(',');
}

function getIntersects(input: string[]): [string[], Map<string, string[]>] {
    let allIngredients: string[] = [];
    let allAllergens: Map<string, string[]> = new Map;
    let iSet: Set<string>;

    for (let i = 0; i < input.length; i++) {
        let [iStr, aStr] = input[i].split(' (contains ');
        let iList = iStr.split(' ');
        let aList = aStr.split(', ').map(a => {
            if (a[a.length - 1] == ')') {
                return a.slice(0, a.length - 1);
            }
            return a;
        });
        allIngredients.push(...iList);

        for (let allergen of aList) {
            let oldAllergen = allAllergens.get(allergen);
            if (oldAllergen) {
                // iSet = new Set([...iList, ...oldAllergen]);
                iSet = new Set(oldAllergen.filter(o => iList.includes(o)));
            } else {
                iSet = new Set(iList);
            }
            allAllergens.set(allergen, Array.from(iSet));
        }
    }

    return [allIngredients, allAllergens];
}