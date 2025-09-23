"use strict";
// export class Cell<T> {
//   data: T;
//   adjacent: Cell<T>[];
//   comparator: (a: T, b: T) => number;
//   isEntrance?: boolean = false;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
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
var Cell = /** @class */ (function () {
    function Cell(data, comparator, isEntrance) {
        this.isEntrance = false;
        this.isObstacles = false;
        this.data = data;
        this.adjacent = [];
        this.comparator = comparator;
        this.isEntrance = isEntrance;
        this.isObstacles = this.isObstacles;
    }
    Cell.prototype.addAdjacent = function (cell) {
        this.adjacent.push(cell);
    };
    Cell.prototype.canPass = function () {
        return !this.isObstacles;
    };
    return Cell;
}());
exports.Cell = Cell;
