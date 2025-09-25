import Element from "../classes/Element.js";
import ImageCarte from "../classes/ImageCarte.js";

const imageCarteElement = document.querySelector("#carte");
// On dessine la carte du navigateur

const colonnes = 40;
const rows = 32;
const imageCarte = new ImageCarte(colonnes, rows, document.querySelector("#carte").getBoundingClientRect());


const arthurElement = document.querySelector("#arthur");
const labyrintheElement = document.querySelector("#labyrinthe");
const camelotElement = document.querySelector("#camelot");

if(!arthurElement || !labyrintheElement || !camelotElement || !imageCarteElement) throw new Error("Could not find one of the elements");
// On initialise les élements avec la carte

const arthur = new Element(document.querySelector("#arthur"), imageCarte);
const labyrinthe = new Element(document.querySelector("#labyrinthe"), imageCarte);
const camelot = new Element(document.querySelector("#camelot"), imageCarte);


// Générer aléatoirement emplacement de de camelot et arthur
const randomX = Math.floor(Math.random() * colonnes);
const randomY = Math.floor(Math.random() * rows);
camelot.move(randomX, randomY);
arthur.move(randomX, randomY);

// Emplacement du labyrinthe
labyrinthe.move(30, 26)

// Attente que user appui sur button et déplacement de arthur vers le labyrinthe
const button_go = document.querySelector("#button_go") as HTMLElement;
button_go.addEventListener("click", handleButtonGo);
const button_reset = document.querySelector("#button_reset") as HTMLElement;
button_reset.addEventListener("click", handleButtonReset);

function handleButtonReset() {
  location.reload();
}
function handleButtonGo() {
  button_go.style.display = "none";
  button_reset.style.display = "flex";
}

// reste à importer la fonction qui gère l'algorithme est qui renvoie une liste de coordonnée 

