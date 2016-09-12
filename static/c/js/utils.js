var center_camera_on, createSprite, destroy_all_things_in_cell, destroy_sprite, get_camera_center, get_targets, randomNum, random_choice, round_pos, sleep,
  slice = [].slice;

Array.prototype.remove = function() {
  var arg, args, i, index, len, output;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  output = [];
  for (i = 0, len = args.length; i < len; i++) {
    arg = args[i];
    index = this.indexOf(arg);
    if (index !== -1) {
      output.push(this.splice(index, 1));
    }
  }
  if (args.length === 1) {
    output = output[0];
  }
  return output;
};

sleep = function(ms) {
  var results, start;
  start = new Date().getTime();
  results = [];
  while (new Date().getTime() - start < ms) {
    continue;
  }
  return results;
};

createSprite = function(file) {
  var texture;
  texture = PIXI.Texture.fromImage(file);
  return new PIXI.Sprite(texture);
};

get_targets = function(direction, x, y) {
  var targets;
  if (direction === 'left') {
    targets = gamestate.level.map_data[x - 1][y].things;
  }
  if (direction === 'right') {
    targets = gamestate.level.map_data[x + 1][y].things;
  }
  if (direction === 'up') {
    targets = gamestate.level.map_data[x][y - 1].things;
  }
  if (direction === 'down') {
    targets = gamestate.level.map_data[x][y + 1].things;
  }
  if (direction === 'here') {
    targets = gamestate.level.map_data[x][y].things;
  }
  return targets;
};

destroy_sprite = function(sprite) {
  if (sprite) {
    gamestate.level.stage.removeChild(sprite);
    return sprite.destroy();
  }
};

destroy_all_things_in_cell = function(cell) {
  var i, len, thing, things;
  things = cell.things;
  if (things.length > 0) {
    for (i = 0, len = things.length; i < len; i++) {
      thing = things[i];
      things.remove(thing);
      destroy_sprite(thing.sprite);
    }
  }
};

get_camera_center = function() {
  var x, y;
  x = camera.x + SCREEN_WIDTH / 2;
  y = camera.y + SCREEN_HEIGHT / 2;
  return {
    x: x,
    y: y
  };
};

center_camera_on = function(object) {
  camera.x = SCREEN_WIDTH / 2 - object.sprite.x;
  camera.y = SCREEN_HEIGHT / 2 - object.sprite.y;
};

randomNum = function(max, min) {
  if (min == null) {
    min = 0;
  }
  return Math.floor(Math.random() * (max - min) + min);
};

random_choice = function(list) {
  return list[Math.floor(Math.random() * list.length)];
};

round_pos = function(number) {
  var num;
  if (number <= 1) {
    return 1;
  }
  num = Math.round(number);
  return num;
};
