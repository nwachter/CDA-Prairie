"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = require("./map");
console.log('🗺️  Test de la carte...');
// Créer une petite carte
var map = new map_1.Map(5, 5);
console.log("\u2705 Carte cr\u00E9\u00E9e ! Taille: ".concat(map.size.maxWidth, " x ").concat(map.size.maxHeight));
// Ajouter quelques obstacles
map.addObstacle(1, 1);
map.addObstacle(2, 1);
map.addObstacle(3, 3);
// Afficher la carte
map.displayMap();
console.log('🎯 Test terminé !');
