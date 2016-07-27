var Enemy, Snake,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Enemy = (function(superClass) {
  extend(Enemy, superClass);

  function Enemy(options) {
    Enemy.__super__.constructor.call(this, options);
    this.solid = true;
  }

  return Enemy;

})(BaseObject);

Snake = (function(superClass) {
  extend(Snake, superClass);

  function Snake(options) {
    Snake.__super__.constructor.call(this, options);
    this.sprite = createSprite('static/img/snake.png');
    this.draw();
  }

  return Snake;

})(Enemy);
