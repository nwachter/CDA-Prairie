import Element from "../classes/Element.js";
import ImageCarte from "../classes/ImageCarte.js";
import { Kaamelott } from "../classes/Kaamelott.js";
import { map } from "../classes/grille/grille.js";

// grille de la carte
const colonnes = 40;
const rows = 32;

// On récupére nos éléments sur le front
const imageCarteElement = document.querySelector("#carte");
const arthurElement = document.querySelector("#arthur");
const labyrintheElement = document.querySelector("#labyrinthe");
const camelotElement = document.querySelector("#camelot");

// On initialise la position des élements avec la carte
const imageCarte = new ImageCarte(colonnes, rows, document.querySelector("#carte")!.getBoundingClientRect());
const arthur = new Element(document.querySelector("#arthur") as HTMLElement, imageCarte);
const labyrinthe = new Element(document.querySelector("#labyrinthe") as HTMLElement, imageCarte);
const camelot = new Element(document.querySelector("#camelot") as HTMLElement, imageCarte);
if (!arthurElement || !labyrintheElement || !camelotElement || !imageCarteElement)
  throw new Error("Could not find one of the elements");

// Générer aléatoirement emplacement de de camelot et arthur
const randomX = Math.floor(Math.random() * colonnes);
const randomY = Math.floor(Math.random() * rows);
const randomPosition: [number, number] = [randomX, randomY];
camelot.move(randomPosition);
arthur.move(randomPosition);

// Emplacement du labyrinthe
const randomLX = Math.floor(Math.random() * colonnes);
const randomLY = Math.floor(Math.random() * rows);
const randomLPosition: [number, number] = [randomLX, randomLY];
labyrinthe.move(randomLPosition);

// Je récupère le passage le plus court entre arthur et le labyrinthe
const kaamelott = new Kaamelott();
const path = kaamelott.findShortestPathBetweenPoints(randomPosition, randomLPosition, map);

// Attente que user appui sur button et déplacement de arthur vers le labyrinthe
const button_go = document.querySelector("#button_go") as HTMLElement;
button_go.addEventListener("click", handleButtonGo);

function handleButtonGo() {
  button_go.style.display = "none";
  button_reset.style.display = "flex";
  for (let i = 0; i < path.length; i++) {
    const x = Number(path[i].name.trim().split(",")[0]);
    const y = Number(path[i].name.trim().split(",")[1]);
    setTimeout(() => {
      arthur.move([x, y]);
      console.log(path[i].name);
    }, i * 300);
  }
}

// Bouton de raifraichissement de la page
const button_reset = document.querySelector("#button_reset") as HTMLElement;
button_reset.addEventListener("click", handleButtonReset);

function handleButtonReset() {
  location.reload();
}

// reste à importer la fonction qui gère l'algorithme est qui renvoie une liste de coordonnée
