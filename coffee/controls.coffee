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
	open = keyboard([79])

	left.press = ->
		player.move('left')

	left.release = ->

	right.press = ->
		player.move('right')

	right.release = ->

	up.press = ->
		player.move('up')

	up.release = ->

	down.press = ->
		player.move('down')

	down.release = ->

	open.press = ->
		player.opening = true

	open.release = ->
