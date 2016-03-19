function BaseObject(info) {
	this.sprite = info.sprite;
	this.info = {
		solid: info.solid || true,

	};
};
BaseObject.prototype = {
	constructor: BaseObject,

	draw: function () {

	},

}

var player = new BaseObject({
	sprite: new PIXI.Text('@', {'fill':'white', 'font':'17px Arial'}),
});

var stoneWall = new BaseObject({
	sprite: PIXI.Texture.fromImage('static/img/wall20.png'),
});
