// Import Dependencies
const express = require('express')
const axios = require('axios')
const Plant = require('../models/plant')
// Anoher wonderful question, remove this unneeded and unused
const { index } = require('../models/comment')
// is {index} supposed to be something else?

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes


/////////////////////////////////////
///// All Plants
////////////////////////////////////
// index ALL
// Currently, does not include user created plants
router.get('/', (req, res) => { 
	// axios.get(`https://www.growstuff.org/api/v1/crops`)
	axios.get(`https://www.growstuff.org/crops.json`)
		.then(apiRes => {
			const { username, userId, loggedIn } = req.session
			// console.log(apiRes.data) // this is an array of objects
			//declaring plants so i do not have to 'drill' as deep 
			const plants = apiRes.data
			// console.log('this is plants', plants)
			//console.log('this is the plant index', plant)
			//rendering(showing all the plants from API)
			res.render('plants/index', { plants, username, loggedIn, userId })
		})
		
		.catch(err=>{
			// Nit: remove console.error
			console.error('Error:', err)
			res.json(err)
		})
})

/////////////////////////////////////
///// User's Plants
////////////////////////////////////
// index that shows only the user's plants
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Plant.find({ owner: userId })
		.then(plants => {
			res.render('plants/userIndex', { plants, username, userId, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

/////////////////////////////////////
///// User's Plants & API Plants - not working right now bc I feel tangled in data
////////////////////////////////////
// router.get('/', (req, res) => {
//     // destructure user info from req.session
// 	Plant.find({ owner: userId })
// 		.populate("comments.author", "username")
// 		.then(plants => {
// 			const { username, userId, loggedIn } = req.session
// 			res.render('plants/show', { plants, username, userId, loggedIn })
// 		})
// 		.catch(error => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

/////////////////////////////////////
///// New Plant form
////////////////////////////////////
// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId
	console.log('this is the userId', userId)
	res.render('plants/new', { username, loggedIn, userId })
})

/////////////////////////////////////
///// Creates new plant
////////////////////////////////////
// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false
	
	req.body.owner = req.session.userId
	Plant.create(req.body)
	// Nit: remove unused `plant`
		.then(plant => {
			// console.log('this was returned from create', plant)
			// should I have this redirect or render the new plant page?
			res.redirect('/plants/mine/')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})


/////////////////////////////////////
///// Edit Page
////////////////////////////////////
// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	const { username, userId, loggedIn } = req.session
	// we need to get the id
	const plantId = req.params.id
	Plant.findById(plantId)
		.then(plant => {
			res.render('plants/edit', { plant, username, userId, loggedIn })
		})
		// .then(() => {
		// 	res.redirect('/:id')
		// })
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

/////////////////////////////////////
///// Submit New Edits
////////////////////////////////////
// update route
router.put('/:id', (req, res) => {
	// console.log('request', req.body)
	// console.log('request params', req.params)
	const plantId = req.params.id
	// req.body.ready = req.body.ready === 'on' ? true : false

	Plant.findByIdAndUpdate(plantId, req.body, { new: true })
	.then(plant => {
			// console.log('plant, after find and update', plant)
			res.redirect(`/plants/mine/${plant._id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show user created plants
router.get('/mine/:id', (req, res) => {
	const { username, userId, loggedIn } = req.session
	Plant.findById(req.params.id)
	// Nit: choose either double or single quotes
		.populate("comments.author", "username")
		.then(plant => {
			res.render('plants/showUserPlant', { plant, username, userId, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// show api plants
// SHOW REQUEST route
router.get('/:id', (req, res) => {
	const plantId = req.params.id
	// console.log('this is the plant name', plantName)
	axios.get(`https://www.growstuff.org/crops/${plantId}.json`)
		// .populate("comments.author", "username")
		.then(apiRes => {
			const { username, userId, loggedIn } = req.session
			// console.log('this is the api res', apiRes)
			const onePlant = apiRes.data
			// The code below was used to add a few plants to the mongoDB instead of using a for loop?
			// let newPlant = {
			// 	name: onePlant.name, 
			// 	scientific_name: onePlant.openfarm_data.attributes.binomial_name,
			// 	perrenial: onePlant.perrenial,
			// 	sun_requirement: onePlant.openfarm_data.attributes.sun_requirements,
			// 	image: {url: onePlant.openfarm_data.attributes.main_image_path},

			// 	}
				// Plant.create(newPlant)
				// 	.then(plant => {
				// 		console.log('axios show create plant', plant)
				// 		// should I have this redirect or render the new plant page?
				// 		// res.redirect('/plants/mine/')
				// 	})
				// 	.catch(error => {
				// 		res.redirect(`/error?error=${error}`)
				// 	})
			// console.log('this is the plant', onePlant)
            // const {username, loggedIn, userId} = req.session
			res.render('plants/show', { plant:onePlant, username, userId, loggedIn })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// name: { type: String, required: true },
		// scientific_name: { type: String, required: true },
		// description: { type: String, required: false },
		// perrenial: { type: String, required: false },
		// sun_requirement: { type: String, required: false },
		// image: { type: Object, required: false },

// delete route
router.delete('/:id', (req, res) => {
	const plantId = req.params.id
	Plant.findByIdAndRemove(plantId)
	// Nit: can remove unused `plant`
		.then(plant => {
			res.redirect('/plants')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
