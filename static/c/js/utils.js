var center_camera_on, createSprite, destroy_all_things_in_cell, destroy_sprite, get_camera_center, get_targets, randomNum, random_choice, sleep;

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
  var i, len, results, sprite, sprites;
  sprites = cell.things.length;
  if (sprites > 0) {
    results = [];
    for (i = 0, len = sprites.length; i < len; i++) {
      sprite = sprites[i];
      results.push(destroy_sprite(sprite));
    }
    return results;
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
