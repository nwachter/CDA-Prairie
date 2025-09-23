class Cell {
    public value: number;
    public next?: Cell;

    constructor(value: number, next?: Cell) {
        this.value = value;
        this.next = next;
    }

}

export { Cell };