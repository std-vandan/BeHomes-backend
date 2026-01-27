const mongoose = require('mongoose')
const Project = require('../models/Project')

const dateSchema = new mongoose.Schema({
    ProjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    Project_Start: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Basic_Drawing: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Presentation: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Quotation: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Measurement: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Working_Drawing: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Shop_Drawing: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Final_Drawing: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Purchase: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Material_Received: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Snag_List: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Dispatch: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Installation: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    },
    Payment: {
        Execution_date: { type: String },
        Final_Date: { type: String }
    }
});

module.exports = mongoose.model('ExecutinPlanning', dateSchema);