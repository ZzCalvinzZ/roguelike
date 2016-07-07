var CELL_SIZE, DEFAULT_MAP_SIZE, Level, MAX_ROOM_SIZE, MIN_ROOM_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH, camera, gamestate, player;

CELL_SIZE = 20;

SCREEN_WIDTH = 800;

SCREEN_HEIGHT = 400;

DEFAULT_MAP_SIZE = 50;

MIN_ROOM_SIZE = 5;

MAX_ROOM_SIZE = 20;

camera = new PIXI.Container;

player = new Player({
  x: 25,
  y: 25,
  visible: true
});

Level = (function() {
  Level.prototype.map_data = [];

  Level.prototype.level = null;

  Level.prototype.stage = null;

  Level.prototype.start = {
    x: null,
    y: null
  };

  Level.prototype.rooms = [];

  function Level(options) {
    if (options.level != null) {
      this.level = options.level;
      this.create_stage();
    } else {
      console.log('need to pass in level');
    }
  }

  Level.prototype.create_map = function(options) {
    var ref, ref1;
    if (this.level === 0) {
      return ref = map_utils.create_town_map(), this.map_data = ref[0], this.start = ref[1], ref;
    } else {
      return ref1 = map_utils.create_map_from_data(this.level), this.map_data = ref1[0], this.start = ref1[1], ref1;
    }
  };

  Level.prototype.create_stage = function() {
    return this.stage = new PIXI.Container;
  };

  Level.prototype.reset_map_to_entrance = function() {
    var ref;
    ref = [this.start.x, this.start.y], player.x = ref[0], player.y = ref[1];
    player.draw();
    return center_camera_on(player);
  };

  return Level;

})();

gamestate = {
  levels: {},
  level: null,
  ready: false,
  go_up_a_level: function() {
    var next_level;
    next_level = this.level.level - 1;
    return this.move_level(next_level);
  },
  go_down_a_level: function() {
    var next_level;
    next_level = this.level.level + 1;
    return this.move_level(next_level);
  },
  move_level: function(next_level) {
    if (this.level !== null) {
      this.level.stage.removeChild(player);
      this.level.stage.visible = false;
    }
    if (next_level in this.levels) {
      this.level = this.levels[next_level];
      this.level.stage.visible = true;
    } else {
      this.level = new Level({
        level: next_level
      });
      this.level.create_map();
      this.levels[next_level] = this.level;
    }
    camera.addChild(gamestate.level.stage);
    return this.level.reset_map_to_entrance();
  }
};
