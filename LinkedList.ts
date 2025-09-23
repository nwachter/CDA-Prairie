import {Cell} from "./Cell";
class LinkedList {
    public first?: Cell; //prot
    public last?: Cell; //prot
    public size: number = 0;

    constructor() { }

    addToEnd(cell: Cell) {
        if(this.size === 0) {
            this.first = cell;
            this.last = this.first;

        } else if(this.size > 0) {
            if(this.last) {
                this.last.next = cell;
                this.last = cell;
            }
        }
        this.size++;
    }

    toString() {
        if(!this.first) return;
        let strList = String(this.first.value);
        let current = this.first;

        while(current.next) {
            strList += " , " + String(current.next.value); 
            current = current.next ?? null;
        }
        return strList;
    }
}

export { LinkedList };