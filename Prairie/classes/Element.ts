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
        
        // Ensure the avatar has proper positioning
        this.avatar.style.position = 'absolute';
        this.avatar.style.zIndex = '10';
        this.avatar.style.pointerEvents = 'none';
        this.avatar.style.transform = 'translate(-50%, -50%)';
    }

    public move(x: number, y: number): void {
        // Calculate position based on grid cells (20px each)
        const pixelX = x * 20 + 10; // 10px to center in 20px cell
        const pixelY = y * 20 + 10; // 10px to center in 20px cell
        
        this.avatar.style.left = `${pixelX}px`;
        this.avatar.style.top = `${pixelY}px`;
        
        this.x = x;
        this.y = y;
        
        console.log(`Moving to (${x}, ${y}) -> (${pixelX}px, ${pixelY}px)`);
    }

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