class INode<T> {
    public next: INode<T> | null = null;
    public prev: INode<T> | null = null;

    constructor(public data: T) {}
}

interface ILinkedList<T> {
    [Symbol.iterator](): IterableIterator<T>;
    appendLeft(data: T): INode<T>;
    append(Data: T): INode<T>;
    deleteNode(node: INode<T>): void;
    traverse(): T[];
    // size(): number;
    size: number;
    search(comparator: (data: T) => boolean): INode<T> | null;
    pop(): T | null;
    popLeft(): T | null;
    index(el: T, beg?: number, end?: number): number;
    insert(i: number, a: T): void;
    remove(a: T): void;
    count(a: T): number;
    extend(...a: T[]): void;
    extendLeft(...a: T[]): void;
    reverse(): void;
    rotate(n: number): void;
    getFirst(): INode<T> | null;
    getLast(): INode<T> | null;
}

export class LinkedList<T> implements ILinkedList<T> {
    private head: INode<T> | null = null;

    *[Symbol.iterator]() {
        if (!this.head) {
            return;
        }
        var node: INode<T> | null = this.head;
        while (node) {
            yield node.data;
            node = node.next;
        }
    }

    public appendLeft(data: T): INode<T> {
        const node = new INode(data);
        if (!this.head) {
            this.head = node;
        } else {
            this.head.prev = node;
            node.next = this.head;
            this.head = node;
        }
        return node;
    }

    public append(data: T): INode<T> {
        const node = new INode(data);
        if (!this.head) {
            this.head = node;
        } else {
            const getLast = (node: INode<T>): INode<T> => {
                return node.next ? getLast(node.next) : node;
            };

            const lastNode = getLast(this.head);
            node.prev = lastNode;
            lastNode.next = node;
        }
        return node;
    }

    public deleteNode(node: INode<T>): void {
        if (!node.prev) {
            this.head = node.next;
        } else {
            const prevNode = node.prev;
            prevNode.next = node.next;
        }
    }

    public traverse(): T[] {
        const array: T[] = [];
        if (!this.head) {
            return array;
        }

        const addToArray = (node: INode<T>): T[] => {
            array.push(node.data);
            return node.next ? addToArray(node.next) : array;
        };
        return addToArray(this.head);
    }

    public get size(): number {
        return this.traverse().length;
    }

    public search(comparator: (data: T) => boolean): INode<T> | null {
        const checkNext = (node: INode<T>): INode<T> | null => {
            if (comparator(node.data)) {
                return node;
            }
            return node.next ? checkNext(node.next) : null;
        };

        return this.head ? checkNext(this.head) : null;
    }

    public pop(): T | null {
        if (!this.head) {
            return null;
        }
        const getLast = (node: INode<T>): INode<T> => {
            return node.next ? getLast(node.next) : node;
        };

        const lastNode = getLast(this.head);
        const data = lastNode.data;
        this.deleteNode(lastNode);
        return data;
    }

    public popLeft(): T | null {
        if (!this.head) {
            return null;
        }
        const data = this.head.data;
        this.deleteNode(this.head);
        return data;
    }

    public index(el: T, beg: number = 0, end?: number): number {
        if (!this.head) return -1;
        if (beg > this.size) return -1;
        if (beg == 0 && this.head.data == el) return 0;
        if (end === undefined || end > this.size) end = this.size;

        let node = this.head;
        for (let i = 1; i < beg; i++) {
            node = <INode<T>>node.next;
        }

        for (let i = beg; i < end; i++) {
            if (node.data == el) return i;
            node = <INode<T>>node.next;
        }
        return -1;
    }

    public insert(i: number, a: T): void {
        if (!this.head) {
            this.append(a);
        }
        let node = <INode<T>>this.head;

        for (let j = 0; j < i; j++) {
            if (node.next) {
                node = node.next;
            }
        }
        const newNode = new INode(a);
        newNode.prev = node;
        newNode.next = node.next;

        if (node.next) {
            node.next.prev = newNode;
        }
        node.next = newNode;
    }

    public remove(a: T): void {
        const node = this.search(b => b === a);
        if (node) {
            this.deleteNode(node);
        }
    }

    public count(a: T): number {
        let count = 0;
        if (!this.head) {
            return 0;
        }
        
        const getLast = (node: INode<T>): INode<T> => {
            if (node.data === a) count++;
            return node.next ? getLast(node.next) : node;
        };

        getLast(this.head);
        return count;
    }

    extend(...a: T[]): void {
        for (let _a of a) {
            this.append(_a);
        }
    }

    extendLeft(...a: T[]): void {
        for (let i = a.length - 1; i > -1; i++) {
            this.appendLeft(a[i]);
        }
    }

    reverse(): void {
        if (!this.head) {
            return;
        }

        let n = Math.floor(this.size / 2);

        let leftNode = this.head;
        let rightNode = <INode<T>>this.getLast();
        for (let i = 0; i < n; i++) {

            if (leftNode == rightNode || leftNode.next == rightNode) {
                break;
            }
            let tmp = new INode(leftNode.data);
            tmp.prev = leftNode.prev;
            tmp.next = leftNode.next;

            leftNode.prev = rightNode.prev;
            leftNode.next = rightNode.next;

            rightNode.prev = tmp.prev;
            rightNode.next = tmp.next;

            if (leftNode.next) {
                leftNode.next.prev = leftNode;
            }
            if (leftNode.prev) {
                leftNode.prev.next = leftNode;
            }

            if (rightNode.next) {
                rightNode.next.prev = rightNode;
            }
            if (rightNode.prev) {
                rightNode.prev.next = rightNode;
            }
            let tmp2 = <INode<T>>leftNode.prev;
            leftNode = <INode<T>>rightNode.next;
            rightNode = tmp2;
        }
    }

    rotate(n: number): void {
        if (!this.head) return;

        // circularize
        let lastNode = <INode<T>>this.getLast();
        this.head.prev = lastNode;
        lastNode.next = this.head;

        let node = this.head;
        if (n < 0) {
            for (let i = 0; i > n; i--) {
                node = <INode<T>>node.next;
            }
        } else {
            for (let i = 0; i < n; i++) {
                node = <INode<T>>node.prev;
            }
        }
        node.prev = <INode<T>>node.prev;
        node.prev.next = null;

        node.prev = null;
    }

    getFirst(): INode<T> | null {
        return this.head;
    }

    getLast(): INode<T> | null {
        if (!this.head) return null;
        const _getLast = (node: INode<T>): INode<T> => {
            return node.next ? _getLast(node.next) : node;
        };
        return _getLast(this.head);
    }
}