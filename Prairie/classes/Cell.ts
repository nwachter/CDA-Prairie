
// export class Cell<T> {
//   data: T;
//   adjacent: Cell<T>[];
//   comparator: (a: T, b: T) => number;
//   isEntrance?: boolean = false;

//   constructor(data: T, comparator: (a: T, b: T) => number, isEntrance?: boolean) {
//     this.data = data;
//     this.adjacent = [];
//     this.comparator = comparator;
//     this.isEntrance = isEntrance ?? false;
//   }

//   addAdjacent(Cell: Cell<T>): void {
//     this.adjacent.push(Cell);
//   }

//   removeAdjacent(data: T): Cell<T> | null {
//     const index = this.adjacent.findIndex(
//       (Cell) => this.comparator(Cell.data, data) === 0
//     );

//     if (index > -1) {
//       return this.adjacent.splice(index, 1)[0];
//     }

//     return null;
//   }
// }

// export default Cell;

export class Cell<T> {
  data: T;
  adjacent: Cell<T>[];
  comparator: (a: T, b :T) => number
  isEntrance?: boolean = false
  isObstacles?: boolean = false;

  constructor(data: T, comparator: (a: T, b: T) => number, isEntrance?: boolean) {
    this.data = data;
    this.adjacent = []
    this.comparator = comparator
    this.isEntrance = isEntrance
    this.isObstacles = this.isObstacles
  }

  addAdjacent(cell: Cell<T>): void {
    this.adjacent.push(cell)
  }


  canPass(): boolean {
    return !this.isObstacles
  }
}