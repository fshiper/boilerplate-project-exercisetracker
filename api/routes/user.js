const mongoose = require("mongoose");
const User = require("../../models/user");

module.exports = (router) => {
  router.post('/exercise/new-user', (req, res) => {
    
    let userQry = {name: req.body.username};
    
    User.exists(userQry, (err, user) => {
    
      if (err) return res.status(400).json(err);
      
      if (user) return res.status(400).json("username already taken");
      
      let newUser = new User(userQry)
      
      newUser.save((err, data) => {
        if (err) return res.status(400).json(err);
        res.status(200).json(data)
      })
    })
  })
}