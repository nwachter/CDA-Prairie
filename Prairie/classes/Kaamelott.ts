import { Node } from "./Node";

export interface nouvelleInstance{
    position : { x: number, y : number }
}

// class Kaamelott {
//     public id : string;
//     public size : { maxWidth: number; maxHeight: number }

//     public cell: Cell<{x: number, y: number}>[][]
//     public nouvellePosition: nouvelleInstance[]

//     constructor(maxWidth: number, maxHeight: number) {
//         this.size = { maxWidth, maxHeight }
//         this.cell = this.initializeGrid(maxWidth, maxHeight);
//         this.nouvellePosition = [];
//     }

//     private initializeGrid(maxWidth: number, maxHeight: number): Cell<{x: number, y : number}> {
        
//     }
// }

class Kingdom {
  nodes: Map<string, Node> = new Map(); //string is the name of the location, Node is the location object

  addNode(name: string): Node {
    if (!this.nodes.has(name)) {
      this.nodes.set(name, new Node(name));
    }
    return this.nodes.get(name)!;
  }

  addEdge(a: string, b: string, distance: number) {
    const nodeA = this.addNode(a);
    const nodeB = this.addNode(b);
    nodeA.addNeighbor(nodeB, distance);
    nodeB.addNeighbor(nodeA, distance); // undirected graph
  }

}