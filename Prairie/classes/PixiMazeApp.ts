       
       import {Maze} from './MazeGenerator';
       class PixiMazeApp {
             public width: number = 42;
             public height: number = 39;
            // public app: PIXI.Application;
             public maze: Maze;
             public path: Node[];
             public hero: Node;
             public cellSize: number;
             public mazeContainer: ;
             public pathContainer: PIXI.Container;
             public heroContainer: PIXI.Container;

            constructor() {
                this.app = new PIXI.Application({
                    width: 600,
                    height: 600,
                    backgroundColor: 0x2c3e50,
                    antialias: true
                });

                document.getElementById('gameContainer').appendChild(this.app.view);

                this.maze = null;
                this.path = null;
                this.hero = null;
                this.cellSize = 20;

                // Graphics containers
                this.mazeContainer = new PIXI.Container();
                this.pathContainer = new PIXI.Container();
                this.heroContainer = new PIXI.Container();

                this.app.stage.addChild(this.mazeContainer);
                this.app.stage.addChild(this.pathContainer);
                this.app.stage.addChild(this.heroContainer);

                this.setupEventListeners();
                this.generateNewMaze();
            }

            setupEventListeners() {
                document.getElementById('generateBtn').addEventListener('click', () => {
                    this.generateNewMaze();
                });

                document.getElementById('solveBtn').addEventListener('click', () => {
                    this.solveMaze();
                });

                document.getElementById('animateBtn').addEventListener('click', () => {
                    this.animatePath();
                });
            }

            generateNewMaze() {
                this.maze = new Maze(25, 25);
                this.path = null;
                this.hero = null;

                this.cellSize = Math.min(
                    this.app.screen.width / this.maze.width,
                    this.app.screen.height / this.maze.height
                );

                this.drawMaze();
                this.clearPath();
                this.clearHero();
            }

            solveMaze() {
                if (!this.maze) return;

                this.path = dijkstra(this.maze);

                if (this.path) {
                    this.drawPath();
                }
            }

            animatePath() {
                if (!this.maze || !this.path) return;

                this.hero = new Person(...this.maze.start);
                this.hero.setPath(this.path);

                this.animateStep();
            }

            animateStep() {
                if (!this.hero || !this.hero.step()) return;

                this.drawHero();

                setTimeout(() => this.animateStep(), 100);
            }

            drawMaze() {
                this.mazeContainer.removeChildren();

                const grid = this.maze.getGrid();

                for (let y = 0; y < this.maze.height; y++) {
                    for (let x = 0; x < this.maze.width; x++) {
                        const cell = new PIXI.Graphics();
                        const cellX = x * this.cellSize;
                        const cellY = y * this.cellSize;

                        if (grid[y][x] === 1) {
                            // Wall
                            cell.beginFill(0x34495e);
                        } else {
                            // Passage
                            cell.beginFill(0xecf0f1);
                        }

                        cell.drawRect(0, 0, this.cellSize, this.cellSize);
                        cell.endFill();
                        cell.x = cellX;
                        cell.y = cellY;

                        this.mazeContainer.addChild(cell);
                    }
                }

                // Start cell
                const startCell = new PIXI.Graphics();
                startCell.beginFill(0x27ae60);
                startCell.drawRect(0, 0, this.cellSize, this.cellSize);
                startCell.endFill();
                startCell.x = this.maze.start[0] * this.cellSize;
                startCell.y = this.maze.start[1] * this.cellSize;
                this.mazeContainer.addChild(startCell);

                // End cell
                const endCell = new PIXI.Graphics();
                endCell.beginFill(0xe74c3c);
                endCell.drawRect(0, 0, this.cellSize, this.cellSize);
                endCell.endFill();
                endCell.x = this.maze.end[0] * this.cellSize;
                endCell.y = this.maze.end[1] * this.cellSize;
                this.mazeContainer.addChild(endCell);
            }

            drawPath() {
                this.clearPath();

                if (!this.path) return;

                const pathGraphics = new PIXI.Graphics();
                pathGraphics.lineStyle(3, 0xf39c12);

                for (let i = 0; i < this.path.length; i++) {
                    const [x, y] = this.path[i];
                    const cellX = x * this.cellSize + this.cellSize / 2;
                    const cellY = y * this.cellSize + this.cellSize / 2;

                    if (i === 0) {
                        pathGraphics.moveTo(cellX, cellY);
                    } else {
                        pathGraphics.lineTo(cellX, cellY);
                    }
                }

                this.pathContainer.addChild(pathGraphics);
            }

            drawHero() {
                this.clearHero();

                if (!this.hero) return;

                const heroGraphics = new PIXI.Graphics();
                heroGraphics.beginFill(0x3498db);
                heroGraphics.drawCircle(0, 0, this.cellSize / 3);
                heroGraphics.endFill();

                heroGraphics.x = this.hero.x * this.cellSize + this.cellSize / 2;
                heroGraphics.y = this.hero.y * this.cellSize + this.cellSize / 2;

                this.heroContainer.addChild(heroGraphics);
            }

            clearPath() {
                this.pathContainer.removeChildren();
            }

            clearHero() {
                this.heroContainer.removeChildren();
            }
        }