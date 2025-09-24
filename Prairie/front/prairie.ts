// // const arthur = document.querySelector("#arthur");
// // const carte = document.querySelector("#carte");
// // const labyrinthe = document.querySelector("#labyrinthe");
// // const camelot = document.querySelector("#camelot");

// // // la grille fait 20 / 20 dont le 0
// // const nbrColumn = 20;
// // const nbrRow = 20;
// // const largeurCarte = carte.clientWidth;
// // const hauteurCarte = carte.clientHeight;

// // function arthurPosition(x, y) {
// //   const arthurX = (largeurCarte / nbrColumn) * x;
// //   const arthurY = (hauteurCarte / nbrRow) * y;
// //   arthur.style.left = arthurX + "px";
// //   arthur.style.top = arthurY + "px";
// // }

// // function labyrinthePosition(x, y) {
// //   const labyrintheX = (largeurCarte / nbrColumn) * x;
// //   const labyrintheY = (hauteurCarte / nbrRow) * y;
// //   labyrinthe.style.left = labyrintheX + "px";
// //   labyrinthe.style.top = labyrintheY + "px";
// // }

// // function camelotPosition(x, y) {
// //   const camelotX = (largeurCarte / nbrColumn) * x;
// //   const camelotY = (hauteurCarte / nbrRow) * y;
// //   camelot.style.left = camelotX + "px";
// //   camelot.style.top = camelotY + "px";
// // }

// // function arthurMove(x, y){
// //     // la position de arthur
   
// // }
// // // position de départ
// // arthurPosition(4, 2);
// // labyrinthePosition(5, 5);
// // camelotPosition(10, 10);

// // // déplacement


// // import Element from "../classes/Element" 
// // import ImageCarte from "../classes/ImageCarte";
// // import { Kaamelott } from "../classes/Kaamelott";
// // import { drawMap, initMap } from "./grille";
// import Element from "../classes/Element.js";
// import ImageCarte from "../classes/ImageCarte.js";
// import { Kaamelott } from "../classes/Kaamelott.js";
// import { drawMap } from "./grille.js";

// const carteElement  = document.querySelector("#carte");
// const arthurElement = document.querySelector("#arthur");
// const labyrintheElement = document.querySelector("#labyrinthe");
// const camelotElement = document.querySelector("#camelot");
// if(!carteElement || !arthurElement || !labyrintheElement || !camelotElement) throw new Error("Could not find one of the elements");

// // On dessine la carte du navigateur
// const imageCarte = new ImageCarte(40, 32, carteElement.getBoundingClientRect());

// // On initialise les élements avec la carte
// const arthur = new Element(carteElement as HTMLElement, imageCarte)
// const labyrinthe = new Element(labyrintheElement as HTMLElement, imageCarte);
// const camelot= new Element(camelotElement as HTMLElement, imageCarte);

// // Initialiser la carte Kaamelott
// const kaamelott = new Kaamelott();
// kaamelott.displayGrid();

// // Placer Arthur et l'entrée du labyrinthe
// const arthurPosition = kaamelott.placeArthur();
// const labyrinthEntrance = kaamelott.labyrinthEntrance;


// // Mettre à jour les positions des éléments HTML
// arthur.move(arthurPosition.x, arthurPosition.y);
// if(labyrinthEntrance) {
//     labyrinthe.move(labyrinthEntrance.x, labyrinthEntrance.y);
// }
// // Dessiner la carte (grille)
// drawMap();

import Element from "../classes/Element.js";
import ImageCarte from "../classes/ImageCarte.js";
import { Kaamelott } from "../classes/Kaamelott.js";
import { drawMap, randomize } from "./grille.js";
import { map } from "./grille.js";


// Remove the carteElement from Element constructor - use the map container instead
const mapContainer = document.querySelector("#map-container") as HTMLElement;
const arthurElement = document.querySelector("#arthur") as HTMLElement;
const labyrintheElement = document.querySelector("#labyrinthe") as HTMLElement;
const camelotElement = document.querySelector("#camelot") as HTMLElement;

if (!mapContainer || !arthurElement || !labyrintheElement || !camelotElement) {
    throw new Error("Could not find one of the elements");
}

// Use simplified ImageCarte without DOMRect
const imageCarte = new ImageCarte(40, 32);

// Initialize elements with the map container as reference
const arthur = new Element(arthurElement, imageCarte);
const labyrinthe = new Element(labyrintheElement, imageCarte);
const camelot = new Element(camelotElement, imageCarte);

// Make sure characters are visible by setting initial positions
setTimeout(() => {
    arthur.move(arthurPosition.x, arthurPosition.y);
    if (labyrinthEntrance) {
        labyrinthe.move(labyrinthEntrance.x, labyrinthEntrance.y);
    }
    // Position camelot somewhere visible
    camelot.move(10, 10);
}, 100);

// Initialiser la carte Kaamelott
const kaamelott = new Kaamelott();
kaamelott.displayGrid();

// Variables pour l'algorithme
let isAlgorithmRunning = false;
let currentPath: any[] = [];

// Placer Arthur et l'entrée du labyrinthe
const arthurPosition = kaamelott.placeArthur();
const labyrinthEntrance = kaamelott.labyrinthEntrance;


// Dessiner la carte (grille)
//drawMap(); //testerror

