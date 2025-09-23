"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = void 0;
var Cell_1 = require("./Cell");
var Map = /** @class */ (function () {
    function Map(maxWidth, maxHeight) {
        this.size = { maxWidth: maxWidth, maxHeight: maxHeight };
        this.cell = this.initializeGrid(maxWidth, maxHeight);
        this.newPosition = [];
    }
    Map.prototype.initializeGrid = function (maxWidth, maxHeight) {
        var grid = [];
        for (var y = 0; y < maxHeight; y++) {
            grid[y] = [];
            for (var x = 0; x < maxWidth; x++) {
                var cellData = { x: x, y: y };
                var comparator = function (a, b) { return a.x === b.x && a.y === b.y ? 0 : 1; };
                grid[y][x] = new Cell_1.Cell(cellData, comparator);
            }
        }
        this.connectAdjacentCells(grid);
        return grid;
    };
    Map.prototype.connectAdjacentCells = function (grid) {
        for (var y = 0; y < this.size.maxHeight; y++) {
            for (var x = 0; x < this.size.maxWidth; x++) {
                var currentCell = grid[y][x];
                // Connecter avec les 4 voisines
                if (x > 0)
                    currentCell.addAdjacent(grid[y][x - 1]); // Gauche
                if (x < this.size.maxWidth - 1)
                    currentCell.addAdjacent(grid[y][x + 1]); // Droite
                if (y > 0)
                    currentCell.addAdjacent(grid[y - 1][x]); // Haut
                if (y < this.size.maxHeight - 1)
                    currentCell.addAdjacent(grid[y + 1][x]); // Bas
            }
        }
    };
    Map.prototype.addObstacle = function (x, y) {
        if (x >= 0 && x < this.size.maxWidth && y >= 0 && y < this.size.maxHeight) {
            this.cell[y][x].isObstacles = true;
        }
    };
    Map.prototype.displayMap = function () {
        console.log('\n🗺️  Carte:');
        for (var y = 0; y < this.size.maxHeight; y++) {
            var line = '';
            for (var x = 0; x < this.size.maxWidth; x++) {
                var cell = this.cell[y][x];
                if (cell.isEntrance) {
                    line += 'E '; // Entrée
                }
                else if (cell.isObstacles) {
                    line += 'X '; // Obstacle
                }
                else {
                    line += '. '; // Case normale
                }
            }
            console.log(line);
        }
    };
    return Map;
}());
exports.Map = Map;
