// import { Node } from "./Node.js";
// import { initMap } from "../front/grille.js";

// class Kaamelott {
//     nodes: Record<string, Node> = {};
//     grid: Node[][] = []; // Grille de nodes
//     weightsGrid: number[][] = []; //Grille de weights
//     width: number = 40;
//     height: number = 32;
//     arthurPosition: Node | null = null;
//     labyrinthEntrance: Node | null = null;

//     constructor() {
//         this.initializeGrid(); 
//         this.placeLabyrinthEntrance(); // Place l'entrée aléatoirement
//     }

//     // Initialise la grille avec des poids aléatoires
//     initializeGrid(): void {
//         this.weightsGrid = initMap();
//         // Initializer la grille de noeuds tant que y inférieur à hauteur de
//         for (let y = 0; y < this.height; y++) {
//             this.grid[y] = [];
//             for (let x = 0; x < this.width; x++) {
//                 const weight = this.weightsGrid[y][x]; // Use weight from weightsGrid
//                 const nodeName = `${x},${y}`;
//                 const node = new Node(nodeName, x, y, weight);

//                 this.grid[y][x] = node;
//                 this.nodes[nodeName] = node;
//             }
//         }

//         // Then, connect neighbors after all nodes are created
//         for (let y = 0; y < this.height; y++) {
//             for (let x = 0; x < this.width; x++) {
//                 this.connectNeighbors(x, y);
//             }
//         }
//     }

//     // Connecte un node avec ses voisins adjacents
//     connectNeighbors(x: number, y: number): void {
//         const currentNode = this.grid[y][x];
//         const directions = [
//             { dx: 0, dy: -1 }, // haut
//             { dx: 0, dy: 1 },  // bas
//             { dx: -1, dy: 0 }, // gauche
//             { dx: 1, dy: 0 }   // droite
//         ];

//         directions.forEach(dir => {
//             const newX = x + dir.dx;
//             const newY = y + dir.dy;

//             if (this.isValidPosition(newX, newY)) {
//                 const neighborNode = this.grid[newY][newX];
//                 // La distance est le poids du node de destination
//                 currentNode.addNeighbor(neighborNode, neighborNode.weight);
//             }
//         });
//     }

//     // Vérifie si une position est valide dans la grille
//     isValidPosition(x: number, y: number): boolean {
//         return x >= 0 && x < this.width && y >= 0 && y < this.height;
//     }

//     // Place Arthur à une position aléatoire (sauf sur l'entrée du labyrinthe)
//     placeLabyrinthEntrance(x: number | null = null, y: number | null = null): void {
//         let entranceX: number, entranceY: number;

//         if (x !== null && y !== null && this.isValidPosition(x, y)) {
//             // Utilise les coordonnées fournies si elles sont valides
//             entranceX = x;
//             entranceY = y;
//             console.log(`Entrée laby placée aux coords :  (${x}, ${y})`);
//         } else {
//             // Place aléatoirement si pas de coordonnées ou coordonnées invalides
//             entranceX = Math.floor(Math.random() * this.width);
//             entranceY = Math.floor(Math.random() * this.height);
//             console.log(`Entrée laby placée aux coords :  (${entranceX}, ${entranceY})`);
//         }

//         this.labyrinthEntrance = this.grid[entranceY][entranceX];
//         this.labyrinthEntrance.weight = 1; // L'entrée a toujours un poids de 1
//         this.labyrinthEntrance.name = "Entrance";
//     }

//     // Affiche la grille avec les poids de chaque case
//     displayGrid(): void {
//         console.log("Grille avec difficultés de terrain:");
//         console.log("E = Entrée, A = Arthur, Numbers =  Difficulté terrain (poids)");
//         console.log("");

//         for (let y = 0; y < this.height; y++) {
//             let row = "";
//             for (let x = 0; x < this.width; x++) {
//                 const node = this.grid[y][x];
//                 let displayChar: string;

