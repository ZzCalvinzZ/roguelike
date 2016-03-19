function BaseObject(info) {
	this.sprite = info.sprite;
	this.info = {
		solid: info.solid || true,

	};
}
BaseObject.prototype = {
	constructor: BaseObject,

	draw: function (x, y) {
		var spriteInstance = new PIXI.Sprite(stoneWall.sprite);
		spriteInstance.x = x;
		spriteInstance.y = y;
		return spriteInstance;
	},

};

function Player(info){
	info.sprite = new PIXI.Text('@', {'fill':'white', 'font':'17px Arial'}),
	BaseObject.call(this, info);
}


var stoneWall = new BaseObject({
	sprite: PIXI.Texture.fromImage('static/img/wall20.png'),
});
