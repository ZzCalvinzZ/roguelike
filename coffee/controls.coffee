keyboard = (keyCodes) ->
	key = {}
	key.codes = keyCodes
	key.first = true
	key.isDown = false
	key.isUp = true
	key.press = undefined
	key.release = undefined

	key.downHandler = (event) ->
		if event.keyCode in key.codes
			if key.isUp and key.press

				key.isDown = true
				key.isUp = false

				press = () ->
					if key.isDown
						key.press() 

						if key.first
							timeOut = setTimeout(press, 175)
							key.first = false
						else
							timeOut = setTimeout(press, 75)

				press()

				event.preventDefault()
		return

	key.upHandler = (event) ->
		if event.keyCode in key.codes
			if key.isDown and key.release
				key.release()
				key.isDown = false
				key.isUp = true
				key.first = true
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

	do_direction = (direction) ->
		if player.opening is true
			player.open(direction)
			player.opening = false
		else
			player.move(direction)


	left.press = ->
		do_direction('left')

	left.release = ->

	right.press = ->
		do_direction('right')

	right.release = ->

	up.press = ->
		do_direction('up')

	up.release = ->

	down.press = ->
		do_direction('down')

	down.release = ->

	open.press = ->
		player.opening = true

	open.release = ->
