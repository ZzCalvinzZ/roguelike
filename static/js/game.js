$( document ).ready(function() {
	$('h2').css('color', 'white').css('text-align', 'center');
	var renderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT,{backgroundColor : 0x000000});
	document.body.appendChild(renderer.view);

	var stage = new PIXI.Container();

	// create textures
	//var monsterText = PIXI.Texture.fromImage('static/img/monster.png');

	//example creating a sprite
	//var monster = new PIXI.Sprite(monsterText);
	
	//example creating an animation
	//var walk = new PIXI.extras.MovieClip([walkText1, walkText2, walkText3])

	characters.player.x = 25;
	characters.player.y = 25;
	characters.player.height = 115;

	setupKeybindings();

	// setup sounds
	//var mainTrack = new Howl({
		//urls: ['static/sound/ludumdaretrack.mp3'],
		//autoplay: true,
		//loop: true,
		//volume: 0.3,
	//});

	//add sprites to stage
	for (key in characters) {
		stage.addChild(characters[key]);
	}

	function addWall (x, y) {
		var wall = new PIXI.Sprite(textures.stoneWall);
		wall.x = x;
		wall.y = y;
		stage.addChild(wall);
	}

	for (i=0;i < SCREEN_WIDTH / CELL_SIZE;i++) {
		addWall(i * CELL_SIZE, 0);
		addWall(i * CELL_SIZE, SCREEN_HEIGHT - CELL_SIZE);
	}
	for (i=1; i< (SCREEN_HEIGHT / CELL_SIZE)-1; i++) {
		addWall(0, i * CELL_SIZE);
		addWall(SCREEN_WIDTH - CELL_SIZE, i * CELL_SIZE);
	
	}

	//main loop
	gameLoop();

	function gameLoop() {
		requestAnimationFrame(gameLoop);

		// render the container
		renderer.render(stage);
	}


});

