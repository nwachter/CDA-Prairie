import {Node} from "./Node";

// export interface nouvelleInstance{
//     position : { x: number, y : number }
// }

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

class Kaamelott { //Kingdom
  nodes: Map<string, Node> = new Map(); //string : nom du lieu, Node : le noeud

  //Ajoute un noeud s'il n'existe pas déjà
  addNode(name: string): Node {
    if (!this.nodes.has(name)) {
      this.nodes.set(name, new Node(name));
    }
    return this.nodes.get(name)!;
  }

  //Ajoute une "arête" entre deux noeuds avec une distance
  //Chaque noeud représente un lieu (Kaamelott, Village, Forêt…). Un noeud doit savoir à quels autres noeuds il est connecté, et à quelle distance.
  addEdge(a: string, b: string, distance: number) {
    const nodeA = this.addNode(a);
    const nodeB = this.addNode(b);
    nodeA.addNeighbor(nodeB, distance);
    nodeB.addNeighbor(nodeA, distance); // undirected graph
  }

}

export  {Kaamelott};