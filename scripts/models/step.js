var AStar = AStar || {};

$(document).ready(function () {
    var map = {
        distanceM: function (xC, yC, xT, yT) {
            var dx = Math.abs(xT - xC), dy = Math.abs(yT - yC);
            return dx + dy;
        },
    };

    AStar.Step = function(xC, yC, xT, yT, totalSteps, parentStep) {
        var h = map.distanceM(xC, yC, xT, yT);
        this.x = xC;
        this.y = yC;
        this.g = totalSteps;
        this.h = h;
        this.f = totalSteps + h;
        this.parent = parentStep;
    };
});