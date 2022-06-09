const router = require('express').Router();
const User = require('../model/User')
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
        res.send({user: user._id});
    } catch(err) {
        res.status(400).send(err)
    }
});


router.post('/login', async (req, res) => {
    //validation part
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //reg user checking
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email does not exists');

    //valid password checking
    const valPass = await bcrypt.compare(req.body.password, user.password);
    if(!valPass) return res.status(400).send('Password does not match');

    //create and assign a token

    const token = jwt.sign({_id: user._id}, process.env.TOKEN);
    res.header('auth-token', token).send(token);

    res.send('Logged in Success');
    })

module.exports =  router;