const mongoose = require("mongoose");
const Exercise = require("../../models/exercise");
const User = require("../../models/user");

module.exports = router => {
  router.post("/exercise/add", (req, res) => {
    let userId = req.body.userId;
    let description = req.body.description;
    let duration = req.body.duration;
    let date = req.body.date;

    User.findById(userId, (err, userDoc) => {
      if (err) return res.status(400).json(err);
      if (!userDoc) return res.status(400).json("unknown _id");

      let exerciseDoc = {
        userId: userId,
        description: description,
        duration: duration,
        date: date
      };
      let exercise = new Exercise(exerciseDoc);
      exercise.save((err, data) => {
        if (err) return res.status(400).json(err.message);
        let resData = {
          username: userDoc.name,
          description: data.description,
          duration: data.duration,
          _id: userDoc._id,
          date: data.date.toLocaleDateString()
        }
        res.status(200).json(resData);
      });
    });
  });
  
  router.get("/exercise/log", (req, res) => {
    let {userId, from, to, limit} = req.query;
    if (!userId) return res.status(400).json("userId is required")  
    let exerciseQry = {userId: userId}                      
    //if Dates from or to are given put date key into query
    if (from || to) exerciseQry.date = {}
    if (from) exerciseQry.date.$gte = new Date(from).toISOString()
    if (to) exerciseQry.date.$lte = new Date(to).toISOString()
    //if Limit is given put limit key into query
    if (!limit) limit = 0;
    console.log("Query parameters", exerciseQry);
    User.findById(userId, (err, user) => {
      if (err) return res.status(400).json(err.message);
      if (!user) return res.status(400).json("userId not found");
      console.log("Query parameters", exerciseQry);
      Exercise.find(exerciseQry, null, {limit: +limit},(err, exerciseList) => {
        if (err) return res.status(400).json(err);
        let exerciseArray = []
        exerciseList.forEach(a => exerciseArray.push({
          description: a.description,
          duration: a.duration,
          date: a.date.toGMTString()
        }))
        let resData = {
          _id: user._id,
          username: user.name,
          count: exerciseList.length,
          log: exerciseArray
        }
        res.status(200).json(resData);
      });
    });
  });
};
