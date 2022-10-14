////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Plant = require("../models/plant")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// POST
// only loggedIn users can post comments
router.post("/:plantId", (req, res) => {
    const plantId = req.params.plantId

    if (req.session.loggedIn) {
        // we want to adjust req.body so that the author is automatically assigned
        req.body.author = req.session.userId
    } else {
        res.sendStatus(401)
    }
    // find a specific plant
    Plant.findById(plantId)
        // do something if it works
        //  --> send a success response status and maybe the comment? maybe the plant?
        .then(plant => {
            // push the comment into the plant.comments array
            plant.comments.push(req.body)
            // we need to save the plant
            return plant.save()
        })
        .then(plant => {
            // res.status(200).json({ plant: plant })
            res.redirect(`/plants/mine/${plant.id}`)
        })
        // do something else if it doesn't work
        //  --> send some kind of error depending on what went wrong
        .catch(err => res.redirect(`/error?error=${err}`))
})

// DELETE
// only the author of the comment can delete it
router.delete('/delete/:plantId/:commId', (req, res) => {
    // isolate the ids and save to vars for easy ref
    const plantId = req.params.plantId 
    const commId = req.params.commId
    console.log('this is the commId', commId)
    // get the plant
    Plant.findById(plantId)
        .then(plant => {
            // get the favorite
            // subdocs have a built in method that you can use to access specific subdocuments when you need to.
            // this built in method is called .id()
            const theComment = plant.comments.id(commId)
            console.log('this is the comment that was found', theComment)
            // make sure the user is logged in
            if (req.session.loggedIn) {
                // only let the author of the comment delete it
                if (theComment.author == req.session.userId) {
                    
                    // find some way to remove the comment
                    // here's another built in method
                    theComment.remove()
                    plant.save()
                    res.redirect(`/plants/mine/${plant.id}`)
                    // return the saved plant
                    // return plant.save()
                } else {
                    const err = 'you%20are%20not%20authorized%20for%20this%20action'
                    res.redirect(`/error?error=${err}`)
                }
            } else {
                const err = 'you%20are%20not%20authorized%20for%20this%20action'
                res.redirect(`/error?error=${err}`)
            }
        })
        // send an error if error
        .catch(err => res.redirect(`/error?error=${err}`))

})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
