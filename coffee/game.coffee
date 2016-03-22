player = new Player({x:2,y:2})
stage = new(PIXI.Container)
camera = new(PIXI.Container)

$(document).ready ->

	gameLoop = ->
		requestAnimationFrame(gameLoop)
		# render the container
		renderer.render(camera)
		return

	renderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT, backgroundColor: 0x000000)
	document.body.appendChild(renderer.view)

	setupKeybindings()

	# setup sounds
	#var mainTrack = new Howl({
	#urls: ['static/sound/ludumdaretrack.mp3'],
	#autoplay: true,
	#loop: true,
	#volume: 0.3,
	#});
	
	player.draw()

	i = 0
	while i < DEFAULT_MAP_SIZE
		for j in [1..2]
			stoneWall = if j is 1 then new StoneWall({x:i, y:0}) else new StoneWall({x:i, y:DEFAULT_MAP_SIZE - 1})
			map[stoneWall.x][stoneWall.y].push(stoneWall)
			stoneWall.draw()
		i++

	i = 1
	while i < DEFAULT_MAP_SIZE
		for j in [1..2]
			stoneWall = if j is 1 then new StoneWall({x:0, y:i}) else new StoneWall({x:DEFAULT_MAP_SIZE - 1, y:i})
			map[stoneWall.x][stoneWall.y].push(stoneWall)
			stoneWall.draw()
		i++

	camera.addChild(stage)
	#main loop
	gameLoop()

	return