// Fonction pour initialiser/réinitialiser l'algorithme
function initializeAlgorithm(): void {
    // Réinitialiser les positions
    const newArthurPosition = kaamelott.placeArthur();
    const newLabyrinthEntrance = kaamelott.labyrinthEntrance;
    
    // Mettre à jour les positions des éléments HTML
    arthur.move(newArthurPosition.x, newArthurPosition.y);
    if (newLabyrinthEntrance) {
        labyrinthe.move(newLabyrinthEntrance.x, newLabyrinthEntrance.y);
    }
    
    // Redessiner la carte
    drawMap();
    resetHighlights();
    
    // Afficher la grille dans la console
    kaamelott.displayGrid();
    
    updateStatus("Prêt à rechercher le chemin vers le labyrinthe!", "info");
}

// Fonction pour visualiser le chemin
function visualizePath(path: any[], currentStep: number = 0): void {
    if (currentStep >= path.length) {
        // Algorithme terminé
        isAlgorithmRunning = false;
        const totalDistance = path.reduce((sum, node) => sum + node.weight, 0);
        updateStatus(`Chemin trouvé! Distance totale: ${totalDistance}`, "success");
        enableButtons();
        
        // Animer Arthur suivant le chemin
        animateArthurAlongPath(path);
        return;
    }
    
    const currentNode = path[currentStep];
    
    // Mettre en évidence la cellule actuelle
    highlightCell(currentNode.x, currentNode.y, 'visited');
    
    // Marquer le point de départ et d'arrivée
    if (currentStep === 0) {
        highlightCell(currentNode.x, currentNode.y, 'start');
    } else if (currentStep === path.length - 1) {
        highlightCell(currentNode.x, currentNode.y, 'end');
    }
    
    // Continuer à l'étape suivante après un délai
    setTimeout(() => {
        visualizePath(path, currentStep + 1);
    }, 200); // Vitesse de l'animation (millisecondes)
}

// Fonction pour animer Arthur le long du chemin
function animateArthurAlongPath(path: any[], currentStep: number = 0): void {
    if (currentStep >= path.length) return;
    
    const currentNode = path[currentStep];
    
    // Use animateTo for smooth movement instead of move
    arthur.animateTo(currentNode.x, currentNode.y, 200);
    
    setTimeout(() => {
        animateArthurAlongPath(path, currentStep + 1);
    }, 250); // Slightly longer delay to see the movement
}
// Fonction pour mettre à jour les messages de statut
function updateStatus(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
    let statusElement = document.getElementById('statusMessage');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'statusMessage';
        const controls = document.querySelector('.controls');
        if (controls) {
            controls.parentNode?.insertBefore(statusElement, controls.nextSibling);
        }
    }
    
    statusElement.textContent = message;
    statusElement.className = `status-${type}`;
}

// Fonctions pour gérer l'état des boutons
function disableButtons(): void {
    const startBtn = document.getElementById('startCourseBtn') as HTMLButtonElement;
    const randomizeBtn = document.getElementById('randomizeBtn') as HTMLButtonElement;
    if (startBtn) startBtn.disabled = true;
    if (randomizeBtn) randomizeBtn.disabled = true;
}

function enableButtons(): void {
    const startBtn = document.getElementById('startCourseBtn') as HTMLButtonElement;
    const randomizeBtn = document.getElementById('randomizeBtn') as HTMLButtonElement;
    if (startBtn) startBtn.disabled = false;
    if (randomizeBtn) randomizeBtn.disabled = false;
}

// Fonction principale de l'algorithme
function startCourse(): void {
    if (isAlgorithmRunning) return;
    
    isAlgorithmRunning = true;
    disableButtons();
    updateStatus("Recherche du chemin en cours...", "info");
    
    // Réinitialiser les surbrillances
    resetHighlights();
    
    // Trouver le chemin le plus court
    const path = kaamelott.findShortestPathToEntrance();
    
    if (path.length === 0) {
        updateStatus("Aucun chemin trouvé vers l'entrée du labyrinthe!", "error");
        isAlgorithmRunning = false;
        enableButtons();
        return;
    }
    
    // Afficher le chemin dans la console
    kaamelott.displayPath(path);
    
    // Visualiser le chemin sur la grille
    visualizePath(path);
}

// Fonctions utilitaires pour la grille
function highlightCell(x: number, y: number, className: string): void {
    const cells = document.querySelectorAll('.cell');
    const cellIndex = y * 40 + x;
    if (cells[cellIndex]) {
        const currentColor = `color-${getMapValue(x, y)}`;
        cells[cellIndex].className = `cell ${currentColor} ${className}`;
    }
}

function resetHighlights(): void {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const y = Math.floor(index / 40);
        const x = index % 40;
        cell.className = `cell color-${getMapValue(x, y)}`;
    });
}

function getMapValue(x: number, y: number): number {
    if (y >= 0 && y < 32 && x >= 0 && x < 40) {
        return map[y][x] || 1; 
    }
    return 1; 
}

// Gestionnaires d'événements
document.addEventListener('DOMContentLoaded', () => {
    // Événement pour le bouton Aléatoire
    document.getElementById('randomizeBtn')?.addEventListener('click', () => {
        randomize();
        initializeAlgorithm();
    });
    
    // Événement pour le bouton En Course
    document.getElementById('startCourseBtn')?.addEventListener('click', startCourse);
    
    // Initialisation au chargement de la page
    updateStatus("Prêt à rechercher le chemin vers le labyrinthe!", "info");
});