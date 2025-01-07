const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true,
        enum: ["cpp", "py", "c"]
    },
    filePath: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    startedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'success', 'error']
    },
    output: {
        type: String
    }
})
    
module.exports = mongoose.model('Job', jobSchema)