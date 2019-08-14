var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ProgrammerHumor2' });
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/login.notrlyphp', function(req, res, next){
  res.send("I told u its not php right");
});

module.exports = router;
