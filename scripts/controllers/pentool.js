var AStar = AStar || {};

$(document).ready(function () {
    var $MAP = $('.map'),
        MAP_WIDTH_COUNT = $MAP.find('tr:first td').length,
        MAP_HEIGHT_COUNT = $MAP.find('tr').length,
        $MAP_TILES = $('.map-tile'),
        $BTNS = $('button'),
        $BTN_START = $('#set-begin'),
        $BTN_END = $('#set-end'),
        $BTN_LV = $('#set-lv');

    var TILES = {
        begin: '[data-status=begin]',
        end: '[data-status=end]',
        closed: '[data-status=closed]',
        setOpened: '[data-status=set-opened]',
        setClosed: '[data-status=set-closed]',
        path: '[data-status=path]'
    };

    var _setBegin = false,
        _setEnd = false,
        _setLv = false;

    var _event = {
        toggleOpen: function () {
            var status = $(this).attr('data-status');

            if (_setLv) {
                $(this).attr('data-lv', AStar.visual.getNewLv($(this)));
            } else if (status === 'begin' || status === 'end') {
                return;
            } else if (_setBegin) {
                $MAP.find(TILES.begin).attr('data-status', 'open');
                $(this).attr('data-status', 'begin');
                _setBegin = false;
            } else if (_setEnd) {
                $MAP.find(TILES.end).attr('data-status', 'open');
                $(this).attr('data-status', 'end');
                _setEnd = false;
            } else if (status === 'closed') {
                $(this).attr('data-status', 'open');
            } else {
                $(this).attr('data-status', 'closed');
            }
        },
        activeStart: function () {
            _setBegin = true;
            _setEnd = false;
            _setLv = false;
        },

        activeEnd: function () {
            _setBegin = false;
            _setEnd = true;
            _setLv = false;
        }
    };

    AStar.visual = {
        init: function () {
            this.bind();
        },

        bind: function () {
            $MAP_TILES.click(_event.toggleOpen);
            $BTN_START.click(_event.activeStart);
            $BTN_END.click(_event.activeEnd);
            $BTN_LV.click(_event.activeLv);
        },

        getStatus: function (x, y) {
            var status = this.getTile(x, y).attr('data-status');

            switch (status) {
                case undefined:
                    return 'open';
                case 'open':
                    return 'open';
                default:
                    return status;
            }
        },

        getMap: function () {
            var tmpMap = [],
                status,
                i,
                j;

            for (i = 0; i < MAP_HEIGHT_COUNT; i++) {
                tmpMap.push([]);
                for (j = 0; j < MAP_WIDTH_COUNT; j++) {
                    status = this.getStatus(j, i);

                    if (status === 'closed') {
                        tmpMap[i][j] = 0;
                    } else {
                        tmpMap[i][j] = 1;
                    }
                }
            }

            return tmpMap;
        },
        getBegin: function () {
            var $beginTile = $(TILES.begin);

            return {
                x: $beginTile.index(),
                y: $beginTile.parent('tr').index(),
                z: (parseInt($beginTile.attr('data-lv'), 10) || 1) - 1
            };
        },

        getEnd: function () {
            var $endTile = $(TILES.end);

            return {
                x: $endTile.index(),
                y: $endTile.parent('tr').index(),
                z: (parseInt($endTile.attr('data-lv'), 10) || 1) - 1
            };
        },

        getTile: function (x, y) {
            return $MAP.find('tr:nth-child(' + (y + 1) + ') td:nth-child(' + (x + 1) + ')');
        },

        setTile: function (tile, status) {
            var $tile = this.getTile(tile.x, tile.y);
            if ($tile.attr('data-status') === 'begin' || $tile.attr('data-status') === 'end') {
                return;
            }
            $tile.attr('data-status', status);
            return this;
        },

        setTileGroup: function (steps, tileStatus) {
            for (var i = 0; i < steps.length; i++) {
                this.setTile(steps[i], tileStatus);
            }
            return this;
        },

        erase: function () {
            var $el;
            $MAP_TILES.each(function () {
                $el = $(this);
                if ($el.attr('data-status') !== 'begin' && $el.attr('data-status') !== 'end') {
                    $el.attr('data-status', 'open');
                }
            });
        },

        clearPath: function () {
            $(TILES.setClosed + ', ' + TILES.setOpened + ', ' + TILES.path).attr('data-status', 'open');
            return this;
        }
    };
});