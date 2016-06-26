$(document).ready ->

	#readjust canvas when adjusting window
	window.onresize = (event) ->
		SCREEN_WIDTH = window.innerWidth
		SCREEN_HEIGHT = window.innerHeight
		renderer.resize(SCREEN_WIDTH, SCREEN_HEIGHT)

	SCREEN_HEIGHT = $(window).height()
	SCREEN_WIDTH = $(window).width()

	gameLoop = ->
		requestAnimationFrame(gameLoop)
		# render the container
		renderer.render(camera)
		return

	renderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT, backgroundColor: 0x000000)
	document.body.appendChild(renderer.view)

	setupKeybindings()
	gamestate.move_level(0)
	gamestate.ready = true

	# setup sounds
	#var mainTrack = new Howl({
	#urls: ['static/sound/ludumdaretrack.mp3'],
	#autoplay: true,
	#loop: true,
	#volume: 0.3,
	#});
	
	player.draw()
	center_camera_on(player)

	camera.addChild(gamestate.level.stage)
	#main loop
	gameLoop()

	return
