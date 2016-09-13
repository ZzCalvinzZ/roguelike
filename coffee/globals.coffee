DEBUG = false
MONSTER_DEBUG = false

CELL_SIZE = 20
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 400
DEFAULT_MAP_SIZE = 50
MIN_ROOM_SIZE = 4
MAX_ROOM_SIZE = 20
MONSTER_DENSITY = .04

camera = new(PIXI.Container)

player = new Player({x:25,y:25,visible:true})

class Level

	#monster: density
	MONSTERS: {
		1: {
			'Snake': 5
		}
	}

	constructor: (options) ->
		@map_data = []
		@rooms = []
		@cell_count = 0

		if options.level?
			@level = options.level
			@create_stage()
		else
			console.log('need to pass in level')

	create_map: (options) ->

		if @level is 0
			[@map_data, @start] = map_utils.create_town_map()
		else
			[@map_data, @start] = map_utils.create_map_from_data(@level)


	create_stage: () ->
		@stage = new(PIXI.Container)

	reset_map_to_entrance: () ->
		[player.x, player.y] = [@start.x, @start.y]
		player.draw()
		@map_data[player.x][player.y].things.push(player)
		center_camera_on(player)

	get_monsters: () ->
		@MONSTERS[@level]

gamestate = {
	levels: {}
	level: null
	ready: false
	map: () -> @level.map_data

	go_up_a_level: () ->
		next_level = @level.level - 1

		@move_level(next_level)

	go_down_a_level: () ->
		next_level = @level.level + 1
		@move_level(next_level)

	move_level: (next_level) ->
		if @level isnt null
			@level.stage.removeChild(player)
			@level.stage.visible = false

		if next_level of @levels
			@level = @levels[next_level]
			@level.stage.visible = true
		else
			@level = new Level({level:next_level})
			@level.create_map()
			@levels[next_level] = @level
		
		camera.addChild(gamestate.level.stage)
		@level.reset_map_to_entrance()

	cell_is_passable: (x, y, exclude_objects) ->
		if (x == @._fromX and y == @._fromY)
			return true

		for thing in gamestate.map()[x][y].things
			if thing.solid == true 
				return false

		return true
}