//                 if (node === this.labyrinthEntrance) {
//                     displayChar = "E"; // Entrée du labyrinthe
//                 } else if (this.arthurPosition && node === this.arthurPosition) {
//                     displayChar = "A"; // Position d'Arthur
//                 } else {
//                     displayChar = node.weight.toString();
//                 }

//                 row += displayChar.padStart(2, " ") + " ";
//             }
//             console.log(row);
//         }
//     }

//     placeArthur(x: number | null = null, y: number | null = null): Node {
//         let arthurX: number, arthurY: number;

//         if (x !== null && y !== null && this.isValidPosition(x, y)) {
//             // Vérifie que la position n'est pas sur l'entrée du labyrinthe
//             if (this.grid[y][x] === this.labyrinthEntrance) {
//                 console.log(`Il est impossible de placer Arthur à  (${x}, ${y}) - la position est occupée par l'entrée du labyrinthe.`);
//                 console.log("Placement aléatoire d'Arthur à la place...");
//                 // Place aléatoirement si la position spécifiée est l'entrée
//                 do {
//                     arthurX = Math.floor(Math.random() * this.width);
//                     arthurY = Math.floor(Math.random() * this.height);
//                 } while (this.grid[arthurY][arthurX] === this.labyrinthEntrance);
//             } else {
//                 // Utilise les coordonnées fournies
//                 arthurX = x;
//                 arthurY = y;
//                 console.log(`Arthur placed at specified position (${x}, ${y})`);
//             }
//         } else {
//             // Place aléatoirement si pas de coordonnées ou coordonnées invalides
//             do {
//                 arthurX = Math.floor(Math.random() * this.width);
//                 arthurY = Math.floor(Math.random() * this.height);
//             } while (this.grid[arthurY][arthurX] === this.labyrinthEntrance);
//             console.log(`Arthur placed at random position (${arthurX}, ${arthurY})`);
//         }

//         this.arthurPosition = this.grid[arthurY][arthurX];
//         console.log(`Arthur positioned with terrain weight ${this.arthurPosition.weight}`);

//         return this.arthurPosition;
//     }

//     // Trouve le chemin le plus court entre Arthur et l'entrée du labyrinthe
//     // Utilise l'algorithme de Dijkstra
//     findShortestPathToEntrance(): Node[] {
//         if (!this.arthurPosition || !this.labyrinthEntrance) {
//             console.log("Arthur ou entrée labyrinthe  non trouvés !");
//             return [];
//         }

//         // Objet pour stocker les distances minimales depuis Arthur
//         const distances: Record<string, number> = {};
//         // Objet pour reconstruire le chemin
//         const previous: Record<string, Node | null> = {};
//         // Array des nodes non visités
//         const unvisited: Node[] = [];

//         // Initialise toutes les distances à l'infini sauf Arthur (0)
//         for (const nodeName in this.nodes) {
//             const node = this.nodes[nodeName];
//             distances[nodeName] = node === this.arthurPosition ? 0 : Infinity;
//             previous[nodeName] = null;
//             unvisited.push(node);
//         }

//         // Boucle principale de Dijkstra permettant de trouver le chemin le plus court
//         while (unvisited.length > 0) {
//             // Trouve le node non visité avec la distance minimale
//             let currentNode: Node | null = null;
//             let minDistance: number = Infinity;
//             let currentNodeIndex = -1;

//             // Parcourt les nodes non visités pour trouver celui avec la distance minimale  
//             for (let i = 0; i < unvisited.length; i++) {
//                 const node = unvisited[i];
//                 const distance = distances[node.name];
//                 if (distance < minDistance) {
//                     minDistance = distance;
//                     currentNode = node;
//                     currentNodeIndex = i;
//                 }
//             }

//             if (!currentNode || minDistance === Infinity) {
//                 break; // Pas de chemin possible
//             }

//             // Retire le noeud courant des non visités
//             unvisited.splice(currentNodeIndex, 1);

//             // Si on a atteint l'entrée, on s'arrête
//             if (currentNode === this.labyrinthEntrance) {
//                 break;
//             }

