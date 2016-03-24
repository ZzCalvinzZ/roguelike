$(document).ready ->

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

	#i = 15
	#while i < 30
		#for j in [1..2]
			#stoneWall = if j is 1 then new StoneWall({x:i, y:15}) else new StoneWall({x:i, y:29})
			#map[stoneWall.x][stoneWall.y].push(stoneWall)
			#stoneWall.draw()
		#i++

	#i = 16
	#while i < 30
		#for j in [1..2]
			#if i is 23
				#stoneWall = if j is 1 then new Door({x:15, y:i}) else new Door({x: 29, y:i})
			#else
				#stoneWall = if j is 1 then new StoneWall({x:15, y:i}) else new StoneWall({x: 29, y:i})
			#map[stoneWall.x][stoneWall.y].push(stoneWall)
			#stoneWall.draw()
		#i++

	camera.addChild(stage)
	#main loop
	gameLoop()

	return
