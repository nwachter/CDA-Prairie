import { Map } from './map';

console.log('🗺️  Test de la carte...');

// Créer une petite carte
const map = new Map(5, 5);

console.log(`✅ Carte créée ! Taille: ${map.size.maxWidth} x ${map.size.maxHeight}`);

// Ajouter quelques obstacles
map.addObstacle(1, 1);
map.addObstacle(2, 1);
map.addObstacle(3, 3);

// Afficher la carte
map.displayMap();

console.log('🎯 Test terminé !');
