import mySeed from "./seedRaw.json"
console.log('importing seed file')

const mongoose = require('./connection')
const Plant = require('./plant')

///////////////////////////////////////
// Seed Script code
///////////////////////////////////////
const db = mongoose.connection

db.on('open', () => {
    // bring in the array of starter plants
    const startPlants = mySeed.map((seedPlant) => {
        // name
        // scientific_name
        // thumbnail_url
        // The map() method creates a new array populated with the results of calling a provided function on every element in the calling array.
        const myPlant = {
            // here goes my key value pairs from json
        
        }
        return myPlant
    })

    // delete all the existing plants
    Plant.deleteMany({ owner: null })
        .then(deletedPlants => {
            console.log('this is what .deleteMany returns', deletedPlants)

            // create a bunch of new plants from startPlants
            Plant.create(startPlants)
                .then(data => {
                    console.log('here are the newly created plants', data)
                    // always close connection to the db
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    // always close connection to the db
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            // always close connection to the db
            db.close()
        })
})
