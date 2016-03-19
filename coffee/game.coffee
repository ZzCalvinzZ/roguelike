player = new Player({})
stage = new (PIXI.Container)
camera = new (PIXI.Container)

$(document).ready ->

	gameLoop = ->
		requestAnimationFrame(gameLoop)
		# render the container
		renderer.render(camera)
		return

	renderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT, backgroundColor: 0x000000)
	document.body.appendChild(renderer.view)

	player.sprite.x = 20
	player.sprite.y = 20
	setupKeybindings()

	# setup sounds
	#var mainTrack = new Howl({
	#urls: ['static/sound/ludumdaretrack.mp3'],
	#autoplay: true,
	#loop: true,
	#volume: 0.3,
	#});

	stage.addChild player.sprite
	i = 0
	while i < SCREEN_WIDTH / CELL_SIZE
		stoneWall = new StoneWall({})
		stoneWall.draw i * CELL_SIZE, 0
		stoneWall.draw i * CELL_SIZE, SCREEN_HEIGHT - CELL_SIZE
		i++
	i = 1

	while i < SCREEN_HEIGHT / CELL_SIZE - 1
		stoneWall = new StoneWall({})
		stoneWall.draw 0, i * CELL_SIZE
		stoneWall.draw SCREEN_WIDTH - CELL_SIZE, i * CELL_SIZE
		i++
	camera.addChild stage
	#main loop
	gameLoop()

	return
