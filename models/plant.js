// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

// importing the commentSchema
const commentSchema = require('./comment')

const PlantSchema = new Schema(
	{
		name: { type: String, required: true },
		sciName: { type: String, required: true },
        sunniness: { type: String, required: true },
		plantFrom: { type: Boolean, required: true },
		description: { type: String, required: true },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		},
		comments: [commentSchema]
	},
	{ timestamps: true }
)

const Plant = model('Plant', PlantSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Plant
