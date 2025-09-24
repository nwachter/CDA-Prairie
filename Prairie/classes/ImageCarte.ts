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
    public uniteX: number;
    public uniteY: number;

    constructor(nbrColumn: number, nbrRow: number) {
        this.nbrColumn = nbrColumn;
        this.nbrRow = nbrRow;
        this.uniteX = 20; // Fixed cell width
        this.uniteY = 20; // Fixed cell height
    }

    // Simple grid to pixel conversion for 20px cells
    public gridToPixel(gridX: number, gridY: number): { pixelX: number; pixelY: number } {
        const pixelX = gridX * this.uniteX + this.uniteX / 2;
        const pixelY = gridY * this.uniteY + this.uniteY / 2;
        return { pixelX, pixelY };
    }
}

export default ImageCarte;