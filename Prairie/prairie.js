"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Kaamelott_1 = require("./classes/Kaamelott");
var map = new Kaamelott_1.Kaamelott();
//Param 1 : Nom du lieu, Param 2 : Nom du lieu connecté, Param 3 : Distance entre les deux lieux
map.addEdge("Kaamelott", "Village", 2);
map.addEdge("Village", "Forêt", 4);
map.addEdge("Kaamelott", "Lac", 7);
map.addEdge("Lac", "Montagne", 5);
map.addEdge("Village", "Montagne", 10);
map.addEdge("Forêt", "Montagne", 8);
map.addEdge("Forêt", "Caverne", 6);
map.addEdge("Caverne", "Montagne", 4);
map.addEdge("Caverne", "EntréeLabyrinthe", 5);
map.addEdge("Forêt", "EntréeLabyrinthe", 3);
// console.log("Map of Kaamelott:");
// for (const [name, node] of map.nodes) {
//   const neighbors = Array.from(node.neighbors.entries()).map(
//     ([neighbor, distance]) => `${neighbor.name} (${distance})`
//   );
//   console.log(`${name} -> ${neighbors.join(", ")}`);
// }
// const labyrinth = new Labyrinth(
//   [
//     [0, 1, 0, 0],
//     [0, 1, 0, 1],
//     [0, 0, 0, 0],
//     [1, 1, 1, 0],
//   ],
//   [0, 0], // Start
//   [3, 3]  // Treasure
// );
// console.log("Labyrinth grid:");
// for (const row of labyrinth.grid) {
//   console.log(row.map(cell => (cell === 0 ? '.' : '#')).join(' '));
// }
var visited = new Set([map.nodes.get("Kaamelott")]);
// console.log("----------", JSON.stringify(map.nodes.get("Kaamelott"))!)
var smallest = map.calculateSmallestDistance(map.nodes.get("Kaamelott"), visited);
//Array.from(node.neighbors.entries())
