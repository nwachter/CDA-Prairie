import { Cell } from "./Cell"

class Carte<T> {
  nodes: Map<T, Cell<T>> = new Map();
  comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }


  addCell(data: T): Cell<T> {
    let node = this.nodes.get(data);

    if (node) return node;

    node = new Cell(data, this.comparator);
    this.nodes.set(data, node);

    return node;
  }

}

// export default class Carte{
//     public x : number;
//     public y : number;
//     public first: Cell;

//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
        
//     }
// }

export default Carte;