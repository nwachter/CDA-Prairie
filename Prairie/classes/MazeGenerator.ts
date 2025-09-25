        // Maze Generator Class
        export class Maze {
              private grid: number[][];           // 0 = passage, 1 = mur
    readonly width: number;
    readonly height: number;
    readonly start: [number, number];
    readonly end: [number, number];

            constructor(width = 30, height = 30) {
                this.width = width % 2 ? width : width + 1;
                this.height = height % 2 ? height : height + 1;
                this.grid = Array.from({ length: this.height }, () => Array(this.width).fill(1));
                this.start = [1, 1];
                this.end = [this.width - 2, this.height - 2];
                this.generateDFS();
            }

            generateDFS() {
                const stack : [number, number][] = [];
                const seen = new Set();
                const dirs = [[0, -2], [2, 0], [0, 2], [-2, 0]];

                const visit = (x: number, y: number) => {
                    seen.add(`${x},${y}`);
                    this.grid[y][x] = 0;
                    stack.push([x, y]);
                };

                visit(...this.start);

                while (stack.length) {
                    const [x, y] = stack[stack.length - 1];
                    const next = dirs
                        .map(([dx, dy]) => [x + dx, y + dy])
                        .filter(([nx, ny]) =>
                            nx > 0 && nx < this.width - 1 &&
                            ny > 0 && ny < this.height - 1 &&
                            !seen.has(`${nx},${ny}`)
                        );

                    if (!next.length) {
                        stack.pop();
                        continue;
                    }

                    const [nx, ny] = next[Math.floor(Math.random() * next.length)];
                    this.grid[Math.floor((y + ny) / 2)][Math.floor((x + nx) / 2)] = 0;
                    visit(nx, ny);
                }

                this.grid[this.start[1]][this.start[0]] = 0;
                this.grid[this.end[1]][this.end[0]] = 0;
            }

            neighbors(x: number, y: number) {
                const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
                return dirs
                    .map(([dx, dy]) => [x + dx, y + dy])
                    .filter(([nx, ny]) =>
                        nx >= 0 && nx < this.width &&
                        ny >= 0 && ny < this.height &&
                        this.grid[ny][nx] === 0
                    );
            }

            getGrid() {
                return this.grid;
            }
        }