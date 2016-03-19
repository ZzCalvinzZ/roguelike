keyboard = (keyCodes) ->
	key = {}
	key.codes = keyCodes
	key.isDown = false
	key.isUp = true
	key.press = undefined
	key.release = undefined

	key.downHandler = (event) ->
		if event.keyCode in key.codes
			if key.isUp and key.press
				key.press()
				key.isDown = true
				key.isUp = false
				event.preventDefault()
		return

	key.upHandler = (event) ->
		if event.keyCode in key.codes
			if key.isDown and key.release
				key.release()
				key.isDown = false
				key.isUp = true
				event.preventDefault()
		return

	#Attach event listeners
	window.addEventListener 'keydown', key.downHandler.bind(key), false
	window.addEventListener 'keyup', key.upHandler.bind(key), false
	return key

setupKeybindings = ->
	left = keyboard([37, 72])
	up = keyboard([38, 75])
	right = keyboard([39, 76])
	down = keyboard([40, 74])

	left.press = ->
		player.sprite.x -= CELL_SIZE
		if player.sprite.x < SCREEN_WIDTH / 3 - camera.x
			camera.x += 25
		return

	left.release = ->

	right.press = ->
		player.sprite.x += CELL_SIZE
		if player.sprite.x > 2 * SCREEN_WIDTH / 3 - camera.x
			camera.x -= 25
		return

	right.release = ->

	up.press = ->
		player.sprite.y -= CELL_SIZE
		if player.sprite.y < SCREEN_HEIGHT / 3 - camera.y
			camera.y += 25
		return

	up.release = ->

	down.press = ->
		player.sprite.y += CELL_SIZE
		if player.sprite.y > 2 * SCREEN_HEIGHT / 3 - camera.y
			camera.y -= 25
		return

	down.release = ->

