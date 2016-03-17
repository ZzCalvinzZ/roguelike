function keyboard(keyCodes) {
	var key = {};
	key.codes = keyCodes;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;

	//The `downHandler`
	key.downHandler = function(event) {
		if ($.inArray(event.keyCode, key.codes) >= 0) {
			if (key.isUp && key.press) key.press();
			key.isDown = true;
			key.isUp = false;
			}
		event.preventDefault();
	};

	//The `upHandler`
	key.upHandler = function(event) {
		if ($.inArray(event.keyCode, key.codes) >= 0) {
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

	var left = keyboard([37, 72]),
		up = keyboard([38, 75]),
		right = keyboard([39, 76]),
		down = keyboard([40, 74]);

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

