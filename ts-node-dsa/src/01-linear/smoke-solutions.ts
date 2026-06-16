import { DynamicArray } from './dynamic-array/solution.js';
import { Stack } from './stack/solution.js';
import { Queue } from './queue/solution.js';
import { Deque } from './deque/solution.js';
import { SinglyLinkedList, DoublyLinkedList } from './linked-list/solution.js';
import { SkipList } from './skip-list/solution.js';

// DynamicArray
const arr = new DynamicArray(2);
arr.push(10); arr.push(20); arr.push(30);
console.assert(arr.length === 3, 'DA:length');
console.assert(arr.capacity === 4, 'DA:capacity doubled');
console.assert(arr.get(2) === 30, 'DA:get');
console.assert(arr.pop() === 30, 'DA:pop');
console.assert([...arr].join(',') === '10,20', 'DA:iter');
try { arr.get(99); throw new Error('no throw'); } catch(e) { console.assert(e instanceof RangeError, 'DA:OOB get'); }
try { arr.pop(); arr.pop(); arr.pop(); throw new Error('no throw'); } catch(e) { console.assert(e instanceof RangeError, 'DA:empty pop'); }
console.log('DynamicArray OK');

// Stack
const s = new Stack(3);
s.push(1); s.push(2); s.push(3);
console.assert(s.peek() === 3, 'S:peek');
console.assert([...s].join(',') === '3,2,1', 'S:LIFO iter');
console.assert(s.pop() === 3 && s.size === 2, 'S:pop');
s.clear();
console.assert(s.isEmpty(), 'S:clear');
try { s.pop(); throw new Error('no throw'); } catch(e) { console.assert(e instanceof RangeError, 'S:underflow'); }
console.log('Stack OK');

// Queue
const q = new Queue(3);
q.enqueue(1); q.enqueue(2); q.enqueue(3);
console.assert(q.dequeue() === 1, 'Q:FIFO dequeue');
q.enqueue(4); // wraps
console.assert(q.dequeue() === 2, 'Q:after wrap');
console.assert(q.size === 2, 'Q:size');
q.clear();
console.assert(q.isEmpty(), 'Q:clear');
try { q.dequeue(); throw new Error('no throw'); } catch(e) { console.assert(e instanceof RangeError, 'Q:underflow'); }
console.log('Queue OK');

// Deque
const d = new Deque(5);
d.pushFront(1); d.pushBack(2); d.pushFront(0);
console.assert(d.popFront() === 0, 'D:popFront 0');
console.assert(d.popFront() === 1, 'D:popFront 1');
console.assert(d.popFront() === 2, 'D:popFront 2');
// Stack via pushFront+popFront
d.pushFront(10); d.pushFront(20);
console.assert(d.popFront() === 20 && d.popFront() === 10, 'D:LIFO');
// peek
d.pushBack(99);
console.assert(d.peekBack() === 99 && d.peekFront() === 99 && d.size === 1, 'D:peek');
d.clear();
console.assert(d.isEmpty(), 'D:clear');
console.log('Deque OK');

// SinglyLinkedList
const sll = new SinglyLinkedList<number>();
sll.append(1); sll.append(2); sll.append(3);
sll.reverse();
console.assert(sll.toArray().join(',') === '3,2,1', 'SLL:reverse');
console.assert(sll.head?.value === 3 && sll.tail?.value === 1, 'SLL:head/tail after reverse');
sll.prepend(0);
console.assert(sll.head?.value === 0 && sll.size === 4, 'SLL:prepend');
sll.insertAt(2, 99);
console.assert(sll.toArray().join(',') === '0,3,99,2,1', 'SLL:insertAt');
console.assert(sll.find(99)?.value === 99, 'SLL:find');
console.assert(sll.find(999) === null, 'SLL:find null');
sll.deleteAt(2); // remove 99
console.assert(sll.toArray().join(',') === '0,3,2,1', 'SLL:deleteAt');
sll.append(3); // list: [0,3,2,1,3]
sll.deleteValue(3); // removes first 3
console.assert(sll.toArray().join(',') === '0,2,1,3', 'SLL:deleteValue first only');
console.log('SinglyLinkedList OK');

// DoublyLinkedList
const dll = new DoublyLinkedList<number>();
dll.append(1); dll.append(2); dll.append(3);
dll.insertAt(1, 99);
console.assert(dll.toArray().join(',') === '1,99,2,3', 'DLL:insertAt');
const mid = dll.head?.next;
console.assert(mid?.value === 99 && mid?.prev?.value === 1 && mid?.next?.value === 2, 'DLL:prev/next after insertAt');
dll.deleteTail();
console.assert(dll.tail?.value === 2 && dll.tail?.next === null, 'DLL:deleteTail');
dll.deleteHead();
console.assert(dll.head?.value === 99 && dll.head?.prev === null, 'DLL:deleteHead prev null');
dll.reverse();
console.assert(dll.toArray().join(',') === '2,99', 'DLL:reverse');
console.assert(dll.head?.prev === null && dll.tail?.next === null, 'DLL:head.prev/tail.next after reverse');
console.log('DoublyLinkedList OK');

// SkipList
const sl = new SkipList();
[30, 10, 20, 5, 15, 25].forEach(v => sl.insert(v));
console.assert(sl.toArray().join(',') === '5,10,15,20,25,30', 'SL:sorted');
console.assert(sl.search(15) === true, 'SL:search found');
console.assert(sl.search(99) === false, 'SL:search not found');
console.assert(sl.search(-1) === false, 'SL:search empty');
sl.delete(15);
console.assert(sl.search(15) === false, 'SL:after delete');
console.assert(sl.size === 5, 'SL:size after delete');
// Duplicates
sl.insert(10); // now two 10s
console.assert(sl.size === 6, 'SL:dup size');
console.assert(sl.toArray().filter(x => x === 10).length === 2, 'SL:dup toArray');
sl.delete(10); // removes one
console.assert(sl.search(10) === true && sl.size === 5, 'SL:dup one remains');
console.log('SkipList OK');

console.log('\nAll solutions PASS');
