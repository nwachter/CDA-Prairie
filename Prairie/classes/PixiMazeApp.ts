// src/front/app.ts - Multi-Maze Race with Scoreboard
import * as PIXI from 'pixi.js';
import { Maze } from '../classes/MazeGenerator.js';
import { dijkstra } from '../classes/DijkstraPathfinder.js';
import { Person } from '../classes/Person.js';
//import { Application, Graphics } from 'https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.min.js';

interface MazeInstance {
    maze: Maze;
    path: [number, number][] | null;
    hero: Person | null;
    container: PIXI.Container;
    heroContainer: PIXI.Container;
    pathContainer: PIXI.Container;
    effectsContainer: PIXI.Container;
    heroLight: PIXI.Graphics | null;
    isFinished: boolean;
    heroColor: number;
    heroColorName: string;
    hasBeenWon: boolean;
}

export class PixiMazeApp {
    private app: PIXI.Application;
    private mazes: MazeInstance[] = [];
    private cellSize: number = 15;
    private mazeSize: number = 400;
    
    // UI Elements
    private scoreboardContainer!: PIXI.Container;
    private winnerTextContainer!: PIXI.Container;
    private scores: { [key: string]: number } = {
        'Bleu': 0,
        'Rouge': 0,
        'Vert': 0,
        'Jaune': 0
    };

    // Filters
    private blurFilter!: PIXI.BlurFilter;
    private noiseFilter!: PIXI.NoiseFilter;

    // Hero configurations
    private heroConfigs = [
        { color: 0x4488ff, name: 'Bleu', lightColor: 0x6699ff },
        { color: 0xff4444, name: 'Rouge', lightColor: 0xff6666 },
        { color: 0x44ff44, name: 'Vert', lightColor: 0x66ff66 },
        { color: 0xffff44, name: 'Jaune', lightColor: 0xffff88 }
    ];

    constructor() {
        this.app = new PIXI.Application();
        this.initializeAsync();
    }

    private async initializeAsync(): Promise<void> {
        // Get full window dimensions
        const width = window.innerWidth;
        const height = window.innerHeight;

        await this.app.init({
            width,
            height,
            backgroundColor: 0x0a0a0a,
            antialias: true
        });

        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(this.app.canvas);
        }

