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

	characters.player.x = 0;
	characters.player.y = 0;
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
	for (i=0;i< 5;i++) {
		var wall = new PIXI.Sprite(textures.stoneWall);
		wall.x = i*CELL_SIZE;
		wall.y = 0;
		stage.addChild(wall);
	}

	//main loop
	gameLoop();

	function gameLoop() {
		requestAnimationFrame(gameLoop);

		// render the container
		renderer.render(stage);
	}


});
