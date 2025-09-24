import Element from "../classes/Element" 
import ImageCarte from "../classes/ImageCarte";

// On dessine la carte du navigateur
const imageCarte = new ImageCarte(40, 32, document.querySelector("#carte").getBoundingClientRect());

// On initialise les élements avec la carte
const arthur = new Element(document.querySelector("#arthur"), imageCarte)
const labyrinthe = new Element(document.querySelector("#labyrinthe"), imageCarte);
const camelot = new Element(document.querySelector("#camelot"), imageCarte);

// position de départ


// déplacement
