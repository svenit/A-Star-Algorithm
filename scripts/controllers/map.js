var AStar = AStar || {};

$(document).ready(function () {
    let map = {
        outOfBounds: function (x, y) {
            return x < 0 || x >= AStar.map.data[0].length || y < 0 || y >= AStar.map.data.length;
        },
    };

    AStar.map = {
        data: null,

        setData: function (map) {
            this.data = map;
            return this;
        },

        getWidthInTiles: function () {
            return this.data[0].length;
        },

        getHeightInTiles: function () {
            return this.data.length;
        },

        blocked: function (x, y) {
            if (map.outOfBounds(x, y)) {
                return true;
            }

            if (this.data[y][x] === 0) {
                return true;
            }

            return false;
        },

        getNeighbors: function (x, y) {
            var neighbors = [];
            if (!this.blocked(x + 1, y)) neighbors.push(new AStar.Tile(x + 1, y));
            if (!this.blocked(x - 1, y)) neighbors.push(new AStar.Tile(x - 1, y));
            if (!this.blocked(x, y + 1)) neighbors.push(new AStar.Tile(x, y + 1));
            if (!this.blocked(x, y - 1)) neighbors.push(new AStar.Tile(x, y - 1));
            return neighbors;
        },

        getCost: function (xC, yC, xT, yT) {
            return this.data[yT][xT];
        },
    };
});