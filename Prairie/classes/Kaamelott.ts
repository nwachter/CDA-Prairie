import { Node } from "./Node.js";
import { map } from "../classes/grille/grille.js";

declare global {
    interface Window {
        resetHighlights: () => void;
        highlightCell: (x: number, y: number, className: string) => void;
    }
}

class Kaamelott {
    public nodes: { [key: string]: Node };
    public grid: Node[][];
    public weightsGrid: number[][];
    public width: number;
    public height: number;
    public arthurPosition: Node | null;
    public labyrinthEntrance: Node | null;

    constructor() {
        this.nodes = {};
        this.grid = [];
        this.weightsGrid = [];
        this.width = 40;
        this.height = 32;
        this.arthurPosition = null;
        this.labyrinthEntrance = null;
        this.initializeGrid();
        this.placeLabyrinthEntrance();
    }

    initializeGrid() {
        // Use the imported map data instead of default weights
        this.weightsGrid = map;
        
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Use the actual weight from the map
                const weight = this.weightsGrid[y] ? this.weightsGrid[y][x] || 1 : 1;
                const nodeName = `${x},${y}`;
                const node = new Node(nodeName, x, y, weight);
                this.grid[y][x] = node;
                this.nodes[nodeName] = node;
            }
        }

        // Connect neighbors after all nodes are created
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.connectNeighbors(x, y);
            }
        }
    }

    connectNeighbors(x: number, y: number) {
        const currentNode = this.grid[y][x];
        const directions = [
            { dx: 0, dy: -1 }, // haut
            { dx: 0, dy: 1 },  // bas
            { dx: -1, dy: 0 }, // gauche
            { dx: 1, dy: 0 }   // droite
        ];

        directions.forEach(dir => {
            const newX = x + dir.dx;
            const newY = y + dir.dy;
            if (this.isValidPosition(newX, newY)) {
                const neighborNode = this.grid[newY][newX];
                // La distance est le poids du node de destination
                currentNode.addNeighbor(neighborNode, neighborNode.weight);
            }
        });
    }

    isValidPosition(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    placeLabyrinthEntrance(x: number | null = null, y: number | null = null) {
        let entranceX, entranceY;
        
        if (x !== null && y !== null && this.isValidPosition(x, y)) {
            entranceX = x;
            entranceY = y;
        } else {
            entranceX = Math.floor(Math.random() * this.width);
            entranceY = Math.floor(Math.random() * this.height);
        }
        
        this.labyrinthEntrance = this.grid[entranceY][entranceX];
        // Keep the original weight from the map for the entrance
        // this.labyrinthEntrance.weight = 1; // Comment this out to preserve map weight
        this.labyrinthEntrance.name = "Entrance";
        
        console.log(`Entrée laby placée aux coords: (${entranceX}, ${entranceY}) avec poids ${this.labyrinthEntrance.weight}`);
    }

    displayGrid() {
        console.log("Grille avec difficultés de terrain:");
        console.log("E = Entrée, A = Arthur, Numbers = Difficulté terrain (poids)");
        console.log("");
        
        for (let y = 0; y < this.height; y++) {
            let row = "";
            for (let x = 0; x < this.width; x++) {
                const node = this.grid[y][x];
                let displayChar;
                
                if (this.labyrinthEntrance && node === this.labyrinthEntrance) {
                    displayChar = "E";
                } else if (this.arthurPosition && node === this.arthurPosition) {
                    displayChar = "A";
                } else {
                    displayChar = node.weight.toString();
                }
                row += displayChar.padStart(2, " ") + " ";
            }
            console.log(row);
        }
    }

    placeArthur(x: number | null = null, y: number | null = null): Node {
        let arthurX, arthurY;
        
        if (x !== null && y !== null && this.isValidPosition(x, y)) {
            if (this.labyrinthEntrance && this.grid[y][x] === this.labyrinthEntrance) {
                console.log(`Impossible de placer Arthur à (${x}, ${y}) - position occupée par l'entrée du labyrinthe.`);
                do {
                    arthurX = Math.floor(Math.random() * this.width);
                    arthurY = Math.floor(Math.random() * this.height);
                } while (this.labyrinthEntrance && this.grid[arthurY][arthurX] === this.labyrinthEntrance);
            } else {
                arthurX = x;
                arthurY = y;
            }
        } else {
            do {
                arthurX = Math.floor(Math.random() * this.width);
                arthurY = Math.floor(Math.random() * this.height);
            } while (this.labyrinthEntrance && this.grid[arthurY][arthurX] === this.labyrinthEntrance);
        }
        
        this.arthurPosition = this.grid[arthurY][arthurX];
        console.log(`Arthur placé à (${arthurX}, ${arthurY}) avec poids ${this.arthurPosition.weight}`);
        return this.arthurPosition;
    }

    findShortestPathToEntrance(): Node[] {
        if (!this.arthurPosition || !this.labyrinthEntrance) {
            console.log("Arthur ou entrée labyrinthe non trouvés !");
            return [];
        }

        // Objet pour stocker les distances minimales
        const distances: { [key: string]: number } = {};
        // Objet pour reconstruire le chemin
        const previous: { [key: string]: Node | null } = {};
        // File de priorité (simplifiée)
        const unvisited: Node[] = [];

        // Initialisation
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const node = this.grid[y][x];
                distances[node.name] = node === this.arthurPosition ? 0 : Infinity;
                previous[node.name] = null;
                unvisited.push(node);
            }
        }

        // Algorithme de Dijkstra
        while (unvisited.length > 0) {
            // Trouver le node avec la distance minimale
            let currentNode: Node | null = null;
            let minDistance = Infinity;
            let currentNodeIndex = -1;

            for (let i = 0; i < unvisited.length; i++) {
                const node = unvisited[i];
                if (distances[node.name] < minDistance) {
                    minDistance = distances[node.name];
                    currentNode = node;
                    currentNodeIndex = i;
                }
            }

            if (!currentNode || minDistance === Infinity) {
                break;
            }

            // Retirer le node courant
            unvisited.splice(currentNodeIndex, 1);

            // Si on a atteint la destination
            if (currentNode === this.labyrinthEntrance) {
                break;
            }

            // Mettre à jour les distances des voisins
            for (const neighborName in currentNode.neighbors) {
                const neighborInfo = currentNode.neighbors[neighborName];
                const neighbor = neighborInfo.node;
                
                // Vérifier si le voisin est encore dans unvisited
                const isInUnvisited = unvisited.some(node => node === neighbor);
                if (isInUnvisited) {
                    const newDistance = distances[currentNode.name] + neighborInfo.distance;
                    if (newDistance < distances[neighbor.name]) {
                        distances[neighbor.name] = newDistance;
                        previous[neighbor.name] = currentNode;
                    }
                }
            }
        }

        // Reconstruire le chemin
        const path: Node[] = [];
        let current: Node | null = this.labyrinthEntrance;

        while (current !== null) {
            path.unshift(current);
            current = previous[current.name] || null;
        }

        // Vérifier si le chemin est valide
        if (path.length === 0 || path[0] !== this.arthurPosition) {
            console.log("Aucun chemin trouvé entre Arthur et l'entrée!");
            return [];
        }

        const totalDistance = distances[this.labyrinthEntrance.name];
        console.log(`Chemin le plus court trouvé! Distance totale: ${totalDistance}`);
        console.log(`Longueur du chemin: ${path.length} noeuds`);
        
        return path;
    }

    // New method that accepts parameters for arthur position, entry position, and custom map
    findShortestPathBetweenPoints(arthurPosition: [number, number], entryPosition: [number, number], customMap: number[][]): Node[] {
        // Validate positions
        const [arthurX, arthurY] = arthurPosition;
        const [entryX, entryY] = entryPosition;
        
        const mapHeight = customMap.length;
        const mapWidth = customMap[0]?.length || 0;
        
        if (arthurX < 0 || arthurX >= mapWidth || arthurY < 0 || arthurY >= mapHeight) {
            console.log(`Position d'Arthur invalide: (${arthurX}, ${arthurY})`);
            return [];
        }
        
        if (entryX < 0 || entryX >= mapWidth || entryY < 0 || entryY >= mapHeight) {
            console.log(`Position d'entrée invalide: (${entryX}, ${entryY})`);
            return [];
        }

        // Create temporary grid with custom map
        const tempGrid: Node[][] = [];
        const tempNodes: { [key: string]: Node } = {};
        
        // Initialize temporary grid with custom map weights
        for (let y = 0; y < mapHeight; y++) {
            tempGrid[y] = [];
            for (let x = 0; x < mapWidth; x++) {
                const weight = customMap[y][x] || 1;
                const nodeName = `${x},${y}`;
                const node = new Node(nodeName, x, y, weight);
                tempGrid[y][x] = node;
                tempNodes[nodeName] = node;
            }
        }

        // Connect neighbors in temporary grid
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                this.connectNeighborsForGrid(tempGrid, x, y, mapWidth, mapHeight);
            }
        }

        // Get start and end nodes
        const startNode = tempGrid[arthurY][arthurX];
        const endNode = tempGrid[entryY][entryX];

        // Dijkstra algorithm implementation
        const distances: { [key: string]: number } = {};
        const previous: { [key: string]: Node | null } = {};
        const unvisited: Node[] = [];

        // Initialize distances
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                const node = tempGrid[y][x];
                distances[node.name] = node === startNode ? 0 : Infinity;
                previous[node.name] = null;
                unvisited.push(node);
            }
        }

        // Main Dijkstra loop
        while (unvisited.length > 0) {
            // Find unvisited node with minimum distance
            let currentNode: Node | null = null;
            let minDistance = Infinity;
            let currentNodeIndex = -1;

            for (let i = 0; i < unvisited.length; i++) {
                const node = unvisited[i];
                if (distances[node.name] < minDistance) {
                    minDistance = distances[node.name];
                    currentNode = node;
                    currentNodeIndex = i;
                }
            }

            if (!currentNode || minDistance === Infinity) {
                break;
            }

            // Remove current node from unvisited
            unvisited.splice(currentNodeIndex, 1);

            // If we reached the destination
            if (currentNode === endNode) {
                break;
            }

            // Update distances of neighbors
            for (const neighborName in currentNode.neighbors) {
                const neighborInfo = currentNode.neighbors[neighborName];
                const neighbor = neighborInfo.node;
                
                // Check if neighbor is still unvisited
                const isInUnvisited = unvisited.some(node => node === neighbor);
                if (isInUnvisited) {
                    const newDistance = distances[currentNode.name] + neighborInfo.distance;
                    if (newDistance < distances[neighbor.name]) {
                        distances[neighbor.name] = newDistance;
                        previous[neighbor.name] = currentNode;
                    }
                }
            }
        }

        // Reconstruct path
        const path: Node[] = [];
        let current: Node | null = endNode;

        while (current !== null) {
            path.unshift(current);
            current = previous[current.name] || null;
        }

        // Validate path
        if (path.length === 0 || path[0] !== startNode) {
            console.log(`Aucun chemin trouvé entre (${arthurX}, ${arthurY}) et (${entryX}, ${entryY})!`);
            return [];
        }

        const totalDistance = distances[endNode.name];
        console.log(`Chemin le plus court trouvé entre (${arthurX}, ${arthurY}) et (${entryX}, ${entryY})!`);
        console.log(`Distance totale: ${totalDistance}`);
        console.log(`Longueur du chemin: ${path.length} noeuds`);
        
        return path;
    }

    // Helper method to connect neighbors for any grid
    private connectNeighborsForGrid(grid: Node[][], x: number, y: number, width: number, height: number) {
        const currentNode = grid[y][x];
        const directions = [
            { dx: 0, dy: -1 }, // haut
            { dx: 0, dy: 1 },  // bas
            { dx: -1, dy: 0 }, // gauche
            { dx: 1, dy: 0 }   // droite
        ];

        directions.forEach(dir => {
            const newX = x + dir.dx;
            const newY = y + dir.dy;
            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                const neighborNode = grid[newY][newX];
                // La distance est le poids du node de destination
                currentNode.addNeighbor(neighborNode, neighborNode.weight);
            }
        });
    }

    displayPath(path: Node[]) {
        if (path.length === 0) {
            console.log("Pas de chemin à afficher");
            return;
        }

        console.log("Chemin d'Arthur à l'Entrée:");
        path.forEach((node, index) => {
            const prefix = index === 0 ? "DÉBUT" :
                index === path.length - 1 ? "FIN" :
                    `ÉTAPE ${index}`;
            console.log(`${prefix}: ${node.getCoordinates()} (poids: ${node.weight})`);
        });

        const path3 = this.findShortestPathBetweenPoints([29, 10], [0, 6], map);
            console.log("FindShortestPathBetweenPoints", path3);

    }

    // Method to update the grid when the map changes
    updateGridFromMap() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y] && this.grid[y][x]) {
                    const newWeight = map[y] ? map[y][x] || 1 : 1;
                    this.grid[y][x].weight = newWeight;
                    
                    // Update neighbor distances since they depend on destination weight
                    this.updateNeighborDistances(x, y);
                }
            }
        }
        this.weightsGrid = map;
    }

    // Helper method to update neighbor distances for a specific node
    private updateNeighborDistances(x: number, y: number) {
        const currentNode = this.grid[y][x];
        
        // Clear existing neighbors and reconnect with updated weights
        currentNode.neighbors = {};
        this.connectNeighbors(x, y);
    }

    // Method to get current map data
    getMapData(): number[][] {
        return this.weightsGrid;
    }

    // Méthodes utilitaires pour le débogage
    getNodeAt(x: number, y: number): Node | null {
        if (this.isValidPosition(x, y)) {
            return this.grid[y][x];
        }
        return null;
    }

    // Method to highlight path on the visual map (if you want to integrate with UI)
    highlightPath(path: Node[]) {
        // This would work with the grille.ts highlighting functions
        // First reset all highlights
        if (typeof window !== 'undefined' && window.resetHighlights) {
            window.resetHighlights();
        }
        
        // Highlight the path
        path.forEach((node, index) => {
            if (typeof window !== 'undefined' && window.highlightCell) {
                let className = 'path';
                if (index === 0) className = 'arthur';
                else if (index === path.length - 1) className = 'entrance';
                
                window.highlightCell(node.x, node.y, className);
            }
        });
    }

    // Méthodes existantes (conservées pour compatibilité)
    addNode(name: string): Node {
        if (!this.nodes[name]) {
            // Créer un node avec des coordonnées par défaut
            this.nodes[name] = new Node(name, 0, 0, 1);
        }
        return this.nodes[name];
    }

    addEdge(a: string, b: string, distance: number) {
        const nodeA = this.addNode(a);
        const nodeB = this.addNode(b);
        nodeA.addNeighbor(nodeB, distance);
        nodeB.addNeighbor(nodeA, distance);
    }

    toString(): string {
        let result = "";
        for (const name in this.nodes) {
            const node = this.nodes[name];
            const neighbors = Object.values(node.neighbors).map((info) => `${info.node.name} (${info.distance})`);
            result += `${name} -> ${neighbors.join(", ")}\n`;
        }
        return result;
    }

    toStringNode(nodeName: string): string {
        const node = this.nodes[nodeName];
        if (!node) return `${nodeName} non trouvé dans le graphe.`;
        const neighbors = Object.values(node.neighbors).map((info) => `${info.node.name} (${info.distance})`);
        return `${nodeName} -> ${neighbors.join(", ")}`;
    }
}

export { Kaamelott };