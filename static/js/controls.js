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


	right.press = function() {
		if (!isHiding){
			monster.vx = 3;
			monster.vy = 0;
		}
	};

	right.release = function() {
		if (!left.isDown && monster.vy === 0) {
			monster.vx = 0;
		}
	};

	up.press = function() {
		if (!isHiding){
			monster.vx = 0;
			monster.vy = -2;
		}
	};

	up.release = function() {
		if (!down.isDown && monster.vx === 0) {
			monster.vy = 0;
		}
	};

	down.press = function() {
		if (!isHiding){
			monster.vx = 0;
			monster.vy = 2;
		}
	};

	down.release = function() {
		if (!up.isDown && monster.vx === 0) {
			monster.vy = 0;
		}
	};

}

