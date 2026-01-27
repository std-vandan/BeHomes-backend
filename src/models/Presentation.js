const mongoose = require('mongoose');
const Project = require('../models/Project')

const pdfSchema = new mongoose.Schema({
    ProjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project" // Reference to the Pdf model
    },
    name: String,
    data: Buffer,
    svgFileName: String,
    svgFileData: Buffer,
    contentType: String,  
    uploadDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: [
            "Finalized",
            "Not-Finalized"
        ],
        default: "Not-Finalized"
    }
});

module.exports = mongoose.model('PresentationPdf', pdfSchema);