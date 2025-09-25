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

   export class PixiPerson {
    public x: number;
    public y: number;
    private path: [number, number][] | null = null;
    private pathIndex: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    setPath(path: [number, number][]): void {
        this.path = path;
        this.pathIndex = 0;
    }

    step(): boolean {
        if (!this.path || this.pathIndex >= this.path.length) {
            return false;
        }

        const [newX, newY] = this.path[this.pathIndex];
        this.x = newX;
        this.y = newY;
        this.pathIndex++;

        return this.pathIndex < this.path.length;
    }
}