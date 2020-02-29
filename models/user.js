const mongoose = require('mongoose');
const shortid = require('shortid');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true},
  _id: { type: String, 'default': shortid.generate }
});


module.exports = mongoose.model("User", userSchema);