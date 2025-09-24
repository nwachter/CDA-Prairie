class Noeud {
    public value: number;
    public left: Noeud;
    public right: Noeud;

    constructor(value: number) {
        this.value = value;
    }
}

class BinaryTree {
    private root: Noeud;

    constructor(rootValue: number) {
        this.root = new Noeud(rootValue);
    }

    public add(value: number): void {
        this.addRecursive(this.root, value);
    }

    private addRecursive(noeud: Noeud, value: number): void {
        if (value < noeud.value) {
            if (noeud.left) {
                this.addRecursive(noeud.left, value);
            } else {
                noeud.left = new Noeud(value);
            }
        } else {
            if (noeud.right) {
                this.addRecursive(noeud.right, value);
            } else {
                noeud.right = new Noeud(value);
            }
        }
    }

    public search(value: number): boolean {
        return this.searchRecursive(this.root, value);
    }

    private searchRecursive(noeud: Noeud | undefined, value: number): boolean {
        if (!noeud) {
            return false;
        }

        if (noeud.value === value) {
            return true;
        }

        return value < noeud.value
            ? this.searchRecursive(noeud.left, value)
            : this.searchRecursive(noeud.right, value);
    }
}

const tree = new BinaryTree(8);
tree.add(3);
tree.add(10);
tree.add(1);
tree.add(6);
tree.add(14);
tree.add(4);
tree.add(7);
tree.add(13);

console.log(tree.search(7));  
console.log(tree.search(15));

export default BinaryTree;