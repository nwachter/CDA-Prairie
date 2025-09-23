class Node {
  name: string;
  neighbors: Map<Node, number>;

  constructor(name: string) {
    this.name = name;
    this.neighbors = new Map();
  }

  addNeighbor(node: Node, distance: number) {
    this.neighbors.set(node, distance);
  }
}
export {Node} ;