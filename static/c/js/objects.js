var BaseObject, Door, Openable, Stairs, Wall,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseObject = (function() {
  function BaseObject(options) {
    this.sprite = null;
    this.solid = false;
    this.visible = false;
    this.distant = false;
    this.x = options.x;
    this.y = options.y;
    this.visible = options.visible || false;
  }

  BaseObject.prototype.draw = function() {
    this.sprite.x = this.x * CELL_SIZE;
    this.sprite.y = this.y * CELL_SIZE;
    if (this.visible) {
      gamestate.level.stage.addChild(this.sprite);
    }
  };

  BaseObject.prototype.save = function() {
    return JSON.stringify(this);
  };

  return BaseObject;

})();

Openable = (function(superClass) {
  extend(Openable, superClass);

  function Openable(options) {
    Openable.__super__.constructor.call(this, options);
    this.openable = true;
  }

  return Openable;

})(BaseObject);

Wall = (function(superClass) {
  extend(Wall, superClass);

  function Wall(options) {
    Wall.__super__.constructor.call(this, options);
    this.solid = true;
    this.sprite = createSprite('static/img/wall20.png');
    this.draw();
  }

  return Wall;

})(BaseObject);

Door = (function(superClass) {
  extend(Door, superClass);

  function Door(options) {
    Door.__super__.constructor.call(this, options);
    this.door = true;
    this.open_texture = PIXI.Texture.fromImage('static/img/door_open.png');
    this.closed_texture = PIXI.Texture.fromImage('static/img/door_closed.png');
    this.rooms = [];
    this.is_open = options.is_open || false;
    this.sprite = createSprite('static/img/door_closed.png');
    if (this.is_open) {
      this.open();
    } else {
      this.close();
    }
    this.rooms = options.rooms || [];
  }

  Door.prototype.open = function() {
    var i, len, ref, room;
    this.sprite.texture = this.open_texture;
    this.solid = false;
    this.is_open = true;
    ref = this.rooms;
    for (i = 0, len = ref.length; i < len; i++) {
      room = ref[i];
      if (!room.visible) {
        room.show();
      }
    }
    return this.draw();
  };

  Door.prototype.close = function() {
    this.sprite.texture = this.closed_texture;
    this.solid = true;
    this.is_open = false;
    return this.draw();
  };

  return Door;

})(Openable);

Stairs = (function(superClass) {
  extend(Stairs, superClass);

  function Stairs(options) {
    Stairs.__super__.constructor.call(this, options);
    this.stairs = true;
    if (options.up) {
      this.sprite = createSprite('static/img/stairs_up.png');
      this.up = true;
    } else {
      this.sprite = createSprite('static/img/stairs_down.png');
      this.down = true;
    }
    this.draw(this.x, this.y);
  }

  Stairs.prototype.use = function() {
    if (this.up) {
      gamestate.go_up_a_level();
    }
    if (this.down) {
      return gamestate.go_down_a_level();
    }
  };

  return Stairs;

})(BaseObject);
