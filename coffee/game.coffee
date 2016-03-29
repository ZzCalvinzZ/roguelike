$(document).ready ->
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

	map = create_town_map()

	# setup sounds
	#var mainTrack = new Howl({
	#urls: ['static/sound/ludumdaretrack.mp3'],
	#autoplay: true,
	#loop: true,
	#volume: 0.3,
	#});
	
	player.draw()

	camera.addChild(stage)
	#main loop
	gameLoop()

	return
