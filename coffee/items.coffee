class BaseItem

	constructor: (options) ->
		super(options)
		@character = options.character || null
		@weight = options.weight || 0

		# 'left_hand', 'head', 'right_shoulder', etc...
		@body_parts = options.body_parts || ''
		@modifiers = options.modifiers || {}

		@effects = options.effects || []

class Weapon extends BaseItem

	constructor: (options) ->
		super(options)
