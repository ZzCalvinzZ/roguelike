var Enemy, Snake,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Enemy = (function(superClass) {
  extend(Enemy, superClass);

  function Enemy(options) {
    Enemy.__super__.constructor.call(this, options);
    this.solid = true;
  }

  Enemy.prototype.normal_move = function(to) {
    var count, path;
    path = new ROT.Path.Dijkstra(to.x, to.y, gamestate.cell_is_passable);
    count = 0;
    path._fromX = this.x;
    path._fromY = this.y;
    return path.compute(this.x, this.y, (function(_this) {
      return function(x, y) {
        var ref;
        if (count <= 1 && !(x === to.x && y === to.y)) {
          ref = [x, y], _this.x = ref[0], _this.y = ref[1];
          _this.draw();
          return count += 1;
        }
      };
    })(this));
  };

  return Enemy;

})(BaseObject);

Snake = (function(superClass) {
  extend(Snake, superClass);

  function Snake(options) {
    Snake.__super__.constructor.call(this, options);
    this.sprite = createSprite('static/img/snake.png');
    this.draw();
  }

  Snake.prototype.move = function(to) {
    return this.normal_move(to);
  };

  return Snake;

})(Enemy);
