import { Cell } from './Cell' 
export interface newInstance {
    position: {
        x: number, y:number
    }
}

export class Map {
    public size : { maxWidth: number; maxHeight: number }
    public cell: Cell<{x: number, y: number}>[][]
    public newPosition: newInstance[]

    constructor(maxWidth: number, maxHeight: number) {
        this.size = { maxWidth, maxHeight }
        this.cell = this.initializeGrid(maxWidth, maxHeight);
        this.newPosition = [];
    }

    private initializeGrid (maxWidth: number, maxHeight: number): Cell<{x: number, y : number}>[][] {
        const grid: Cell<{x: number, y: number}>[][] = [];

        for (let y = 0; y < maxHeight; y++) {
            grid[y] = []
            for (let x = 0; x < maxWidth; x++) {
                const cellData = { x, y };
                const comparator = (a: any, b: any) => a.x === b.x && a.y === b.y ? 0 : 1;
                grid[y][x] = new Cell(cellData, comparator);
            }
        }

        this.connectAdjacentCells(grid);

        return grid;
    } 

     private connectAdjacentCells(grid: Cell<{x: number, y: number}>[][]): void {
        for (let y = 0; y < this.size.maxHeight; y++) {
            for (let x = 0; x < this.size.maxWidth; x++) {
                const currentCell = grid[y][x];
                
                // Connecter avec les 4 voisines
                if (x > 0) currentCell.addAdjacent(grid[y][x-1]); // Gauche
                if (x < this.size.maxWidth-1) currentCell.addAdjacent(grid[y][x+1]); // Droite
                if (y > 0) currentCell.addAdjacent(grid[y-1][x]); // Haut
                if (y < this.size.maxHeight-1) currentCell.addAdjacent(grid[y+1][x]); // Bas
            }
        }
    }

    public addObstacle(x: number, y: number): void {
        if (x >= 0 && x < this.size.maxWidth && y >= 0 && y < this.size.maxHeight) {
            this.cell[y][x].isObstacles = true;
        }
    }

    public displayMap(): void {
        console.log('\n🗺️  Carte:');
        for (let y = 0; y < this.size.maxHeight; y++) {
            let line = '';
            for (let x = 0; x < this.size.maxWidth; x++) {
                const cell = this.cell[y][x];
                if (cell.isEntrance) {
                    line += 'E ';  // Entrée
                } else if (cell.isObstacles) {
                    line += 'X ';  // Obstacle
                } else {
                    line += '. ';  // Case normale
                }
            }
            console.log(line);
        }
    }
}