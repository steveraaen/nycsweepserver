const fs = require('fs');
const mongoose = require('mongoose');
const moment = require('moment')
const Sign = require("../models/Allsigns.js");
// console.log(Object.keys(Sign))
// const signFile = fs.readFileSync('../backend/dedupedBrooms.geojson');
// const signsObj = JSON.parse(signFile);

mongoose.connect(process.env.ATLAS_URI, {
}).then(function() {
	console.log('Mongo connected via mongoose')
})
module.exports = function(app) {
    async function findSignsNear(lo, la) {
        try {
        const signs = await Sign.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lo, la]
                    },
                    $maxDistance: 5000 * 1.60934
                }
            }
        }).limit(500); 
            return signs;
            } catch (error) {
        console.error(error);
        return [];
        }
    }
    app.get("/api/location", (req, res) => {
    //    const result =  findSignsNear(req.query.longitude, req.query.latitude).then( (error, doc) => {
    //     console.log(doc)
    //    })
    Sign.find({
        // "properties.T": rte, // Uncomment if needed
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [req.query.longitude, req.query.latitude]
            },
            $maxDistance: 5000 * 1.60934
          }
        }
      })
      .limit(500)
      .exec()
      .then(doc => {
        res.json(doc);
      })
      .catch(error => {
        console.error(error);
      });

      });

    app.get("/mon/:coordinates?", function(req, res) {
   
    //     if(req.query.day) {
    //     var today = req.query.day  
    //     } else {
    //         var today = moment().format("dddd").toUpperCase()            
    //     }
    // var d = today.substring(0, 3)
// console.log(req.query)
        // var lat = Number(req.query.lat).toFixed(6)
        // var lng = Number(req.query.lng).toFixed(6)
       
        findSignsNear().then( (error, doc) => {
            if (error) {
                console.log(error);
            } else {   
                // console.log(doc)
                res.json(doc);
            }
        });
    });

        app.get("/mycar/:coordinates?", function(req, res) {
            console.log(req.query)
            if(req.query.day) {
            var today = req.query.day  
            } else {
        var today = moment().format("dddd").toUpperCase()            
            }
        var d = today.substring(0, 3)
            var lat = parseFloat(req.query.coordinates[1]).toFixed(6)
            var lng = parseFloat(req.query.coordinates[0]).toFixed(6)
        
            var rte = new RegExp(".*^" + d + ".*")
            signs.find({
            /* "properties.T": rte,*/
                geometry: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lng, lat ]
                        },
                        $maxDistance: 1000
                    }
                }
            }, function(error, doc) {
                if (error) {
                    console.log(error);
                } else {             
                    res.json(doc);
                }
            }).limit(10);
    });
    app.get("/validateCoords", function(req, res) {
        async function validateCoordinates() {
            const Sign = mongoose.model('Sign'); // Adjust if your model name is different
            let totalDocuments = 0;
            let invalidDocuments = 0;      
            try {
            // Get total count
            totalDocuments = await Sign.countDocuments();     
            // Use a cursor for efficient iteration over large collections
            const cursor = Sign.find().cursor();     
            for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
                console.log(doc)
                if (!isValidCoordinate(doc.geometry.coordinates)) {
                console.log(`Invalid coordinate found: ${doc._id}, ${doc.geometry.coordinates}`);
                invalidDocuments++;
                }
            }      
            console.log(`Total documents: ${totalDocuments}`);
            console.log(`Invalid documents: ${invalidDocuments}`);
            console.log(`Valid documents: ${totalDocuments - invalidDocuments}`);
        
            } catch (error) {
            console.error('Error validating coordinates:', error);
            }
        }      
        function isValidCoordinate(coordinates) {
            if (!Array.isArray(coordinates) || coordinates.length !== 2) {
            return false;
            }
        
            const [longitude, latitude] = coordinates;
        
            // Check if longitude and latitude are numbers
            if (typeof longitude !== 'number' || typeof latitude !== 'number') {
            return false;
            }
        
            // Check longitude range (-180 to 180)
            if (longitude < -180 || longitude > 180) {
            return false;
            }
        
            // Check latitude range (-90 to 90)
            if (latitude < -90 || latitude > 90) {
            return false;
            }
        
            return true;
        }
        
        // Run the validation
        validateCoordinates();
    })
}


// for (let i = 0; i < signsObj.features.length; i++) {
//     for(let j = 0; j < signsObj.features[i].location.coordinates.length; j++) {
//         signsObj.features[i].location.coordinates[j] = Number(signsObj.features[i].location.coordinates[j].toFixed(6))
//     }
// }
// const uniqueValues = new Set(signsObj.map(s => s.geometry.coordinates[1, 0]));
// if (uniqueValues.size < signsObj.length) {
//     console.log(uniqueValues)
//   }
// console.log(process.env.ATLAS_URI)
    // Sign.collection.drop();
    // Sign.collection.dropIndexes().then(Sign.collection.getIndexes().then((data) => {console.log(data)}))
    // const idxs = Sign.collection.getIndexes().then((data) => {console.log(data)})
    // app.get("/uploadsigns", function(req, res) {
       
        // Sign.collection.insertMany(signsObj, function (err, docs) { 
        // if (err){  
        //     return console.error(err); 
        // } else { 
        //     console.log("Multiple documents inserted to Collection"); 
        // } 
        // }); 
    // })