const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getUser = async (req, res) => {
    if (req.login) {
        const { userName, role, description, stats } = await User.findById(req.sub);

        console.log(req.cookies);

        const pubUserInfo = { userName, role, description, stats };
        return res.status(200).send(pubUserInfo);
    } else {
        return sendStatus(403); // Not logged in so obv cant get info
    }

    res.send(pubUserInfo);
}

exports.updateUser = async (req, res) => {
    res.send(`Updated user info for id: ${req.params.id}`);
}

exports.deleteUser = async (req, res) => {
    try {
        const { password } = req.body;

        const user = await User.findById(req.sub);

        if(!user) {
            return res.status(404).send('User not found');
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (passwordMatches) {
            await User.deleteOne({ _id: req.sub });
        } else {
            return res.status(403).send('Incorrect password');
        }

        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: "${error}"`);
        
    }
}