const Project = require('../models/Project'); 


// Utility function to update project status based on date comparison
async function updateProjectStatus(projectId, executionDate, finalDate) {
    if (!executionDate || !finalDate) {
        console.log("Invalid dates provided.");
        return;
    }

    const executionDateObj = new Date(executionDate);
    const finalDateObj = new Date(finalDate);

    if (executionDateObj.getTime() === finalDateObj.getTime()) {
        console.log(`Project ${projectId} status updated to "In Progress"`);
        await Project.findByIdAndUpdate(projectId, { projectStatus: "In Progress" });
    } else {
        console.log(`Project ${projectId} status updated to "Overdue"`);
        await Project.findByIdAndUpdate(projectId, { projectStatus: "Overdue" });
    }
}


// Export the function
module.exports = { updateProjectStatus };