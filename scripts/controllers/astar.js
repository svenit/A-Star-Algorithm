var AStar = AStar || {};

$(document).ready(function () {
    AStar.pathFinder = {
        closed: [],
        open: [],
        step: 0,

        addOpen: function (step) {
            this.open.push(step);
            return this;
        },

        removeOpen: function (step) {
            for (var i = 0; i < this.open.length; i++) {
                if (this.open[i] === step) this.open.splice(i, 1);
            }
            return this;
        },

        inOpen: function (step) {
            for (var i = 0; i < this.open.length; i++) {
                if (this.open[i].x === step.x && this.open[i].y === step.y)
                    return this.open[i];
            }

            return false;
        },

        getBestOpen: function () {
            var bestI = 0;
            for (var i = 0; i < this.open.length; i++) {
                if (this.open[i].f < this.open[bestI].f) bestI = i;
            }

            return this.open[bestI];
        },

        addClosed: function (step) {
            this.closed.push(step);
            return this;
        },

        inClosed: function (step) {
            for (var i = 0; i < this.closed.length; i++) {
                if (this.closed[i].x === step.x && this.closed[i].y === step.y)
                    return this.closed[i];
            }

            return false;
        },

        findPath: function (beginX, beginY, endX, endY) {
            var current,
                neighbors,
                neighborRecord,
                stepCost,
                i;

            this.reset().addOpen(new AStar.Step(beginX, beginY, endX, endY, this.step, false));

            while (this.open.length !== 0) {
                current = this.getBestOpen();

                if (current.x === endX && current.y === endY) {
                    return this.buildPath(current, []);
                }

                this.removeOpen(current).addClosed(current);

                neighbors = AStar.map.getNeighbors(current.x, current.y);
                for (i = 0; i < neighbors.length; i++) {
                    stepCost = current.g + AStar.map.getCost(current.x, current.y, neighbors[i].x, neighbors[i].y);
                    neighborRecord = this.inClosed(neighbors[i]);
                    if (neighborRecord && stepCost >= neighborRecord.g)
                        continue;
                    neighborRecord = this.inOpen(neighbors[i]);
                    if (!neighborRecord || stepCost < neighborRecord.g) {
                        if (!neighborRecord) {
                            this.addOpen(new AStar.Step(neighbors[i].x, neighbors[i].y, endX, endY, stepCost, current));
                        } else {
                            neighborRecord.parent = current;
                            neighborRecord.g = stepCost;
                            neighborRecord.f = stepCost + neighborRecord.h;
                        }
                    }
                }
            }
            return false;
        },

        buildPath: function (tile, stack) {
            stack.push(tile);
            if (tile.parent) {
                return this.buildPath(tile.parent, stack);
            }
            return stack;
        },

        setVisual: function () {
            AStar.visual.clearPath().setTileGroup(this.open, 'set-opened').setTileGroup(this.closed, 'set-closed');
        },

        reset: function () {
            this.closed = [];
            this.open = [];
            return this;
        }
    };
});