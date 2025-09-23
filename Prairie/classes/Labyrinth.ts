class Labyrinth {
  grid: number[][]; // 0 = free, 1 = wall
  start: [number, number];
  end: [number, number];

  constructor(grid: number[][], start: [number, number], end: [number, number]) {
    this.grid = grid;
    this.start = start;
    this.end = end;
  }


}

export  {Labyrinth};
