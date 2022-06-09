const router = require('express').Router();
const User = require('../model/User')
const { registerValidation } = require('../validation');
const bcrypt = require('bcryptjs')


router.post('/register' , async (req, res) => {

    //validation part
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Already register user check
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email Already exists');

    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const saveUser = await user.save();
        res.send(saveUser);
    } catch(err) {
        res.status(400).send(err)
    }
});


module.exports =  router;