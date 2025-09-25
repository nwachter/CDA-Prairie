import ImageCarte from "./ImageCarte";

export default class Element {
  public x: number;
  public y: number;
  public avatar: HTMLElement;
  public carte: ImageCarte;

  constructor(avatar: HTMLElement, carte: ImageCarte) {
    this.x = 0;
    this.y = 0;
    this.avatar = avatar;
    this.carte = carte;
  }

  public move(x: number, y: number) {
    console.log(x + " " + y);
    this.avatar.style.left = String(x * this.carte.uniteY - 50 + "px");
    this.avatar.style.top = String(y * this.carte.uniteX - 50 + "px");
  }
}
