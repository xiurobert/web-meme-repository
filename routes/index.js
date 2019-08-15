var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'ProgrammerHumor2' });
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
