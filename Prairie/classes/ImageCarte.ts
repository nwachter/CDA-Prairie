export default class ImageCarte {
  public nbrColumn: number;
  public nbrRow: number;
  // Utiliser element.getBoundingClientRect()
  public formatCarte: DOMRect;
  public cartePositionInitX: number;
  public cartePositionInitY: number;
  public carteLargeur: number;
  public carteHauteur: number;
  public uniteX: number;
  public uniteY: number;

  constructor(nbrColumn: number, nbrRow: number, formatCarte: DOMRect) {
    this.nbrColumn = nbrColumn;
    this.nbrRow = nbrRow;
    this.formatCarte = formatCarte;
    this.carteHauteur = formatCarte.height;
    this.carteLargeur = formatCarte.width;
    this.uniteX = this.carteLargeur / nbrColumn;
    this.uniteY = this.carteHauteur / nbrRow;
    // pour positionner au centre d'une case
    this.cartePositionInitX = formatCarte.left + this.uniteX / 2;
    this.cartePositionInitY = formatCarte.top + this.uniteY / 2;
  }

  //   nbrColumn = 40;
  //   nbrRow = 32;
  //   formatCarte = carte.getBoundingClientRect();
}
