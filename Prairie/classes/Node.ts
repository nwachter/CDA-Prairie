class Node {
  value: string;
  neighbors: Map<Node, number>;

  constructor(value: string) {
    this.value = value;
    this.neighbors = new Map();
  }

  addNeighbor(node: Node, distance: number) {
    this.neighbors.set(node, distance);
  }
}
export { Node };