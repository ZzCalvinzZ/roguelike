function keyboard(keyCode) {
	var key = {};
	key.code = keyCode;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;

	//The `downHandler`
	key.downHandler = function(event) {
		if (event.keyCode === key.code) {
			if (key.isUp && key.press) key.press();
			key.isDown = true;
			key.isUp = false;
			}
		event.preventDefault();
	};

	//The `upHandler`
	key.upHandler = function(event) {
		if (event.keyCode === key.code) {
			if (key.isDown && key.release) key.release();
			key.isDown = false;
			key.isUp = true;
			}
		event.preventDefault();
	};

	//Attach event listeners
	window.addEventListener(
		"keydown", key.downHandler.bind(key), false
	);
	window.addEventListener(
		"keyup", key.upHandler.bind(key), false
	);
	return key;
}

function setupKeybindings() {

	var left = keyboard(37),
		up = keyboard(38),
		right = keyboard(39),
		down = keyboard(40),
		hide = keyboard(32);

	left.press = function() {
		characters.player.x -= CELL_SIZE;
	};

	left.release = function() {
	};

	right.press = function() {
		characters.player.x += CELL_SIZE;
	};

	right.release = function() {
	};

	up.press = function() {
		characters.player.y -= CELL_SIZE;
	};

	up.release = function() {
	};

	down.press = function() {
		characters.player.y += CELL_SIZE;
	};

	down.release = function() {
	};

}

