const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const router = express.Router(process.env.CONVER_API_KEY)
const ExecutinPlanning = require('../models/ExecutinPlanning')
const Project = require('../models/Project');
const authMiddleware = require("../middlewares/RBAC/authMiddleware");
const rbacMiddleware = require("../middlewares/RBAC/rbacMiddleware");
const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: false }))





router.get('/files', async (req, res) => {
    try {
        const files = await ExecutinPlanning.find().exec();

        res.status(200).json({
            files: files,
            message: 'Success'
        });


    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving files' });
    }
});


router.get('/files/:id', async (req, res) => {
    const id = req.params.id;
    try {

        const query = {};
        // console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id
        } else {
            query.projectId = id;
        }

        const files = await ExecutinPlanning.findById(query).exec();


        res.status(200).json({
            files: files,
            message: 'Success'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving files' });
    }
});


router.get('/files/proj/:id', async (req, res) => {
    const id = req.params.id;
    try {

        const query = {};
        // console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query.ProjectId = id
        } else {
            query.projectId = id;
        }

        const files = await ExecutinPlanning.findOne(query).exec();
        console.log(files.Basic_Drawing.Final_Date);
        
        res.status(200).json({
            files: files,
            message: 'Success'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving files' });
    }
});

router.post("/create/:id", async (req, res) => {
    try {
        const { ...dates } = req.body;
        const ProjectId = req.params.id;

        if (!ProjectId) {
            return res.status(400).json({ msg: "ProjectId is required" });
        }

        // Prepare the execution plan data without Final_Date fields
        const executionPlanData = {
            ProjectId
        };

        Object.keys(dates).forEach((key) => {
            if (dates[key]?.Execution_date) {
                executionPlanData[key] = { Execution_date: dates[key].Execution_date };
            }
        });

        // Create a new execution plan
        const executionPlan = new ExecutinPlanning(executionPlanData);
        await executionPlan.save();

        res.status(201).json({ msg: "Execution plan created successfully", executionPlan });
    } catch (err) {
        console.error("Error:", err.message);
        res.json({ msg: err.message || "Something went wrong" });
    }
});


router.put('/edit/:id', async (req, res) => {
    try {
        let id = req.params.id;

        const query = {};
        console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }

        const response = Payment.findByIdAndUpdate(query, req.body)
        if (!response) { res.json({ msg: 'Payment not found' }) }

        res.json({ msg: 'Success' })


    } catch (err) {
        console.error(err);
        res.json({ msg: err.message })
    }
})



router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {

        const query = {};
        console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }
        console.log(query);

        const response = await CadFile.findOneAndDelete(query)
        res.status(200).send({ msg: 'Success' });

    } catch (err) {
        console.error(err.msg);
        res.status(400).send({ msg: 'Server Error' });
    }
});


module.exports = router;
