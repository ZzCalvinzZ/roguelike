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

	constructor: (options) ->
		if options.level?
			@level = options.level
			@create_stage()

		else
			console.log('need to pass in stage and level')

	create_map: () ->

		if @level is 0
			@map_data = map_utils.create_town_map()
		else
			@map_data = map_utils.create_map_from_data(@level, @map_data)

	create_stage: () ->
		@stage = new(PIXI.Container)

	reset_map_to_entrance: () ->
		pass

gamestate = {
	levels: {}
	level: null
	ready: false

	go_up_a_level: () ->
		next_level = @levels[@level.level - 1]

		@move_level(next_level)

	go_down_a_level: () ->
		next_level = @levels[@level.level + 1]
		@move_level(next_level)

	move_level: (next_level) ->
		if @level is not null
			@level.stage.visible = false

		if next_level of @levels
			@level = @levels[next_level]
			@level.stage.visible = true
		else
			@levels[next_level] = @level
			@level = new Level({level:next_level})
			@level.create_map()
}
