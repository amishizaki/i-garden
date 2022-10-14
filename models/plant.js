// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

// importing the commentSchema
const commentSchema = require('./comment')
const favoriteSchema = require('./favorite')

const PlantSchema = new Schema(
	{
		name: { type: String, required: true },
		scientific_name: { type: String, required: true },
		description: { type: String, required: false },
		perrenial: { type: String, required: false },
		sun_requirement: { type: String, required: false },
		image: { type: Object, required: false },
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		comments: [commentSchema],
		favorites: [favoriteSchema]
	},
{ timestamps: true }
)

const Plant = model('Plant', PlantSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Plant

//  This is what our plant objects look like

//     _index: 'crops_production_20200824003628370',
//     _type: '_doc',
//     _id: '520',
//     _score: 3.871201,
//     name: 'genovese basil',
//     description: null,
//     slug: 'genovese-basil',
//     alternate_names: [],
//     scientific_names: [ 'ocimum basilicum' ],
//     photos_count: 5,
//     plantings_count: 14,
//     harvests_count: 1,
//     planters_ids: [
//       1781,   44,  197, 134,
//        509,   41,   41, 509,
//        433, 1878, 1643,  15,
//         15,   15
//     ],
//     has_photos: true,
//     thumbnail_url: 'https://farm5.staticflickr.com/4276/34997009072_4b1598f6a9_z.jpg',
//     scientific_name: 'ocimum basilicum',
//     created_at: 1425507569,
//     id: '520'
//   }
// ]