        // Resize handler for responsive design
        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            this.repositionElements();
        });

        // Initialize filters
        this.blurFilter = new PIXI.BlurFilter();
        this.blurFilter.blur = 2;
        this.noiseFilter = new PIXI.NoiseFilter();
        this.noiseFilter.noise = 0.1;

        // Initialize UI containers with proper positioning
        this.scoreboardContainer = new PIXI.Container();
        this.winnerTextContainer = new PIXI.Container();
        
        this.app.stage.addChild(this.scoreboardContainer);
        this.app.stage.addChild(this.winnerTextContainer);

        this.setupEventListeners();
        this.generateNewMazes();
        this.createScoreboard();
        this.startAmbientEffects();
        this.repositionElements();
    }

    private repositionElements(): void {
        // Position scoreboard on the left
        this.scoreboardContainer.x = 20;
        this.scoreboardContainer.y = 50;

        // Center the mazes
        const totalMazeWidth = 2 * (this.mazeSize + 50) - 50; // 2 mazes wide with gaps
        const totalMazeHeight = 2 * (this.mazeSize + 50) - 50; // 2 mazes tall with gaps
        const startX = (this.app.screen.width - totalMazeWidth) / 2;
        const startY = (this.app.screen.height - totalMazeHeight) / 2;

        this.mazes.forEach((mazeInstance, i) => {
            const x = startX + (i % 2) * (this.mazeSize + 50);
            const y = startY + Math.floor(i / 2) * (this.mazeSize + 50);
            
            mazeInstance.container.x = x;
            mazeInstance.container.y = y;
        });
    }

    private setupEventListeners(): void {
        const generateBtn = document.getElementById('generateBtn');
        const solveBtn = document.getElementById('solveBtn');
        const animateBtn = document.getElementById('animateBtn');

        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateNewMazes();
            });
        }

        if (solveBtn) {
            solveBtn.addEventListener('click', () => {
                this.solveMazes();
            });
        }

        if (animateBtn) {
            animateBtn.addEventListener('click', () => {
                this.animateRace();
            });
        }

        // Add new race button functionality
        const newRaceBtn = document.createElement('button');
        newRaceBtn.id = 'newRaceBtn';
        newRaceBtn.textContent = 'Nouvelle Course';
        newRaceBtn.style.display = 'none'; // Hidden initially
        
        const controlsDiv = document.querySelector('.controls');
        if (controlsDiv) {
            controlsDiv.appendChild(newRaceBtn);
            newRaceBtn.addEventListener('click', () => {
                this.startNewRace();
            });
        }
    }

    private generateNewMazes(): void {
        // Clear existing mazes
        this.mazes.forEach(mazeInstance => {
            this.app.stage.removeChild(mazeInstance.container);
        });
        this.mazes = [];

        // Create 4 mazes in 2x2 grid
        for (let i = 0; i < 4; i++) {            
            this.createMaze(i);
        }

        this.clearWinnerText();
        this.repositionElements();
        
        // Hide new race button when generating new mazes
        const newRaceBtn = document.getElementById('newRaceBtn') as HTMLButtonElement;
        if (newRaceBtn) {
            newRaceBtn.style.display = 'none';
        }

            this.app.stage.removeChild(this.winnerTextContainer);
    this.app.stage.addChild(this.winnerTextContainer);
    }

    private createMaze(index: number): void {
        const maze = new Maze(25, 25);
        const heroConfig = this.heroConfigs[index];
        
        // Create containers for this maze
        const container = new PIXI.Container();
        const backgroundContainer = new PIXI.Container();
        const mazeContainer = new PIXI.Container();
        const effectsContainer = new PIXI.Container();
        const pathContainer = new PIXI.Container();
        const heroContainer = new PIXI.Container();

        // Add effects
        mazeContainer.filters = [this.noiseFilter];
        effectsContainer.filters = [this.blurFilter];

        container.addChild(backgroundContainer);
        container.addChild(mazeContainer);
        container.addChild(effectsContainer);
        container.addChild(pathContainer);
        container.addChild(heroContainer);

        // Position will be set in repositionElements()
        container.x = 0;
        container.y = 0;

        const mazeInstance: MazeInstance = {
            maze,
            path: null,
            hero: null,
            container,
            heroContainer,
            pathContainer,
            effectsContainer,
            heroLight: null,
            isFinished: false,
            heroColor: heroConfig.color,
            heroColorName: heroConfig.name,
            hasBeenWon: false
        };

        this.mazes.push(mazeInstance);
        this.app.stage.addChild(container);

        this.cellSize = this.mazeSize / Math.max(maze.width, maze.height);

        this.drawMazeBackground(backgroundContainer);
        this.drawMaze(mazeInstance, mazeContainer);
        this.addTorchLights(effectsContainer, maze);
    }

    // private startNewRace(): void {
    //     // Keep same mazes but reset heroes for new race
    //     this.mazes.forEach(mazeInstance => {
    //         mazeInstance.isFinished = false;
    //         mazeInstance.hasBeenWon = false;
    //         mazeInstance.heroContainer.removeChildren();
    //         if (mazeInstance.path) {
    //             mazeInstance.hero = new Person(...mazeInstance.maze.start);
    //             mazeInstance.hero.setPath(mazeInstance.path);
    //             this.createHero(mazeInstance);
    //         }
    //     });

    //     this.clearWinnerText();
    //     this.startRaceAnimation();
        
    //     // Hide new race button during race
    //     const newRaceBtn = document.getElementById('newRaceBtn') as HTMLButtonElement;
    //     if (newRaceBtn) {
    //         newRaceBtn.style.display = 'none';
    //     }
    // }

    private drawMazeBackground(container: PIXI.Container): void {
        container.removeChildren();
        
        const bg = new PIXI.Graphics();
        
        // Simple gradient using multiple rectangles
        for (let i = 0; i < this.mazeSize; i += 3) {
            const ratio = i / this.mazeSize;
            const r1 = 0x1a, g1 = 0x1a, b1 = 0x2e;
            const r2 = 0x0f, g2 = 0x0f, b2 = 0x23;
            
            const r = Math.floor(r1 + (r2 - r1) * ratio);
            const g = Math.floor(g1 + (g2 - g1) * ratio);
            const b = Math.floor(b1 + (b2 - b1) * ratio);
            
            const color = (r << 16) | (g << 8) | b;
            
            bg.beginFill(color);
            bg.drawRect(0, i, this.mazeSize, 3);
            bg.endFill();
        }
        
        container.addChild(bg);
    }

    private drawMaze(mazeInstance: MazeInstance, container: PIXI.Container): void {
        container.removeChildren();

        const grid = mazeInstance.maze.getGrid();

        for (let y = 0; y < mazeInstance.maze.height; y++) {
            for (let x = 0; x < mazeInstance.maze.width; x++) {
                const cell = new PIXI.Graphics();
                const cellX = x * this.cellSize;
                const cellY = y * this.cellSize;

                if (grid[y][x] === 1) {
                    // Stone walls with alternating colors for depth
                    const wallColor = (x + y) % 2 === 0 ? 0x2c2c54 : 0x1a1a2e;
                    cell.beginFill(wallColor);
                    cell.drawRect(0, 0, this.cellSize, this.cellSize);
                    cell.endFill();
                    
                    // Add stone border
                    cell.lineStyle(1, 0x404040, 0.8);
                    cell.drawRect(0, 0, this.cellSize, this.cellSize);
                    
                    // Add highlight for 3D effect
                    cell.lineStyle(1, 0x505070, 0.6);
                    cell.moveTo(0, 0);
                    cell.lineTo(this.cellSize, 0);
                    cell.moveTo(0, 0);
                    cell.lineTo(0, this.cellSize);
                } else {
                    // Dark floor
                    cell.beginFill(0x0a0a0a);
                    cell.drawRect(0, 0, this.cellSize, this.cellSize);
                    cell.endFill();
                }

                cell.x = cellX;
                cell.y = cellY;
                container.addChild(cell);
            }
        }

        // Portals
        this.createPortal(container, mazeInstance.maze.start[0], mazeInstance.maze.start[1], 0x00ff88, 'START');
        this.createPortal(container, mazeInstance.maze.end[0], mazeInstance.maze.end[1], 0xff4444, 'END');
    }

    private createPortal(container: PIXI.Container, x: number, y: number, color: number, type: string): void {
        const portal = new PIXI.Container();
        
        // Base circle
        const base = new PIXI.Graphics();
        base.beginFill(color, 0.3);
        base.drawCircle(this.cellSize / 2, this.cellSize / 2, this.cellSize / 2.5);
        base.endFill();
        
        // Glowing ring
        const ring = new PIXI.Graphics();
        ring.lineStyle(2, color, 0.8);
        ring.drawCircle(this.cellSize / 2, this.cellSize / 2, this.cellSize / 3);
        
        // Inner glow
        const glow = new PIXI.Graphics();
        glow.beginFill(color, 0.1);
        glow.drawCircle(this.cellSize / 2, this.cellSize / 2, this.cellSize / 4);
        glow.endFill();
        
        portal.addChild(base);
        portal.addChild(glow);
        portal.addChild(ring);
        portal.x = x * this.cellSize;
        portal.y = y * this.cellSize;
        
        container.addChild(portal);
        
        this.animatePortal(portal, type);
    }

    private animatePortal(portal: PIXI.Container, type: string): void {
        const baseScale = 1;
        const scaleAmount = type === 'START' ? 0.1 : 0.15;
        const speed = type === 'START' ? 0.02 : 0.025;
        
        const animate = () => {
            const time = Date.now() * speed;
            portal.scale.set(baseScale + Math.sin(time) * scaleAmount);
            portal.rotation = Math.sin(time * 0.5) * 0.1;
        };
        
        this.app.ticker.add(animate);
    }

    private addTorchLights(container: PIXI.Container, maze: Maze): void {
        const grid = maze.getGrid();
        for (let y = 2; y < maze.height - 2; y += 6) {
            for (let x = 2; x < maze.width - 2; x += 6) {
                if (grid[y][x] === 1 && Math.random() > 0.6) {
                    this.createTorchLight(container, x, y);
                }
            }
        }
    }

