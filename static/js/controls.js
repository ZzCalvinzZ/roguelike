
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
