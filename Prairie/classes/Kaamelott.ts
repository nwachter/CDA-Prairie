import {Node} from "./Node";

class Kaamelott { //Kingdom
  nodes: Map<string, Node> = new Map(); //nodes: Map<string, Node> // string : nom du lieu, Node : le noeud

  constructor() {}

  //Ajoute un noeud s'il n'existe pas déjà
  addNode(name): Node { //name: string
    if (!this.nodes.has(name)) {
      this.nodes.set(name, new Node(name));
    }
    return this.nodes.get(name)!;
  }

  //Ajoute une "arête" entre deux noeuds avec une distance
  //Chaque noeud représente un lieu (Kaamelott, Village, Forêt…). Un noeud doit savoir à quels autres noeuds il est connecté, et à quelle distance.
  addEdge(a: string, b: string, distance: number) { //a: string, b: string, distance: number
    const nodeA = this.addNode(a);
    const nodeB = this.addNode(b);
    nodeA.addNeighbor(nodeB, distance);
    nodeB.addNeighbor(nodeA, distance); // undirected graph
  }

  toString(): string {
    let result = "";
    for (const [name, node] of this.nodes) {
      const neighbors = Array.from(node.neighbors.entries()).map(
        ([neighbor, distance]) => `${neighbor.name} (${distance})`
      );
      result += `${name} -> ${neighbors.join(", ")}\n`;
    }
    return result;
  }

  toStringNode(nodeName: string): string {
    const node = this.nodes.get(nodeName);
    if (!node) return `${nodeName} not found in the graph.`;
    const neighbors = Array.from(node.neighbors.entries()).map(
      ([neighbor, distance]) => `${neighbor.name} (${distance})`
    );
    return `${nodeName} -> ${neighbors.join(", ")}`;
  }


calculateSmallestDistance(firstNode: Node, visitedNodes: Set<Node>): Map<string, number> {
  // distances : stocke la plus petite distance connue depuis firstNode jusqu’à chaque autre nœud
  let distances: Map<string, number> = new Map();

  // Étape 1 : Initialiser toutes les distances à l’infini
  for (let [name] of this.nodes) {
    distances.set(name, Infinity);
  }

  // La distance du nœud de départ à lui-même est toujours 0
  distances.set(firstNode.name, 0);

  // On commence par le nœud de départ
  let currentNode = firstNode;

  // Étape 2 : Traiter les nœuds tant qu’il en reste de non visités (ou aucun nœud accessible)
  while (visitedNodes.size < this.nodes.size) {
    // Étape 3 : Pour chaque voisin du nœud courant,
    // mettre à jour sa distance si on trouve un chemin plus court
    for (let [neighbor, distance] of currentNode.neighbors.entries()) {
      if (!visitedNodes.has(neighbor)) {
        const newDistance = distances.get(currentNode.name)! + distance;
        if (newDistance < distances.get(neighbor.name)!) {
          distances.set(neighbor.name, newDistance);
        }
      }
    }

    // On marque le nœud courant comme visité
    visitedNodes.add(currentNode);

    // Étape 4 : Trouver le nœud non visité avec la plus petite distance
    let nextNode: Node | null = null;
    let smallestDistance = Infinity;

    for (let [name, distance] of distances) {
      const node = this.nodes.get(name);
      if (node && !visitedNodes.has(node)) {
        if (distance < smallestDistance) {
          smallestDistance = distance;
          nextNode = node;
        }
      }
    }

    // Si aucun nœud accessible n’est trouvé, on arrête
    if (!nextNode) break;

    // On passe au nœud le plus proche
    currentNode = nextNode;
  }

  // On retourne la map contenant les plus petites distances depuis firstNode
  return distances;
}



}

export  {Kaamelott};