private createTorchLight(container: PIXI.Container, x: number, y: number): void {
    const torch = new PIXI.Graphics();
    const centerX = x * this.cellSize + this.cellSize / 2;
    const centerY = y * this.cellSize + this.cellSize / 2;
    
    // Create flame shape instead of circular light
    const flameHeight = 12; // Reduced from 20
    const flameWidth = 8;   // Reduced width for more flame-like proportions
    const segments = 8;     // Fewer segments for better performance
    
    for (let i = 0; i < segments; i++) {
        const ratio = i / segments;
        
        // Create flame shape using elliptical segments
        const currentHeight = flameHeight * (1 - ratio);
        const currentWidth = flameWidth * (1 - ratio * 0.7); // Width tapers more at top
        const alpha = (1 - ratio) * 0.25; // Slightly more transparent
        
        let color: number;
        if (ratio < 0.2) {
            color = 0xffaa44; // Bright yellow-orange core
        } else if (ratio < 0.5) {
            color = 0xff6622; // Orange middle
        } else if (ratio < 0.8) {
            color = 0xff3311; // Red outer
        } else {
            color = 0x441100; // Dark red edge
        }
        
        torch.beginFill(color, alpha);
        
        // Draw flame-shaped ellipse (taller than wide)
        const flameX = centerX;
        const flameY = centerY - currentHeight * 0.3; // Offset upward for flame effect
        
        // Create flame shape using a stretched ellipse
        torch.drawEllipse(flameX, flameY, currentWidth, currentHeight);
        torch.endFill();
    }
    
    // Add a small base/ember at the bottom
    torch.beginFill(0xff8844, 0.6);
    torch.drawCircle(centerX, centerY + 2, 2);
    torch.endFill();
    
    container.addChild(torch);
    this.animateTorch(torch, centerX, centerY);
}

