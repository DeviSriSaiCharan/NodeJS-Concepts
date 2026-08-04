class ListNode<K, V> {
    key: K;
    value: V;
    prev: ListNode<K, V> | null;
    next: ListNode<K, V> | null;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}



class LRUCache<K, V> {
    private capacity: number;
    private cache: Map<K, ListNode<K, V>>;
    private head: ListNode<K, V> | null;
    private tail: ListNode<K, V> | null;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map<K, ListNode<K, V>>();
        this.head = null;
        this.tail = null;
    }

    private addToHead(node: ListNode<K, V>): void {
        node.next = this.head;
        node.prev = null;

        if(this.head) {
            this.head.prev = node;
        }

        this.head = node;

        if(!this.tail) {
            this.tail = node;
        }
    }

    private removeNode(node: ListNode<K, V>): void {
        if(node.prev) {
            node.prev.next = node.next;
        } else {
            // Only head nodes will have null prev
            // So we need to update the head to the next node
            this.head = node.next;
        }

        if(node.next) {
            node.next.prev = node.prev;
        } else {
            // Only tail nodes will have null next
            // So we need to update the tail to the previous node
            this.tail = node.prev;
        }

        node.prev = null;
        node.next = null;
    }

    private moveToHead(node: ListNode<K, V>): void {
        if(this.head === node) return;

        this.removeNode(node);
        this.addToHead(node);
    }

    get(key: K): V | null {
        if(!this.cache.has(key)) {
            return null;
        }

        const node = this.cache.get(key);
        if (!node) {
            return null;
        }

        // Move the accessed node to the head (most recently used)
        this.moveToHead(node);

        return node.value;
    }

    private removeTail(): void {
        if(!this.tail) return;
        
        const node = this.tail;

        this.cache.delete(node.key);
        this.removeNode(node);
    }

    put(key: K, value: V): void {
        const existingNode = this.cache.get(key);

        if(existingNode) {
            existingNode.value = value;
            this.moveToHead(existingNode);

            return;
        }

        const newNode = new ListNode(key, value);
        this.cache.set(key, newNode);
        this.addToHead(newNode);

        if(this.cache.size > this.capacity) {
            this.removeTail();
        }
    }
}




const lruCache = new LRUCache<string, number>(3);
lruCache.put("One", 1);
lruCache.put("Two", 2);
lruCache.put("Three", 3);

console.log(lruCache.get("One")); // Output: 1
console.log(lruCache.get("Two")); // Output: 2

lruCache.put("Four", 4); // This will evict "Three" as it is the least recently used

console.log(lruCache.get("Three")); // Output: null (evicted)
console.log(lruCache.get("Four")); // Output: 4