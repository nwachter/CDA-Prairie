

class Node {
    name: string;
    neighbors: Record<string, {node: Node, distance: number}> = {};
    x: number; // Coordonnée x dans la grille
    y: number; // Coordonnée y dans la grille
    weight: number; // Poids du terrain (difficulté)

    constructor(name: string, x: number = 0, y: number = 0, weight: number = 1) {
        this.name = name;
        this.neighbors = {};
        this.x = x;
        this.y = y;
        this.weight = weight;
    }

    addNeighbor(node: Node, distance: number): void {
        this.neighbors[node.name] = {node, distance};
    }

    // Méthode pour obtenir les coordonnées sous forme de string
    getCoordinates(): string {
        return `(${this.x},${this.y})`;
    }

        toString(): string {
        return `${this.name} [${this.x},${this.y}] weight:${this.weight}`;
    }
}

export { Node };