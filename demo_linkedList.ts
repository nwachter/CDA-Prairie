import {Cell} from './Cell';
import {LinkedList} from './LinkedList';



const firstCell = new Cell(1);
const secondCell = new Cell(2);
const thirdCell = new Cell(3, null);
const linkedList = new LinkedList();
linkedList.addToEnd(firstCell);
linkedList.addToEnd(secondCell);
linkedList.addToEnd(thirdCell);
console.log("La liste : " + linkedList.toString());
console.log("Première cellule : " + JSON.stringify(firstCell));
console.log("Deuxieme cellule : " + JSON.stringify(secondCell));
console.log("Dernière cellule : " + JSON.stringify(linkedList.last));
