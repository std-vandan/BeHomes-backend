const express = require('express');
const router = express.Router();
const Project = require('../models/Project')
const Execution = require('../models/ExecutinPlanning')
const mongoose = require('mongoose');


router.get('/view', async (req, res) => {

    try {
        var Data = await Project.find();
        // res.json(response)
        // console.log("Succesful");
        // console.log(Data.);
        res.status(200).json({ msg: "Success", Datas: Data });


    } catch (err) {
        console.error(err.message)
        res.status(500).json({ msg: "Server error" })
    }
})

router.get('/prospect', async (req, res) => {
    try {
        var Data = await Project.find({ projectCategory: 'Prospect' });

        res.status(200).json({ msg: "Success", Datas: Data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
});
router.get('/project', async (req, res) => {
    try {
        var Data = await Project.find({ projectCategory: 'Project' });

        res.status(200).json({ msg: "Success", Datas: Data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
});



router.get('/payment', async (req, res) => {
    try {
        const projects = await Project.find({}, '_id projectStatus quotedValue estimatedValue');

        // Map the response based on projectStatus
        const formattedData = projects.map(project => {
            if (project.projectStatus === "Overdue") {
                return { quotedValue: project.quotedValue, Id: project._id };
            } else if (project.projectStatus === "In Progress") {
                return { estimatedValue: project.estimatedValue, Id: project._id };
            } else {
                return {}; // If status doesn't match, return an empty object or modify as needed
            }
        });

        res.status(200).json({ msg: "Success", data: formattedData });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
});


router.get('/Projects_Overdue', async (req, res) => {

    try {
        // const Data = (await Project.find({ projectStatus: "In Progress" })).length;
        const Data = await Project.find();

        var prospect = Data.filter((val) => val.projectCategory === "Prospect").length
        var project = Data.filter((val) => val.projectCategory === "Project").length
        console.log(project, prospect);

        res.status(200).json({ msg: "Success", Prospect: prospect, Project: project });


    } catch (err) {
        console.error(err.message)
        res.status(500).json({ msg: "Server error" })
    }
})


// Finding data by Project Id
router.get('/view/:id', async (req, res) => {

    const id = req.params.id;

    try {

        let query = {};

        // Check if the id is a MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }
        // console.log(id, query);


        const response = await Project.findOne(query);
        if (!response) return res.status(404).json({ msg: "Project doesn't exists" })

        res.status(200).json({ msg: "Success", response: response });


    } catch (err) {
        console.error(err.message);
        res.json({ msg: "Server error" })
    }
})


router.post('/create', async (req, res) => {

    try {

        const newProject = await Project.create(req.body)



        return res.status(200).json({ msg: "Success", project: newProject })
    } catch (err) {
        console.error(err.message);
        res.json({ msg: err.message })

    }
})
// Working
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid Project ID" });
        }

        const update = {};

        // Check if quotedValue is being updated
        if (req.body.quotedValue !== undefined) {
            update.quotedValue = req.body.quotedValue;
            update.projectCategory = req.body.quotedValue ? "Project" : "Prospect"; // Ensure category updates
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            req.body,
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ msg: "Project not found" });
        }

        res.status(200).json({ msg: "Succes" });
    } catch (err) {
        console.error("Error updating project:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});



router.put('/projects/:id', async (req, res) => {
    try {


        const id = req.params.id

        const query = {};
        console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }


        const response = await Project.findOneAndUpdate(query, req.body)
        if (!response) return res.status(400).json({ msg: "Project not found" })


        res.status(200).json({ msg: "Success" })
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});




router.delete('/delete/:id', async (req, res) => {

    const id = req.params.id
    try {
        const query = {};
        console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }

        const response = await Project.findOneAndDelete(query)
        res.status(200).json({ msg: "Success" });

    }
    catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
})

// History of the document
router.get('/history/:id', async (req, res) => {
    const id = req.params.id
    try {
        const query = {};
        if (mongoose.Types.ObjectId.isValid(id)) {
            query.ProjectId = id;
        } else {
            query.projectId = id;
        }
        console.log(query);


        const response = await Execution.findOne(query); // Fetch one document, including only the uploadDate field        
        res.status(200).json({ response: response }); // Respond with the found document
    } catch (error) {
        res.status(500).json({ message: 'Error fetching PDFs', error: error.message });
    }
});


module.exports = router;