private animateTorch(torch: PIXI.Graphics, centerX: number, centerY: number): void {
    const animate = () => {
        const time = Date.now() * 0.008; // Slightly faster flicker
        const flicker = 10 + Math.sin(time) * 1.5 + Math.sin(time * 2.3) * 1; // Smaller base size
        const alpha = 0.3 + Math.sin(time * 1.8) * 0.08; // More subtle alpha variation
        
        torch.clear();
        
        const segments = 8;
        const flameWidth = 6 + Math.sin(time * 3.1) * 1.5; // Animated width variation
        
        for (let i = 0; i < segments; i++) {
            const ratio = i / segments;
            const currentHeight = flicker * (1 - ratio);
            const currentWidth = (flameWidth * (1 - ratio * 0.7)) + Math.sin(time * 4.7 + i) * 0.8;
            const segmentAlpha = (1 - ratio) * alpha * 0.4;
            
            // Add slight horizontal wobble for more realistic flame movement
            const wobbleX = Math.sin(time * 2.5 + i * 0.5) * (ratio * 1.5);
            
            let color: number;
            if (ratio < 0.2) {
                color = 0xffaa44; // Bright yellow-orange core
            } else if (ratio < 0.5) {
                color = 0xff6622; // Orange middle
            } else if (ratio < 0.8) {
                color = 0xff3311; // Red outer
            } else {
                color = 0x441100; // Dark red edge
            }
            
            torch.beginFill(color, segmentAlpha);
            
            const flameX = centerX + wobbleX;
            const flameY = centerY - currentHeight * 0.3;
            
            torch.drawEllipse(flameX, flameY, Math.max(currentWidth, 0.5), currentHeight);
            torch.endFill();
        }
        
        // Animated base ember
        const emberSize = 2 + Math.sin(time * 1.2) * 0.5;
        torch.beginFill(0xff8844, 0.6 + Math.sin(time * 2.1) * 0.2);
        torch.drawCircle(centerX, centerY + 2, emberSize);
        torch.endFill();
    };
    
    this.app.ticker.add(animate);
}

    private solveMazes(): void {
        this.mazes.forEach(mazeInstance => {
            mazeInstance.path = dijkstra(mazeInstance.maze);
            if (mazeInstance.path) {
                this.drawPath(mazeInstance);
            }
        });
    }

    private drawPath(mazeInstance: MazeInstance): void {
        mazeInstance.pathContainer.removeChildren();

        if (!mazeInstance.path) return;

        const pathGlow = new PIXI.Graphics();
        pathGlow.lineStyle(4, 0x66ffff, 0.4);

        for (let i = 0; i < mazeInstance.path.length; i++) {
            const [x, y] = mazeInstance.path[i];
            const cellX = x * this.cellSize + this.cellSize / 2;
            const cellY = y * this.cellSize + this.cellSize / 2;

            if (i === 0) {
                pathGlow.moveTo(cellX, cellY);
            } else {
                pathGlow.lineTo(cellX, cellY);
            }
        }

        pathGlow.lineStyle(2, 0xaaffff, 0.9);
        for (let i = 0; i < mazeInstance.path.length; i++) {
            const [x, y] = mazeInstance.path[i];
            const cellX = x * this.cellSize + this.cellSize / 2;
            const cellY = y * this.cellSize + this.cellSize / 2;

            if (i === 0) {
                pathGlow.moveTo(cellX, cellY);
            } else {
                pathGlow.lineTo(cellX, cellY);
            }
        }

        mazeInstance.pathContainer.addChild(pathGlow);
    }

    private animateRace(): void {
        // Reset all mazes
        this.mazes.forEach(mazeInstance => {
            mazeInstance.isFinished = false;
            mazeInstance.hasBeenWon = false;
            if (mazeInstance.path) {
                mazeInstance.hero = new Person(...mazeInstance.maze.start);
                mazeInstance.hero.setPath(mazeInstance.path);
                this.createHero(mazeInstance);
            }
        });

        this.clearWinnerText();
        this.startRaceAnimation();
        
        // Hide new race button during race
        const newRaceBtn = document.getElementById('newRaceBtn') as HTMLButtonElement;
        if (newRaceBtn) {
            newRaceBtn.style.display = 'none';
        }
    }

    private startNewRace(): void {
        // Keep same mazes but reset heroes for new race
        this.mazes.forEach(mazeInstance => {
            mazeInstance.isFinished = false;
            mazeInstance.hasBeenWon = false;
            mazeInstance.heroContainer.removeChildren();
            if (mazeInstance.path) {
                mazeInstance.hero = new Person(...mazeInstance.maze.start);
                mazeInstance.hero.setPath(mazeInstance.path);
                this.createHero(mazeInstance);
            }
        });

        this.clearWinnerText();
        this.startRaceAnimation();
        
        // Hide new race button during race
        const newRaceBtn = document.getElementById('newRaceBtn') as HTMLButtonElement;
        if (newRaceBtn) {
            newRaceBtn.style.display = 'none';
        }
    }

    private createHero(mazeInstance: MazeInstance): void {
        if (!mazeInstance.hero) return;
        
        mazeInstance.heroContainer.removeChildren();
        
        const heroGroup = new PIXI.Container();
        
        // Create hero light with hero's color
        mazeInstance.heroLight = new PIXI.Graphics();
        const lightRadius = 15;
        const lightSegments = 12;
        const heroConfig = this.heroConfigs.find(config => config.color === mazeInstance.heroColor)!;
        
        for (let i = 0; i < lightSegments; i++) {
            const ratio = i / lightSegments;
            const currentRadius = lightRadius * (1 - ratio);
            const alpha = (1 - ratio) * 0.3;
            
            const color = ratio < 0.5 ? heroConfig.lightColor : heroConfig.color;
            
            mazeInstance.heroLight.beginFill(color, alpha);
            mazeInstance.heroLight.drawCircle(0, 0, currentRadius);
            mazeInstance.heroLight.endFill();
        }
        
        // Hero body
        const hero = new PIXI.Graphics();
        hero.beginFill(mazeInstance.heroColor);
        hero.drawCircle(0, 0, this.cellSize / 4);
        hero.endFill();
        
        // Hero glow
        hero.lineStyle(2, heroConfig.lightColor, 0.8);
        hero.drawCircle(0, 0, this.cellSize / 3.5);
        
        heroGroup.addChild(mazeInstance.heroLight);
        heroGroup.addChild(hero);
        
        heroGroup.x = mazeInstance.hero.x * this.cellSize + this.cellSize / 2;
        heroGroup.y = mazeInstance.hero.y * this.cellSize + this.cellSize / 2;
        
        mazeInstance.heroContainer.addChild(heroGroup);
        
        this.animateHero(heroGroup);
    }

    private animateHero(heroGroup: PIXI.Container): void {
        const animate = () => {
            const time = Date.now() * 0.004;
            heroGroup.scale.set(1 + Math.sin(time) * 0.08);
            if (heroGroup.children[0]) {
                heroGroup.children[0].alpha = 0.5 + Math.sin(time * 1.5) * 0.2;
            }
        };
        
        this.app.ticker.add(animate);
    }

    private startRaceAnimation(): void {
        const activeHeroes = this.mazes.filter(m => m.hero && m.path && !m.isFinished && !m.hasBeenWon);
        
        if (activeHeroes.length === 0) return;

        activeHeroes.forEach(mazeInstance => {
            this.animateHeroStep(mazeInstance);
        });
    }

    private animateHeroStep(mazeInstance: MazeInstance): void {
        // Check if race has been won by someone else
        const raceWon = this.mazes.some(m => m.hasBeenWon);
        
        if (!mazeInstance.hero || mazeInstance.isFinished || raceWon || !mazeInstance.hero.step()) {
            if (!mazeInstance.isFinished && mazeInstance.hero && !raceWon) {
                // This hero finished first!
                mazeInstance.isFinished = true;
                mazeInstance.hasBeenWon = true;
                
                // Mark race as won for all mazes
                this.mazes.forEach(m => m.hasBeenWon = true);
                
                this.scores[mazeInstance.heroColorName]++;
                this.updateScoreboard();
                this.showWinnerText(mazeInstance.heroColorName);
                
                // Show new race button after a delay
                setTimeout(() => {
                    const newRaceBtn = document.getElementById('newRaceBtn') as HTMLButtonElement;
                    if (newRaceBtn) {
                        newRaceBtn.style.display = 'inline-block';
                    }
                }, 4000);
            }
            return;
        }

        const heroGroup = mazeInstance.heroContainer.children[0];
        if (heroGroup) {
            const newX = mazeInstance.hero.x * this.cellSize + this.cellSize / 2;
            const newY = mazeInstance.hero.y * this.cellSize + this.cellSize / 2;
            
            const startX = heroGroup.x;
            const startY = heroGroup.y;
            const duration = 120;
            const startTime = Date.now();
            
            const moveHero = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                
                heroGroup.x = startX + (newX - startX) * eased;
                heroGroup.y = startY + (newY - startY) * eased;
                
                if (progress < 1) {
                    requestAnimationFrame(moveHero);
                } else {
                    setTimeout(() => this.animateHeroStep(mazeInstance), 30);
                }
            };
            
            moveHero();
        }
    }

    private createScoreboard(): void {
        this.updateScoreboard();
    }

    private updateScoreboard(): void {
        this.scoreboardContainer.removeChildren();
        
        // Background
        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.8);
        bg.drawRoundedRect(0, 0, 250, 300, 10);
        bg.endFill();
        bg.lineStyle(2, 0x444444, 0.8);
        bg.drawRoundedRect(0, 0, 250, 300, 10);
        this.scoreboardContainer.addChild(bg);
        
        // Title
        const title = new PIXI.Text('TABLEAU DE SCORE', {
            fontSize: 18,
            fill: 0xffffff,
            fontWeight: 'bold'
        });
        title.x = 125 - title.width / 2;
        title.y = 15;
        this.scoreboardContainer.addChild(title);
        
        // Scores
        const colors = [0x4488ff, 0xff4444, 0x44ff44, 0xffff44];
        const names = ['Bleu', 'Rouge', 'Vert', 'Jaune'];
        
        names.forEach((name, index) => {
            const y = 60 + index * 50;
            
            // Color indicator
            const indicator = new PIXI.Graphics();
            indicator.beginFill(colors[index]);
            indicator.drawCircle(0, 0, 15);
            indicator.endFill();
            indicator.x = 30;
            indicator.y = y;
            this.scoreboardContainer.addChild(indicator);
            
            // Name and score
            const scoreText = new PIXI.Text(`${name}`, {
                fontSize: 16,
                fill: 0xffffff,
                fontWeight: 'bold'
            });
            scoreText.x = 55;
            scoreText.y = y - 8;
            this.scoreboardContainer.addChild(scoreText);
            
            // Score number
            const scoreNumber = new PIXI.Text(`${this.scores[name]}`, {
                fontSize: 24,
                fill: colors[index],
                fontWeight: 'bold'
            });
            scoreNumber.x = 200;
            scoreNumber.y = y - 12;
            this.scoreboardContainer.addChild(scoreNumber);
        });
    }

    private showWinnerText(winnerName: string): void {
        this.clearWinnerText();
        
        const text = "LABYRINTHE RÉSOLU !";
        const winnerText = `${winnerName.toUpperCase()} GAGNE !`;
        
        // Background
        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.4);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        this.winnerTextContainer.addChild(bg);
        
        // Main text container
        const textContainer = new PIXI.Container();
        textContainer.x = this.app.screen.width / 2;
        textContainer.y = this.app.screen.height / 2;
        
        this.winnerTextContainer.addChild(textContainer);
        
        // Animate typing effect
        this.typeText(textContainer, text, 0, -50, 0xffffff, 48, () => {
            setTimeout(() => {
                this.typeText(textContainer, winnerText, 0, 20, this.getColorByName(winnerName), 36, () => {
                    // Don't auto-clear anymore, let user start new race
                });
            }, 1000);
        });
    }

    private typeText(
        container: PIXI.Container, 
        text: string, 
        x: number, 
        y: number, 
        color: number, 
        fontSize: number, 
        callback?: () => void
    ): void {
        let currentText = "";
        let index = 0;
        
        const textObj = new PIXI.Text("", {
            fontSize: fontSize,
            fill: color,
            fontWeight: 'bold',
            stroke: {
                width: 3,
                color: 0x000000 
            }
        });
        
        textObj.anchor.set(0.5, 0.5);
        textObj.x = x;
        textObj.y = y;
        container.addChild(textObj);
        
        const typeNextChar = () => {
            if (index < text.length) {
                currentText += text[index];
                textObj.text = currentText;
                index++;
                setTimeout(typeNextChar, 100);
            } else if (callback) {
                callback();
            }
        };
        
        typeNextChar();
    }

    private getColorByName(name: string): number {
        const config = this.heroConfigs.find(c => c.name === name);
        return config ? config.color : 0xffffff;
    }

    private clearWinnerText(): void {
        this.winnerTextContainer.removeChildren();
    }

    private startAmbientEffects(): void {
        const ambientPulse = () => {
            const time = Date.now() * 0.001;
            this.app.stage.alpha = 0.95 + Math.sin(time) * 0.03;
        };
        
        this.app.ticker.add(ambientPulse);
    }
}