//             // Met à jour les distances des voisins
//             for (const neighborName in currentNode.neighbors) {
//                 const neighborInfo = currentNode.neighbors[neighborName];
//                 const neighbor = neighborInfo.node;
//                 const edgeWeight = neighborInfo.distance;
                
//                 // Vérifie si le voisin est dans les non visités
//                 const neighborIndex = unvisited.findIndex(n => n === neighbor);
//                 if (neighborIndex !== -1) {
//                     const newDistance = distances[currentNode.name] + edgeWeight;
//                     if (newDistance < distances[neighbor.name]) {
//                         distances[neighbor.name] = newDistance;
//                         previous[neighbor.name] = currentNode;
//                     }
//                 }
//             }
//         }

//         // Reconstruit le chemin depuis l'entrée vers Arthur
//         const path: Node[] = [];
//         let current: Node | null = this.labyrinthEntrance;

//         while (current !== null) {
//             path.unshift(current); // Ajoute au début pour avoir le bon ordre
//             current = previous[current.name];
//         }

//         // Vérifie si un chemin a été trouvé
//         if (path.length === 0 || path[0] !== this.arthurPosition) {
//             console.log("Aucun chemin trouvé entre Arthur et l'entrée!");
//             return [];
//         }

//         const totalDistance = distances[this.labyrinthEntrance.name];
//         console.log(`Chemin le + court trouvé ! Distance totale :${totalDistance}`);
//         console.log(`Longueur chemin: ${path.length} noeuds`);

//         return path;
//     }

//     displayPath(path: Node[]): void {
//         if (path.length === 0) {
//             console.log("Pas de chemin a aficher");
//             return;
//         }

//         console.log("Path from Arthur to Entrance:");
//         path.forEach((node, index) => {
//             const prefix = index === 0 ? "DEBUT" :
//                 index === path.length - 1 ? "FIN" :
//                     `ETAPE ${index}`;
//             console.log(`${prefix}: ${node.getCoordinates()} (poids: ${node.weight})`);
//         });
//     }

//     // _______________________Méthodes inutiles (phase graphe)
//     addNode(name: string): Node {
//         if (!this.nodes[name]) {
//             this.nodes[name] = new Node(name);
//         }
//         return this.nodes[name];
//     }

//     addEdge(a: string, b: string, distance: number): void {
//         const nodeA = this.addNode(a);
//         const nodeB = this.addNode(b);
//         nodeA.addNeighbor(nodeB, distance);
//         nodeB.addNeighbor(nodeA, distance);
//     }

//     toString(): string {
//         let result = "";
//         for (const name in this.nodes) {
//             const node = this.nodes[name];
//             const neighbors = Object.values(node.neighbors).map(
//                 (info) => `${info.node.name} (${info.distance})`
//             );
//             result += `${name} -> ${neighbors.join(", ")}\n`;
//         }
//         return result;
//     }

//     toStringNode(nodeName: string): string {
//         const node = this.nodes[nodeName];
//         if (!node) return `${nodeName} not found in the graph.`;
//         const neighbors = Object.values(node.neighbors).map(
//             (info) => `${info.node.name} (${info.distance})`
//         );
//         return `${nodeName} -> ${neighbors.join(", ")}`;
//     }
// }

// export { Kaamelott };

import { Node } from "./Node.js";

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
        // Initialize with default weights if initMap is not available
        for (let y = 0; y < this.height; y++) {
            this.weightsGrid[y] = [];
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Default weight of 1 if no map data
                const weight = 1; 
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
        this.labyrinthEntrance.weight = 1;
        this.labyrinthEntrance.name = "Entrance";
        
        console.log(`Entrée laby placée aux coords: (${entranceX}, ${entranceY})`);
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
    }

    // Méthodes utilitaires pour le débogage
    getNodeAt(x: number, y: number): Node | null {
        if (this.isValidPosition(x, y)) {
            return this.grid[y][x];
        }
        return null;
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