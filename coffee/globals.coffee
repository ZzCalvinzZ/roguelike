CELL_SIZE = 20
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 400
DEFAULT_MAP_SIZE = 50

stage = new(PIXI.Container)
camera = new(PIXI.Container)

player = new Player({x:25,y:25})


gamestate = {
	map_data: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
	level: 0
	map: []
	ready: false

	go_up_a_level: () ->
		@level -= 1
		@map = get_or_create_map(@level, @map_data)

	go_down_a_level: () ->
		@level += 1
		@map = get_or_create_map(@level, @map_data)
		
}

get_or_create_map = (level, map_data) ->
	map_data[level] = if map_data[level] is null then create_map_from_data() else map_data[level]
	return map_data[level]
