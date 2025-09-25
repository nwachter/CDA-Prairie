// const arthur = document.querySelector("#arthur");
// const carte = document.querySelector("#carte");
// const labyrinthe = document.querySelector("#labyrinthe");
// const camelot = document.querySelector("#camelot");

// // la grille fait 20 / 20 dont le 0
// const nbrColumn = 20;
// const nbrRow = 20;
// const largeurCarte = carte.clientWidth;
// const hauteurCarte = carte.clientHeight;

// function arthurPosition(x, y) {
//   const arthurX = (largeurCarte / nbrColumn) * x;
//   const arthurY = (hauteurCarte / nbrRow) * y;
//   arthur.style.left = arthurX + "px";
//   arthur.style.top = arthurY + "px";
// }

// function labyrinthePosition(x, y) {
//   const labyrintheX = (largeurCarte / nbrColumn) * x;
//   const labyrintheY = (hauteurCarte / nbrRow) * y;
//   labyrinthe.style.left = labyrintheX + "px";
//   labyrinthe.style.top = labyrintheY + "px";
// }

// function camelotPosition(x, y) {
//   const camelotX = (largeurCarte / nbrColumn) * x;
//   const camelotY = (hauteurCarte / nbrRow) * y;
//   camelot.style.left = camelotX + "px";
//   camelot.style.top = camelotY + "px";
// }

// function arthurMove(x, y){
//     // la position de arthur
   
// }
// // position de départ
// arthurPosition(4, 2);
// labyrinthePosition(5, 5);
// camelotPosition(10, 10);

// // déplacement


import Element from "../classes/Element" 
import ImageCarte from "../classes/ImageCarte";

const imageCarteElement = document.querySelector("#carte");
// On dessine la carte du navigateur
const imageCarte = new ImageCarte(40, 32, imageCarteElement!.getBoundingClientRect());

const arthurElement = document.querySelector("#arthur");
const labyrintheElement = document.querySelector("#labyrinthe");
const camelotElement = document.querySelector("#camelot");

if(!arthurElement || !labyrintheElement || !camelotElement || !imageCarteElement) throw new Error("Could not find one of the elements");
// On initialise les élements avec la carte
const arthur = new Element(arthurElement as HTMLElement, imageCarte)
const labyrinthe = new Element(labyrintheElement as HTMLElement, imageCarte);
const camelot = new Element(camelotElement as HTMLElement, imageCarte);

// position de départ


// déplacement
