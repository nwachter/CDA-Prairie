import ImageCarte from "./ImageCarte";

export default class Element{
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
    this.avatar.style.top = String(x * this.carte.uniteX + "px");
    this.avatar.style.left = String(y + this.carte.uniteY + "px");
  }
}
