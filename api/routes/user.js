const mongoose = require("mongoose");
const User = require("../../models/user");

module.exports = router => {
  router.post("/exercise/new-user", (req, res) => {
    let userQry = { name: req.body.username };

    User.exists(userQry, (err, user) => {
      if (err) return res.status(400).json(err);

      if (user) return res.status(400).json("username already taken");

      let newUser = new User(userQry);
      newUser.save((err, data) => {
        if (err) return res.status(400).json(err);
        let user = {username: data.name, _id: data._id}
        res.status(200).json(user);
      });
    });
  });

  router.get("/exercise/users", (req, res) => {
    User.find(null,null,{select: '-__v'},(error, userList) => {
      if (error) return res.status(400).json(error);
      res.status(200).json(userList);
    });
  });
};
