CELL_SIZE = 20
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 400
DEFAULT_MAP_SIZE = 50

camera = new(PIXI.Container)

player = new Player({x:25,y:25})

class Level
	map_data: []
	level: null
	stage: null
	start: {
		x: null
		y: null
	}

	constructor: (options) ->
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
		center_camera_on(player)

gamestate = {
	levels: {}
	level: null
	ready: false

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
}
