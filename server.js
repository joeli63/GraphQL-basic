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
mongoose.connect(process.env.DB_URI, { useMongoClient: true }, (error, db) => {
    if (error) console.log(error)

    console.log('Connect successful')
})

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

    app.use('/graphql', graphQL((req, res) => {
        return {
            schema,
            rootValue: res.status(404).send(`${res.statusCode}: Not Found`)
        }
    }))
    app.use('/graphiql', graphQL(() => {
        const startTime = Date.now()
        return {
            schema,
            graphiql: true,
            extensions({ document, variables, operationName, result }) {
                return { runTime: `${Date.now() - startTime}ms` }
            }
        }
    }))

    app.use((req, res) => {
        res.status(404).send(`${res.statusCode}: Not Found`)
    })

    app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`))
}