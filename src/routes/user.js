const express = require('express')
const User = require('../models/User')
const router = express.Router();
const authMiddleware = require("../middlewares/RBAC/authMiddleware");
const rbacMiddleware = require("../middlewares/RBAC/rbacMiddleware");

router.get('/view', async (req, res) => {
    try {
        const file = await User.find();

        if (!file) {
            return res.status(404).send('File not found');
        }
        const length = file.length
        // console.log(length);

        res.json({ msg: 'Success', files: file, length });

    } catch (err) {
        res.status(500).send('Error retrieving file from database');
    }
});

router.get('/manager', async (req, res) => {
    try {
        var file = await User.find();

        if (!file) {
            return res.status(404).send('File not found');
        }
        var file = file.filter((val) => val.role === "Manager");
        res.json({ msg: 'Success', files: file });

    } catch (err) {
        res.status(500).send('Error retrieving file from database');
    }
});

router.get("/filter", async (req, res) => {
    try {
        const role = "Admin";
        const response = await User.find({ "role": role }, "-password")
        // console.log(response);
        res.json({ msg: 'Success', files: response });



    } catch (error) {
        console.error(error);
        res.send(error.message);

    }
})


// Endpoint to retrieve and serve SVG file
router.get('/view/:id', async (req, res) => {
    try {
        const response = await User.findById(req.params.id);


        if (!response) {
            return res.status(404).send('File not found');
        }
        res.status(200).json({ msg: 'Success', response: response });

    } catch (err) {
        res.status(500).send('Error retrieving file from database');
    }
});

router.post('/create', (req, res) => {
    try {
        User.create(req.body);
        res.json({ msg: 'Success' })

    } catch (err) {
        console.log(err.message);
        res.json({ msg: err.message })
    }
})

router.post('/role-assign/:id', async (req, res) => {
    try {
        const response = await User.findByIdAndUpdate(req.params.id, { "role": req.body.role })
        console.log(req.body);
        res.json({ msg: 'Success' })
    } catch (err) {
        console.log(err.message);
        res.json({ msg: err.message })
    }
})


router.put('/edit/:id', (req, res) => {
    try {
        const id = req.params.id

        const query = {};
        console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }

        const response = User.findByIdAndUpdate(query, req.body)
        if (!response) { res.json({ msg: 'User not found' }) }

        res.json({ msg: 'Success' })
    } catch (error) {
        console.log(err.message);
        res.json({ msg: err.message })
    }
})

router.delete('/delete/:id', (req, res) => {
    try {
        const id = req.params.id

        const query = {};
        console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }

        const response = User.findByIdAndDelete(query)
        if (!response) { res.json({ msg: 'User not found' }) }

        res.json({ msg: 'Success' })
    } catch (error) {
        console.log(err.message);
        res.json({ msg: err.message })
    }
})





module.exports = router