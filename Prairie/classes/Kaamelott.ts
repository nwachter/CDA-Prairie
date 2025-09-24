import { Node } from "./Node";
class Kaamelott {
    nodes = new Map();
    grid = []; // Grille 2D de nodes
    width = 10;
    height = 10;
    arthurPosition = null;
    labyrinthEntrance = null;

    constructor() {
        this.initializeGrid();
        this.placeLabyrinthEntrance(); // Place l'entrée aléatoirement
    }

   
    // Initialise la grille avec des poids aléatoires
initializeGrid() {
    // First, create all nodes
    for (let y = 0; y < this.height; y++) {
        this.grid[y] = [];
        for (let x = 0; x < this.width; x++) {
            // Génère un poids aléatoire entre 1 et 10
            const weight = Math.floor(Math.random() * 10) + 1;
            const nodeName = `${x},${y}`;
            const node = new Node(nodeName, x, y, weight);

            this.grid[y][x] = node;
            this.nodes.set(nodeName, node);
        }
    }

    // Then, connect neighbors after all nodes are created
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            this.connectNeighbors(x, y);
        }
    }
}

// Connecte un node avec ses voisins adjacents
connectNeighbors(x, y) {
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
 

    // Vérifie si une position est valide dans la grille
    isValidPosition(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    // Place Arthur à une position aléatoire (sauf sur l'entrée du labyrinthe)
    placeLabyrinthEntrance(x = null, y = null) {
        let entranceX, entranceY;

        if (x !== null && y !== null && this.isValidPosition(x, y)) {
            // Utilise les coordonnées fournies si elles sont valides
            entranceX = x;
            entranceY = y;
            console.log(`Entrée laby placée aux coords :  (${x}, ${y})`);
        } else {
            // Place aléatoirement si pas de coordonnées ou coordonnées invalides
            entranceX = Math.floor(Math.random() * this.width);
            entranceY = Math.floor(Math.random() * this.height);
            console.log(`Entrée laby placée aux coords :  (${entranceX}, ${entranceY})`);
        }

        this.labyrinthEntrance = this.grid[entranceY][entranceX];
        this.labyrinthEntrance.weight = 1; // L'entrée a toujours un poids de 1
        this.labyrinthEntrance.name = "Entrance";
    }
    // Affiche la grille avec les poids de chaque case
    displayGrid() {
        console.log("Grille avec difficultés de terrain:");
        console.log("E = Entrée, A = Arthur, Numbers =  Difficulté terrain (poids)");
        console.log("");

        for (let y = 0; y < this.height; y++) {
            let row = "";
            for (let x = 0; x < this.width; x++) {
                const node = this.grid[y][x];
                let displayChar;

                if (node === this.labyrinthEntrance) {
                    displayChar = "E"; // Entrée du labyrinthe
                } else if (this.arthurPosition && node === this.arthurPosition) {
                    displayChar = "A"; // Position d'Arthur
                } else {
                    displayChar = node.weight.toString();
                }

                row += displayChar.padStart(2, " ") + " ";
            }
            console.log(row);
        }
    }

    placeArthur(x = null, y = null) {
        let arthurX, arthurY;

        if (x !== null && y !== null && this.isValidPosition(x, y)) {
            // Vérifie que la position n'est pas sur l'entrée du labyrinthe
            if (this.grid[y][x] === this.labyrinthEntrance) {
                console.log(`Il est impossible de placer Arthur à  (${x}, ${y}) - la position est occupée par l'entrée du labyrinthe.`);
                console.log("Placement aléatoire d'Arthur à l place...");
                // Place aléatoirement si la position spécifiée est l'entrée
                do {
                    arthurX = Math.floor(Math.random() * this.width);
                    arthurY = Math.floor(Math.random() * this.height);
                } while (this.grid[arthurY][arthurX] === this.labyrinthEntrance);
            } else {
                // Utilise les coordonnées fournies
                arthurX = x;
                arthurY = y;
                console.log(`Arthur placed at specified position (${x}, ${y})`);
            }
        } else {
            // Place aléatoirement si pas de coordonnées ou coordonnées invalides
            do {
                arthurX = Math.floor(Math.random() * this.width);
                arthurY = Math.floor(Math.random() * this.height);
            } while (this.grid[arthurY][arthurX] === this.labyrinthEntrance);
            console.log(`Arthur placed at random position (${arthurX}, ${arthurY})`);
        }

        this.arthurPosition = this.grid[arthurY][arthurX];
        console.log(`Arthur positioned with terrain weight ${this.arthurPosition.weight}`);

        return this.arthurPosition;
    }

    // Trouve le chemin le plus court entre Arthur et l'entrée du labyrinthe
    // Utilise l'algorithme de Dijkstra
    findShortestPathToEntrance() {
        if (!this.arthurPosition || !this.labyrinthEntrance) {
            console.log("Arthur ou entrée labyrinthe  non trouvés !");
            return [];
        }

        // Map pour stocker les distances minimales depuis Arthur
        const distances = new Map();
        // Map pour reconstruire le chemin
        const previous = new Map();
        // Set des nodes non visités
        const unvisited = new Set();

        // Initialise toutes les distances à l'infini sauf Arthur (0)
        for (const [_, node] of this.nodes) {
            distances.set(node, node === this.arthurPosition ? 0 : Infinity);
            previous.set(node, null);
            unvisited.add(node);
        }

        // Boucle principale de Dijkstra permettant de trouver le chemin le plus court
        while (unvisited.size > 0) {
            // Trouve le node non visité avec la distance minimale
            let currentNode = null;
            let minDistance = Infinity;

            // Parcourt les nodes non visités pour trouver celui avec la distance minimale  
            for (const node of unvisited) {
                const distance = distances.get(node);
                if (distance < minDistance) {
                    minDistance = distance;
                    currentNode = node;
                }
            }

            if (!currentNode || minDistance === Infinity) {
                break; // Pas de chemin possible
            }

            unvisited.delete(currentNode);

            // Si on a atteint l'entrée, on s'arrête
            if (currentNode === this.labyrinthEntrance) {
                break;
            }

            // Met à jour les distances des voisins
            for (const [neighbor, edgeWeight] of currentNode.neighbors) {
                if (unvisited.has(neighbor)) {
                    const newDistance = distances.get(currentNode) + edgeWeight;
                    if (newDistance < distances.get(neighbor)) {
                        distances.set(neighbor, newDistance);
                        previous.set(neighbor, currentNode);
                    }
                }
            }
        }

        // Reconstruit le chemin depuis l'entrée vers Arthur
        const path = [];
        let current = this.labyrinthEntrance;

        while (current !== null) {
            path.unshift(current); // Ajoute au début pour avoir le bon ordre
            current = previous.get(current);
        }

        // Vérifie si un chemin a été trouvé
        if (path.length === 0 || path[0] !== this.arthurPosition) {
            console.log("Aucun chemin trouvé entre Arthur et l'entrée!");
            return [];
        }

        const totalDistance = distances.get(this.labyrinthEntrance);
        console.log(`Chemin le + court trouvé ! Distance totale :${totalDistance}`);
        console.log(`Longueur chemin: ${path.length} noeuds`);

        return path;
    }

    displayPath(path) {
        if (path.length === 0) {
            console.log("Pas de chemin a aficher");
            return;
        }

        console.log("Path from Arthur to Entrance:");
        path.forEach((node, index) => {
            const prefix = index === 0 ? "DEBUT" :
                index === path.length - 1 ? "FIN" :
                    `ETAPE ${index}`;
            console.log(`${prefix}: ${node.getCoordinates()} (poids: ${node.weight})`);
        });
    }

    // _______________________Méthodes inutiles (phase graphe)
    addNode(name) {
        if (!this.nodes.has(name)) {
            this.nodes.set(name, new Node(name));
        }
        return this.nodes.get(name);
    }

    addEdge(a, b, distance) {
        const nodeA = this.addNode(a);
        const nodeB = this.addNode(b);
        nodeA.addNeighbor(nodeB, distance);
        nodeB.addNeighbor(nodeA, distance);
    }

    toString() {
        let result = "";
        for (const [name, node] of this.nodes) {
            const neighbors = Array.from(node.neighbors.entries()).map(
                ([neighbor, distance]) => `${neighbor.name} (${distance})`
            );
            result += `${name} -> ${neighbors.join(", ")}\n`;
        }
        return result;
    }

    toStringNode(nodeName) {
        const node = this.nodes.get(nodeName);
        if (!node) return `${nodeName} not found in the graph.`;
        const neighbors = Array.from(node.neighbors.entries()).map(
            ([neighbor, distance]) => `${neighbor.name} (${distance})`
        );
        return `${nodeName} -> ${neighbors.join(", ")}`;
    }
}

export { Kaamelott };