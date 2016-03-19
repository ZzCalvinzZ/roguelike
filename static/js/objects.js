var baseObject = {
	solid: true,
};

var player = _.create(baseObject, { 
	sprite: new PIXI.Text('@', {'fill':'white', 'font':'17px Arial'}),
});

var stoneWall = _.create(baseObject, {
	sprite: PIXI.Texture.fromImage('static/img/wall20.png'),
});
