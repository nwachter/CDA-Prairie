import { Kaamelott } from "./classes/Kaamelott";

const kingdom = new Kaamelott();

// place Arthur au pif (ajouter param pour décider de)
kingdom.placeArthur();
//place entrée a 10, 10
kingdom.placeLabyrinthEntrance(10,10);

// Affiche la grille
kingdom.displayGrid();

// trouve chemin le + court
const shortestPath = kingdom.findShortestPathToEntrance();


console.log(shortestPath);

