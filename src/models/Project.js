const mongoose = require('mongoose');
const validate = require('express-validator')
const ExecutionPlanning = require("../models/ExecutinPlanning"); // Ensure ExecutionPlanning model is imported
const Project = require("../models/Project")

const projectSchema = new mongoose.Schema({
    projectName: { type: String },
    projectType: {
        type: String,
        enum: ["Residential", "Commercial", "Office", "Retail", "Hospitality"]
    },
    startDate: { type: String },
    endDate: { type: String },
    assigned: { type: String },
    estimatedValue: { type: String },
    quotedValue: { type: String, default: null },
    fullAddress: { type: String },
    city: { type: String },
    pincode: { type: Number },

    clientType: {
        type: String,
        enum: ['corporate', 'individual'],
    },
    companyName: {
        type: String,
        required: function () {
            return this.clientType === 'corporate';
        }
    },
    clientName: { type: String },
    contactNumber: { type: String },
    emailAddress: { type: String },

    referral: { referredBy: String },
    architectName: { type: String },
    architectCompanyName: { type: String },
    architectPhone: { type: String },
    architectEmail: { type: String },

    projectStatus: {
        type: String,
        enum: ["Planned", "In Progress", "Overdue", "Completed", "On Hold", "Cancelled"],
        default: "In Progress"
    },
    previousStage: {
        type: String,
        default: "Project Started"
    },
    currentStage: {
        type: String,
        default: "Project Started"
    },
    addedStages: { type: [String] },
    designPreferences: {
        style: {
            type: String,
            enum: ["Contemporary", "Minimalist", "Industrial", "Traditional"]
        },
        theme: String
    },
    assignedDesigners: [{ type: String }],
    projectTerms: String,
    paymentTerms: String,
    aboutProject: { type: String },
    projectCreatedDate: {
        type: Date,
        default: Date.now
    },

    // New field to categorize the project
    projectCategory: {
        type: String,
        enum: ['Prospect', 'Project'],
        default: 'Prospect'
    }
});
// projectSchema.post("findOneAndUpdate", async function (Project) {
//     console.log("Updated Info", Project, "Ends here");

//     if (!Project) return;

//     try {


//         await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to allow execution update

//         const execution = await ExecutionPlanning.findOne({ ProjectId: Project._id });
//         console.log("Latest Execution Info:", execution);

//         // const execution = await ExecutionPlanning.findOne({ ProjectId: Project._id });
//         // console.log(execution);


//         if (!execution) {
//             console.warn(`ExecutionPlanning not found for ProjectId: ${Project._id}`);
//             return;
//         }

//         const currentStageData = execution[Project.currentStage];

//         if (!currentStageData) {
//             console.warn(`No execution data found for stage: ${Project.currentStage}`);
//             return;
//         }

//         const { Execution_date, Final_Date } = currentStageData;

//         if (!Execution_date || !Final_Date) {
//             console.warn(`Missing Execution_date or Final_Date for ProjectId: ${Project._id}`);
//             return;
//         }
//         console.log("This is the comparison of dates", Execution_date === Final_Date, Execution_date, Final_Date, currentStageData, execution[Project.currentStage], Project.currentStage), execution;

//         // Convert to date strings for comparison
//         const executionDate = new Date(Execution_date).toISOString().split("T")[0];
//         const finalDate = new Date(Final_Date).toISOString().split("T")[0];

//         const newStatus = executionDate === finalDate ? "In Progress" : "Overdue";
//         console.log("This is the comparison of dates", executionDate === finalDate, executionDate, finalDate);

//         // Fetch current project status
//         const currentProject = await mongoose.model("Project").findById(Project._id);
//         if (!currentProject) return;

//         // Only update if the status actually needs to change
//         if (currentProject.projectStatus !== newStatus) {
//             await mongoose.model("Project").findByIdAndUpdate(Project._id, { projectStatus: newStatus });
//         }

//     } catch (error) {
//         console.error(`Error in post-update hook for ProjectId: ${Project._id}`, error);
//     }
// });

// Pre-save hook to update projectCategory before saving


projectSchema.post("findOneAndUpdate", async function (doc) {
    if (!doc) return;

    // Fetch the latest project document
    const updatedDoc = await mongoose.model("Project").findById(doc._id);
    if (!updatedDoc) return;

    // console.log("Latest Updated Info:", updatedDoc);

    // Fetch the latest execution data after a short delay
    await new Promise(resolve => setTimeout(resolve, 50));
    const execution = await ExecutionPlanning.findOne({ ProjectId: doc._id });

    if (!execution) {
        console.warn(`ExecutionPlanning not found for ProjectId: ${doc._id}`);
        return;
    }

    // Ensure we're checking the correct stage
    const currentStageData = execution[updatedDoc.currentStage];
    if (!currentStageData) {
        console.warn(`No execution data found for stage: ${updatedDoc.currentStage}`);
        return;
    }

    const { Execution_date, Final_Date } = currentStageData;
    if (!Execution_date || !Final_Date) return;

    const executionDate = new Date(Execution_date).toISOString().split("T")[0];
    const finalDate = new Date(Final_Date).toISOString().split("T")[0];

    const newStatus = executionDate === finalDate ? "In Progress" : "Overdue";
    // console.log("This is the comparison of dates", executionDate === finalDate, executionDate, finalDate);

    // Update only if needed
    if (updatedDoc.projectStatus !== newStatus) {
        await mongoose.model("Project").findByIdAndUpdate(doc._id, { projectStatus: newStatus });
    }
});


projectSchema.pre('save', function (next) {
    this.projectCategory = this.quotedValue ? 'Project' : 'Prospect';
    next();
});

projectSchema.pre('findOneAndUpdate', function (next) {
    // console.log("Before Update:", this.getUpdate());
    const update = this.getUpdate();
    if (update.$set && update.$set.quotedValue !== undefined) {
        update.$set.projectCategory = update.$set.quotedValue ? 'Project' : 'Prospect';
    }
    next();
});

projectSchema.pre('save', function (next) {
    if (this.clientType === 'individual' && this.companyName) {
        this.client.companyName = undefined;
    }
    next();
});


module.exports = mongoose.model('Project', projectSchema);