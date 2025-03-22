const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signSchema = new Schema({
	properties: {
		SG_KEY_BOR: {type: String, required: true},
		ID: {type: String, required: true},
		SIGNDESC: {type: String}
	},
	location: { 
		type: { type: String, default: "Point" },
		coordinates: {
            type: [Number], 
            required: true}
	}
});
signSchema.index({ location: "2dsphere" });

const Sign = mongoose.model("Sign", signSchema);

module.exports = Sign;
