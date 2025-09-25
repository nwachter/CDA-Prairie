// Person.ts
export class Person {
    x: number; y: number;
    private path: [number, number][] = [];
    private i = 0;
  
    constructor(x: number, y: number) { this.x=x; this.y=y; }
  
    setPath(p: [number, number][]) { this.path = p; this.i = 0; }
  
    step(): boolean {
      if (this.i >= this.path.length-1) return false;
      this.i++;
      [this.x, this.y] = this.path[this.i];
      return true;
    }
  }
  