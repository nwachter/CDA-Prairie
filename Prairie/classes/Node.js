"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
var Node = /** @class */ (function () {
    function Node(name) {
        this.name = name;
        this.neighbors = new Map();
    }
    Node.prototype.addNeighbor = function (node, distance) {
        this.neighbors.set(node, distance);
    };
    return Node;
}());
exports.Node = Node;
