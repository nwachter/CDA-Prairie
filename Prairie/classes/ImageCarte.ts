// class ImageCarte {
//   public nbrColumn: number;
//   public nbrRow: number;
//   // Utiliser element.getBoundingClientRect()
//   public formatCarte: DOMRect;
//   public cartePositionInitX: number;
//   public cartePositionInitY: number;
//   public carteLargeur: number;
//   public carteHauteur: number;
//   public uniteX: number;
//   public uniteY: number;

//   constructor(nbrColumn: number, nbrRow: number, formatCarte: DOMRect) {
//     this.nbrColumn = nbrColumn;
//     this.nbrRow = nbrRow;
//     this.formatCarte = formatCarte;
//     this.carteHauteur = formatCarte.height;
//     this.carteLargeur = formatCarte.width;
//     this.uniteX = this.carteLargeur / nbrColumn;
//     this.uniteY = this.carteHauteur / nbrRow;
//     // pour positionner au centre d'une case
//     this.cartePositionInitX = formatCarte.left + this.uniteX / 2;
//     this.cartePositionInitY = formatCarte.top + this.uniteY / 2;
//   }

//   //   nbrColumn = 40;
//   //   nbrRow = 32;
//   //   formatCarte = carte.getBoundingClientRect();
// }

// export default ImageCarte;

class ImageCarte {
    public nbrColumn: number;
    public nbrRow: number;
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
        
        // Position initiale pour centrer dans une case
        this.cartePositionInitX = formatCarte.left + this.uniteX / 2;
        this.cartePositionInitY = formatCarte.top + this.uniteY / 2;
    }

    // Méthode pour convertir des coordonnées pixels en coordonnées grille
    public pixelToGrid(x: number, y: number): { gridX: number; gridY: number } {
        const gridX = Math.floor((x - this.formatCarte.left) / this.uniteX);
        const gridY = Math.floor((y - this.formatCarte.top) / this.uniteY);
        return { gridX, gridY };
    }

    // Méthode pour convertir des coordonnées grille en coordonnées pixels
    public gridToPixel(gridX: number, gridY: number): { pixelX: number; pixelY: number } {
        const pixelX = this.formatCarte.left + (gridX * this.uniteX) + this.uniteX / 2;
        const pixelY = this.formatCarte.top + (gridY * this.uniteY) + this.uniteY / 2;
        return { pixelX, pixelY };
    }
}

export default ImageCarte;