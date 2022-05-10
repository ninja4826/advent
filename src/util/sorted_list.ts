export class SortedList<T> {
    private list: T[];
    private itemMap: Map<T, number>;

    constructor() {
        this.list = [];
        this.itemMap = new Map();
    }

    add(newItem: T): void {
        let idx = this.list.length;

        this.list.find((item, _idx) => {
            if (item < newItem) {
                return false;
            }

            idx = _idx;
            return true;
        });

        this.list.splice(idx, 0, newItem);
        this.itemMap.set(newItem, idx);
    }

    delete(item: T): void {
        const idx = this.list.indexOf(item);
        this.list.splice(idx, 1);
        this.itemMap.delete(item);
    }

    has(item: T): boolean {
        return this.itemMap.has(item);
    }

    toString(): string {
        return ''+this.list;
    }
}