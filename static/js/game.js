var stage = new PIXI.Container();
var camera = new PIXI.Container();

$( document ).ready(function() {
	$('h2').css('color', 'white').css('text-align', 'center');
	var renderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT,{backgroundColor : 0x000000});
	document.body.appendChild(renderer.view);

	// create textures
	//var monsterText = PIXI.Texture.fromImage('static/img/monster.png');

	//example creating a sprite
	//var monster = new PIXI.Sprite(monsterText);
	
	//example creating an animation
	//var walk = new PIXI.extras.MovieClip([walkText1, walkText2, walkText3])

	player.sprite.x = 20;
	player.sprite.y = 20;

	setupKeybindings();

	// setup sounds
	//var mainTrack = new Howl({
		//urls: ['static/sound/ludumdaretrack.mp3'],
		//autoplay: true,
		//loop: true,
		//volume: 0.3,
	//});

	stage.addChild(player.sprite);

	function addWall (x, y) {
		var wall = new PIXI.Sprite(stoneWall.sprite);
		wall.x = x;
		wall.y = y;
		stage.addChild(wall);
	}

	for (i=0;i < SCREEN_WIDTH / CELL_SIZE;i++) {
		stage.addChild(stoneWall.create(i * CELL_SIZE, 0));
		stage.addChild(stoneWall.create(i * CELL_SIZE, SCREEN_HEIGHT - CELL_SIZE));
	}

	for (i=1; i< (SCREEN_HEIGHT / CELL_SIZE)-1; i++) {
		stage.addChild(stoneWall.create(0, i * CELL_SIZE));
		stage.addChild(stoneWall.create(SCREEN_WIDTH - CELL_SIZE, i * CELL_SIZE));
	}

	camera.addChild(stage);

	//main loop
	gameLoop();

	function gameLoop() {
		requestAnimationFrame(gameLoop);

		// render the container
		renderer.render(camera);
	}


});

