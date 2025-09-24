// class Node {
//     name: string;
//     neighbors: Map<Node, number>;
//     x: number; // Coordonnée x dans la grille
//     y: number; // Coordonnée y dans la grille
//     weight: number; // Poids du terrain (difficulté)

//     constructor(name: string, x: number = 0, y: number = 0, weight: number = 1) {
//         this.name = name;
//         this.neighbors = new Map();
//         this.x = x;
//         this.y = y;
//         this.weight = weight;
//     }

//     addNeighbor(node: Node, distance: number) {
//         this.neighbors.set(node, distance);
//     }

//     getCoordinates(): string {
//         return `(${this.x},${this.y})`;
//     }
// }

// export { Node };

class Node {
    name;
    neighbors = new Map();
    x; // Coordonnée x dans la grille
    y; // Coordonnée y dans la grille
    weight; // Poids du terrain (difficulté)

    constructor(name, x = 0, y = 0, weight = 1) {
        this.name = name;
        this.neighbors = new Map();
        this.x = x;
        this.y = y;
        this.weight = weight;
    }


    addNeighbor(node, distance) {
        this.neighbors.set(node, distance);
    }

    // Méthode pour obtenir les coordonnées sous forme de string
    getCoordinates() {
        return `(${this.x},${this.y})`;
    }
}

export { Node };