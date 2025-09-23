import {Cell} from './Cell';

class Stack {
    public top?: Cell; //prot
    public size: number = 0;

    constructor() { }

    addToTop(cell: Cell) {
        if(this.size === 0) {
            this.top = cell;
            this.size++;
        } else if(this.size > 0) {
            cell.next = this.top;
            this.top = cell;
            this.size++;
        }
    }

    deleteFromTop() {
        if(this.size === 0) return;
        if(this.size > 0) {
            if(this.top) {
                const buffer = this.top;
                this.top = this.top.next;
                this.size--;
                return buffer;
            }
           
        } 
    
    }

    isEmpty() {
        return this.size === 0;
    }

    toString() {
        let result = "";
        let current = this.top;
        while(current) {
            result += current.value + "\n";
            current = current.next ?? null;
        }
        return result;
    }
}