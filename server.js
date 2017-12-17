import cluster from 'cluster'
import os from 'os'
import morgan from 'morgan'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import graphQL from 'express-graphql'

import schema from './graphql/schema'

dotenv.config()
mongoose.connect(process.env.DB_URI, { useMongoClient: true })
.then(() => console.log('Connect successful'))
.catch(error => console.log(error))

const numCPUs = os.cpus().length
const app = express()

if (cluster.isMaster) {
    console.log(`Server is running on port ${process.env.PORT}`)
    console.log(`Master ${process.pid} is running`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker %d died (%s). restarting...`, worker.process.pid, signal || code)

        cluster.fork()
    })
} else {
    app.use(morgan('dev'))
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.use('/graphql', graphQL({
        schema
    }))
    app.use('/graphiql', graphQL({
        schema,
        graphiql: true,
    }))

    app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`))
}