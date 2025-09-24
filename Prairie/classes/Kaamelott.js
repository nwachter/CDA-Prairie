"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kaamelott = void 0;
var Node_1 = require("./Node");
var Kaamelott = /** @class */ (function () {
    function Kaamelott() {
        this.nodes = new Map(); //nodes: Map<string, Node> // string : nom du lieu, Node : le noeud
    }
    //Ajoute un noeud s'il n'existe pas déjà
    Kaamelott.prototype.addNode = function (name) {
        if (!this.nodes.has(name)) {
            this.nodes.set(name, new Node_1.Node(name));
        }
        return this.nodes.get(name);
    };
    //Ajoute une "arête" entre deux noeuds avec une distance
    //Chaque noeud représente un lieu (Kaamelott, Village, Forêt…). Un noeud doit savoir à quels autres noeuds il est connecté, et à quelle distance.
    Kaamelott.prototype.addEdge = function (a, b, distance) {
        var nodeA = this.addNode(a);
        var nodeB = this.addNode(b);
        nodeA.addNeighbor(nodeB, distance);
        nodeB.addNeighbor(nodeA, distance); // undirected graph
    };
    Kaamelott.prototype.toString = function () {
        var result = "";
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], node = _b[1];
            var neighbors = Array.from(node.neighbors.entries()).map(function (_a) {
                var neighbor = _a[0], distance = _a[1];
                return "".concat(neighbor.name, " (").concat(distance, ")");
            });
            result += "".concat(name_1, " -> ").concat(neighbors.join(", "), "\n");
        }
        return result;
    };
    Kaamelott.prototype.toStringNode = function (nodeName) {
        var node = this.nodes.get(nodeName);
        if (!node)
            return "".concat(nodeName, " not found in the graph.");
        var neighbors = Array.from(node.neighbors.entries()).map(function (_a) {
            var neighbor = _a[0], distance = _a[1];
            return "".concat(neighbor.name, " (").concat(distance, ")");
        });
        return "".concat(nodeName, " -> ").concat(neighbors.join(", "));
    };
    Kaamelott.prototype.calculateSmallestDistance = function (firstNode, visitedNodes) {
        // distances : stocke la plus petite distance connue depuis firstNode jusqu’à chaque autre nœud
        var distances = new Map();
        // Étape 1 : Initialiser toutes les distances à l’infini
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var name_2 = _a[_i][0];
            distances.set(name_2, Infinity);
        }
        // La distance du nœud de départ à lui-même est toujours 0
        distances.set(firstNode.name, 0);
        // On commence par le nœud de départ
        var currentNode = firstNode;
        // Étape 2 : Traiter les nœuds tant qu’il en reste de non visités (ou aucun nœud accessible)
        while (visitedNodes.size < this.nodes.size) {
            // Étape 3 : Pour chaque voisin du nœud courant,
            // mettre à jour sa distance si on trouve un chemin plus court
            for (var _b = 0, _c = currentNode.neighbors.entries(); _b < _c.length; _b++) {
                var _d = _c[_b], neighbor = _d[0], distance = _d[1];
                if (!visitedNodes.has(neighbor)) {
                    var newDistance = distances.get(currentNode.name) + distance;
                    if (newDistance < distances.get(neighbor.name)) {
                        distances.set(neighbor.name, newDistance);
                    }
                }
            }
            // On marque le nœud courant comme visité
            visitedNodes.add(currentNode);
            // Étape 4 : Trouver le nœud non visité avec la plus petite distance
            var nextNode = null;
            var smallestDistance = Infinity;
            for (var _e = 0, distances_1 = distances; _e < distances_1.length; _e++) {
                var _f = distances_1[_e], name_3 = _f[0], distance = _f[1];
                var node = this.nodes.get(name_3);
                if (node && !visitedNodes.has(node)) {
                    if (distance < smallestDistance) {
                        smallestDistance = distance;
                        nextNode = node;
                    }
                }
            }
            // Si aucun nœud accessible n’est trouvé, on arrête
            if (!nextNode)
                break;
            // On passe au nœud le plus proche
            currentNode = nextNode;
        }
        // On retourne la map contenant les plus petites distances depuis firstNode
        return distances;
    };
    return Kaamelott;
}());
exports.Kaamelott = Kaamelott;
