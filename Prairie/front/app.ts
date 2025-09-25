// app.ts - Application simple
import { Maze } from '../classes/MazeGenerator.js';
import { dijkstra } from '../classes/DijkstraPathfinder.js';
import { Person } from '../classes/Person.js';

class MazeApp {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private maze: Maze | null = null;
    private path: [number, number][] | null = null;
    private hero: Person | null = null;
    private cellSize: number = 20;
    
    constructor() {
        this.canvas = document.getElementById('mazeCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        
        this.setupEventListeners();
        this.generateNewMaze();
    }

    private setupEventListeners(): void {
        document.getElementById('generateBtn')!.addEventListener('click', () => {
            this.generateNewMaze();
        });

        document.getElementById('solveBtn')!.addEventListener('click', () => {
            this.solveMaze();
        });

        document.getElementById('animateBtn')!.addEventListener('click', () => {
            this.animatePath();
        });
    }

    private generateNewMaze(): void {
        this.maze = new Maze(25, 25);
        this.path = null;
        this.hero = null;
        
        this.cellSize = Math.min(
            this.canvas.width / this.maze.width,
            this.canvas.height / this.maze.height
        );
        
        this.drawMaze();
    }

    private solveMaze(): void {
        if (!this.maze) return;
        
        this.path = dijkstra(this.maze);
        
        if (this.path) {
            this.drawMaze();
            this.drawPath();
        }
    }

    private animatePath(): void {
        if (!this.maze || !this.path) return;

        this.hero = new Person(...this.maze.start);
        this.hero.setPath(this.path);
        
        this.animateStep();
    }

    private animateStep(): void {
        if (!this.hero || !this.hero.step()) return;

        this.drawMaze();
        this.drawPath();
        this.drawHero();
        
        setTimeout(() => this.animateStep(), 100);
    }

    private drawMaze(): void {
        const ctx = this.ctx;
        const grid = this.maze!.getGrid();
        
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let y = 0; y < this.maze!.height; y++) {
            for (let x = 0; x < this.maze!.width; x++) {
                const cellX = x * this.cellSize;
                const cellY = y * this.cellSize;
                
                if (grid[y][x] === 1) {
                    ctx.fillStyle = '#34495e';
                    ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                } else {
                    ctx.fillStyle = '#ecf0f1';
                    ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                }
            }
        }
        
        // Entrée
        const startX = this.maze!.start[0] * this.cellSize;
        const startY = this.maze!.start[1] * this.cellSize;
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(startX, startY, this.cellSize, this.cellSize);
        
        // Sortie
        const endX = this.maze!.end[0] * this.cellSize;
        const endY = this.maze!.end[1] * this.cellSize;
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(endX, endY, this.cellSize, this.cellSize);
    }

    private drawPath(): void {
        if (!this.path) return;
        
        const ctx = this.ctx;
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i < this.path.length; i++) {
            const [x, y] = this.path[i];
            const cellX = x * this.cellSize + this.cellSize / 2;
            const cellY = y * this.cellSize + this.cellSize / 2;
            
            if (i === 0) {
                ctx.moveTo(cellX, cellY);
            } else {
                ctx.lineTo(cellX, cellY);
            }
        }
        
        ctx.stroke();
    }

    private drawHero(): void {
        if (!this.hero) return;
        
        const ctx = this.ctx;
        const heroX = this.hero.x * this.cellSize + this.cellSize / 2;
        const heroY = this.hero.y * this.cellSize + this.cellSize / 2;
        
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(heroX, heroY, this.cellSize / 3, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', () => {
    new MazeApp();
});