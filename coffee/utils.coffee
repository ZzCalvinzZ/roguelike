sleep = (ms) ->
  start = new Date().getTime()
  continue while new Date().getTime() - start < ms

createSprite = (file) ->
	texture = PIXI.Texture.fromImage(file)
	new PIXI.Sprite(texture)

get_targets = (direction, x, y) ->
		targets = gamestate.level.map_data[x - 1][y].things if direction is 'left'
		targets = gamestate.level.map_data[x + 1][y].things if direction is 'right'
		targets = gamestate.level.map_data[x][y - 1].things if direction is 'up'
		targets = gamestate.level.map_data[x][y + 1].things if direction is 'down'
		targets = gamestate.level.map_data[x][y].things if direction is 'here'

		return targets

destroy_sprite = (sprite) ->
	if sprite
		gamestate.level.stage.removeChild(sprite)
		sprite.destroy()

destroy_all_things_in_cell = (cell) ->
	sprites = cell.things.length
	if sprites > 0
		for sprite in sprites
			destroy_sprite(sprite)

get_camera_center = () ->
	x =  camera.x + SCREEN_WIDTH  / 2
	y =  camera.y + SCREEN_HEIGHT  / 2

	return {
		x: x,
		y: y,
	}

center_camera_on = (object) ->
	camera.x = SCREEN_WIDTH / 2 - object.sprite.x
	camera.y = SCREEN_HEIGHT / 2 - object.sprite.y 
	return

randomNum = (max,min=0) ->
	return Math.floor(Math.random() * (max - min) + min)

random_choice = (list) ->
	return list[Math.floor(Math.random() * list.length)]
