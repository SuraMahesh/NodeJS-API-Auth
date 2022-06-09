const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.json({posts: {
        title: 'my test posts',
        desc: 'random posts'
    }

});
});

module.exports = router;