sleep = (ms) ->
  start = new Date().getTime()
  continue while new Date().getTime() - start < ms

createSprite = (file) ->
	texture = PIXI.Texture.fromImage(file)
	new PIXI.Sprite(texture)

get_targets = (direction, x, y) ->
		targets = gamestate.map[x - 1][y] if direction is 'left'
		targets = gamestate.map[x + 1][y] if direction is 'right'
		targets = gamestate.map[x][y - 1] if direction is 'up'
		targets = gamestate.map[x][y + 1] if direction is 'down'
		targets = gamestate.map[x][y] if direction is 'here'

		return targets

destroy_sprite = (sprite) ->
	if sprite
		stage.removeChild(sprite)
		sprite.destroy()

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
