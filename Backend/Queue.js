const Queue = require('bull');
const Job = require('./Model/Job')
const {runC} = require('./RunCodes/RunC')
const {runCpp} = require('./RunCodes/RunCpp')
const {runPy} = require('./RunCodes/RunPy')

const jobQueue = new Queue('job queue');
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({ data }) => {
    const jobId = data.id
    const job = await Job.findById(jobId)

    if (!job) {
        throw new Error(`No Job exist with id ${jobId}`)
    }

    try {
        //run the file
        let output

        job.startedAt = Date.now()
        if (job.language === 'cpp') {
            output = await runCpp(job.filePath)
        }
        else if (job.language === 'py') {
            output = await runPy(job.filePath)
        }
        else if (job.language === 'c') {
            output = await runC(job.filePath)
        }
        job.status = 'success'
        job.completedAt = Date.now()
        job.output = output
        await job.save()
        console.log(job)

        return true

    } catch (error) {
        job.completedAt = Date.now()
        job.status = 'error'
        job.output = JSON.stringify(error)
        console.log(`error is ${error}`)
        await job.save()
        console.log(job)

        throw new Error(JSON.stringify(error))
    }
})

jobQueue.on('failed', (error) => {
    console.error(error.data.id, error.failedReason)
})

const addJobToQueue = async (jobId) => {
    jobQueue.add({
        id: jobId
    })
}

module.exports = { addJobToQueue }