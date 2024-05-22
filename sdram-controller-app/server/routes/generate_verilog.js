const router = require('express').Router();

router.route('/').get((req,res) => {
    res.send('Where to generate the Verilog, make this post and run command in sbt');
});

module.exports = router;