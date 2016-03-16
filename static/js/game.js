$( document ).ready(function() {
	$('h2').css('color', 'white').css('text-align', 'center');
	var renderer = PIXI.autoDetectRenderer(800, 400,{backgroundColor : 0x000000});
	document.body.appendChild(renderer.view);

	// create textures
	//var monsterText = PIXI.Texture.fromImage('static/img/monster.png');

	//example creating a sprite
	//var monster = new PIXI.Sprite(monsterText);
	
	//example creating an animation
	//var walk = new PIXI.extras.MovieClip([walkText1, walkText2, walkText3])

	//create text
	//var momComingText = new PIXI.Text('... (better hide)', {'fill':'white'});


	//create keybindings
	var left = keyboard(37),
		up = keyboard(38),
		right = keyboard(39),
		down = keyboard(40),
		hide = keyboard(32);

	//create checks
	var isHiding = false;
	var hidePressed = false;

	//group hiding places
	var hidingSpots = [
		book,
		dresser,
		chest
	];

	// setup sounds
	var mainTrack = new Howl({
		urls: ['static/sound/ludumdaretrack.mp3'],
		autoplay: true,
		loop: true,
		volume: 0.3,
	});

	resetGame();

	//add sprites to stage
	//stage.addChild(room);

	//main loop
	gameLoop();

	function gameLoop() {
		requestAnimationFrame(gameLoop);

		// render the container
		renderer.render(stage);

		timer += 1
	}


});
