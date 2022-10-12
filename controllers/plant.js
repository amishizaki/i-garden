// Import Dependencies
const express = require('express')
const axios = require('axios')
const Plant = require('../models/plant')

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

// index ALL
router.get('/', (req, res) => { 
	// axios.get(`https://www.growstuff.org/api/v1/crops`)
	axios.get(`https://www.growstuff.org/crops.json`)
		.then(apiRes => {
			// console.log(apiRes.data) // this is an array of objects
			//declaring plants so i do not have to 'drill' as deep 
			const plants = apiRes.data
			console.log('this is plants', plants)
			//console.log('this is the plant index', plant)
			//rendering(showing all the plants from API)
			res.render('plants/index', { plants })
		})
		
		.catch(err=>{
			console.error('Error:', err)
			res.json(err)
		})
})
	// Plant.find({})
	// 	.then(plants => {
	// 		const username = req.session.username
	// 		const loggedIn = req.session.loggedIn
			
	// 		res.render('plants/index', { plants, username, loggedIn })
	// 	})
	// 	.catch(error => {
	// 		res.redirect(`/error?error=${error}`)
	// 	})

// index that shows only the user's plants
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Plant.find({ owner: userId })
		.then(plants => {
			res.render('plants/index', { plants, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('plants/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false

	req.body.owner = req.session.userId
	Plant.create(req.body)
		.then(plant => {
			console.log('this was returned from create', plant)
			res.redirect('/plants')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:name/edit', (req, res) => {
	// we need to get the id
	const plantId = req.params.id
	Plant.findById(plantId)
		.then(plant => {
			res.render('plants/edit', { plant })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:name', (req, res) => {
	const plantId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	Plant.findByIdAndUpdate(plantId, req.body, { new: true })
		.then(plant => {
			res.redirect(`/plants/${plant.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:name', (req, res) => {
	const plantName = req.params.name
	// console.log('this is the plant name', plantName)
	axios.get(`https://www.growstuff.org/crops/${plantName}.json`)
		.then(apiRes => {
			// console.log('this is the api res', apiRes)
			const onePlant = apiRes.data
			console.log('this is the plant', onePlant)
            // const {username, loggedIn, userId} = req.session
			res.render('plants/show', { plant:onePlant })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const plantId = req.params.id
	Plant.findByIdAndRemove(plantId)
		.then(plant => {
			res.redirect('/plants')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
