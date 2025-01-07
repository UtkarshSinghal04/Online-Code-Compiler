const { generateFile } = require('../RunCodes/GenerateFile')
const Job = require('../Model/Job')
const { addJobToQueue } = require('../Queue')

const RunController = async (req, res) => {
    const { language = 'cpp', code } = req.body

    if (!code) {
        return res.status(400).json({ message: "empty code body" })
    }

    let job
    try {
        //generate a c++ file with code from the req body
        const filePath = await generateFile(language, code)

        job = await Job.create({ language, filePath });
        const jobId = job._id
        console.log(job)

        addJobToQueue(jobId)
        res.status(201).json({ jobId })

    } catch (error) {
        res.status(500).json({ error: JSON.stringify(error) })
    }
}

const StatusController = async (req, res) => {
    const { jobId } = req.query
    console.log('status requested', jobId)

    if (!jobId) {
        return res.status(400).json({ success: false, message: 'jobId not provided' })
    }

    try {
        const job = await Job.findById(jobId)

        if (!job) {
            return res.status(404).json({ success: false, message: 'job not found' })
        }

        return res.status(200).json({ success: true, job })

    } catch (error) {
        return res.status(500).json({ success: false, error: JSON.stringify(error) })
    }
}

module.exports = { RunController, StatusController }