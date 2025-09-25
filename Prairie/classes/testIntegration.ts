import { Maze } from "./MazeGenerator";
import { dijkstra } from "./DijkstraPathfinder";
import { Person } from "./Person";

const maze = new Maze(30,30);
maze.print();

const path = dijkstra(maze);
if (!path) { console.log("❌ Aucun chemin"); process.exit(0); }

const hero = new Person(...maze.start);
hero.setPath(path);

const timer = setInterval(() => {
  if (!hero.step()) { clearInterval(timer); console.log("🎉 arrivé !"); return; }
  console.log(`➡️  ${hero.x},${hero.y}`);
}, 50);
