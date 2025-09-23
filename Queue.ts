import {Cell} from './Cell';

class Queue {
    public first?: Cell; //prot
    public last?: Cell
    public size: number = 0;

    constructor() { }

    addCell(cell: Cell) {
        if(this.size === 0) {
            this.first = cell;
            this.last = this.first;

            this.size = 1;
        } else if(this.size > 0) {
            if(this.last) {
                this.last.next = cell; //on ajoute par la fin
                this.last = cell; //la derniere Cell in
                //devient la derniere de la file
                this.size++;

            }
        }
    }

    removeFirstCell() {
        if(!this.first) return;
        const cellToRemove = this.first;
        this.first = this.first.next;
        this.size--;
        return cellToRemove;
    }

    toString() {
        if(this.first) {
       
        let current = this.first;
        let str = String(this.first.value);
        while(current.next) {
            str += " , " + String(current.next.value);
            current = current.next ?? null;
        }
        return str;
        
    }
     return "vide";
}
}