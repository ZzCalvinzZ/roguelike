keyboard = (keyCodes) ->
	key = {}
	key.codes = keyCodes
	key.started = 0
	key.first = true
	key.isDown = false
	key.isUp = true
	key.press = undefined
	key.release = undefined
	timeOut = null

	key.downHandler = (event) ->
		if event.keyCode in key.codes and gamestate.ready
			if key.isUp and key.press
				clearTimeout(timeOut)
				
				press = () ->
					if key.isDown 
						key.press() 
						if key.first
							timeOut = setTimeout(press, 200)
							key.first = false
						else
							timeOut = setTimeout(press, 75)

				key.isDown = true
				key.isUp = false

				press()

				event.preventDefault()
		return

	key.upHandler = (event) ->
		if event.keyCode in key.codes and gamestate.ready
			if key.isDown and key.release
				key.release()
				key.isDown = false
				key.isUp = true
				key.first = true
				event.preventDefault()
		return

	key.pressHandler = (event) ->
		charStr = String.fromCharCode(event.keyCode);

		if charStr in key.codes and gamestate.ready
			key.press()
	
	#Attach event listeners
	window.addEventListener 'keydown', key.downHandler.bind(key), false
	window.addEventListener 'keyup', key.upHandler.bind(key), false
	window.addEventListener 'keypress', key.pressHandler.bind(key), false

	return key

setupKeybindings = ->
	left = keyboard([37, 72, 52])
	up = keyboard([38, 75, 56])
	right = keyboard([39, 76, 54])
	down = keyboard([40, 74, 53])
	open = keyboard([79])
	descend = keyboard(['>'])
	wait = keyboard([' '])

	take_turn = () ->
		player.move_enemies()

	do_direction = (direction) ->
		turn_taken
		if player.opening is true
			turn_taken = player.open(direction)
			player.opening = false
		else
			turn_taken = player.move(direction)


		if turn_taken
			take_turn()

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

	descend.press = ->
		player.use_stairs()

	descend.release = ->

	wait.press = ->
		take_turn()

	wait.release = ->
