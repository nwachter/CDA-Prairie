// import ImageCarte from "./ImageCarte";

//  class Element{
//   public x: number;
//   public y: number;
//   public avatar: HTMLElement;
//   public carte: ImageCarte;

//   constructor(avatar: HTMLElement, carte: ImageCarte) {
//     this.x = 0;
//     this.y = 0;
//     this.avatar = avatar;
//     this.carte = carte;
//   }

//   public move(x: number, y: number) {
//     this.avatar.style.top = String(x * this.carte.uniteX + "px");
//     this.avatar.style.left = String(y + this.carte.uniteY + "px");
//     this.x = x;
//     this.y = y;
//   }
// }

// export default Element;

import ImageCarte from "./ImageCarte.js";

class Element {
    public x: number;
    public y: number;
    public avatar: HTMLElement;
    public carte: ImageCarte;

    constructor(avatar: HTMLElement, carte: ImageCarte) {
        this.x = 0;
        this.y = 0;
        this.avatar = avatar;
        this.carte = carte;
        
        // Style initial pour le positionnement absolu
        this.avatar.style.position = 'absolute';
        this.avatar.style.transform = 'translate(-50%, -50%)'; // Centrer l'élément
    }

    public move(x: number, y: number): void {
        // Calculer la position en pixels
        const pixelX = this.carte.cartePositionInitX + (x * this.carte.uniteX);
        const pixelY = this.carte.cartePositionInitY + (y * this.carte.uniteY);
        
        // Appliquer la position
        this.avatar.style.left = `${pixelX}px`;
        this.avatar.style.top = `${pixelY}px`;
        
        this.x = x;
        this.y = y;
    }

    // Nouvelle méthode pour animer le déplacement progressif
    public animateTo(x: number, y: number, duration: number = 300): void {
        const startX = this.x;
        const startY = this.y;
        const startTime = performance.now();
        
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Interpolation linéaire
            const currentX = startX + (x - startX) * progress;
            const currentY = startY + (y - startY) * progress;
            
            this.move(Math.round(currentX), Math.round(currentY));
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

export default Element;