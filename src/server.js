import cluster from 'cluster'
import os from 'os'
import morgan from 'morgan'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import graphQL from 'express-graphql'
import compression from 'compression'
import helmet from 'helmet'

import schema from './graphql/schema'
import passport from './passport'

dotenv.config()

/**
 * Open and connect to mongoDB.
 */
mongoose.connect(process.env.DB_URI, { useMongoClient: true }, (error, db) => {
    if (error) console.log(error)

    console.log('Connect successful')
})

const numCPUs = os.cpus().length
const app = express()

/**
 * Config morgan logger for graphQL.
 */
morgan.token('graphql', (req) => {
    const {query, variables, operationName} = req.body
    return `Operation Name: ${operationName} \nQuery: ${query} \nVariables: ${JSON.stringify(variables)}`
});

/**
 * Config server.
 */
app.use([
    morgan(':graphql'), 
    bodyParser.urlencoded({ extended: true }), 
    bodyParser.json(), 
    passport.initialize(), 
    passport.session(), 
    compression(), 
    helmet()
])

const graphQLCallBack = (req, res, graphiql, rootValue) => {
    const startTime = Date.now()
        
    return new Promise((resolve, reject) => {
        const next = (user) => {
            resolve({
                schema,
                graphiql,
                rootValue,
                extensions({ document, variables, operationName, result }) {
                    return { runTime: `${Date.now() - startTime}ms` }
                },
                context: { user: user || null }
            })
        }

        /**
         * Use passport as middleware to authenticate user.
         */
        passport.authenticate('jwt', { session: false }, (error, user) => {
            next(user)
        })(req, res, next)
    })
}

/**
 * Server clustering.
 */
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
    app.use('/graphql', graphQL((req, res) => {
        return graphQLCallBack(req, res, true, res.status(404).send(`${res.statusCode}: Not Found`))
    }))
    app.use('/graphiql', graphQL((req, res) => {
        return graphQLCallBack(req, res, true)
    }))

    app.use((req, res) => {
        res.status(404).send(`${res.statusCode}: Not Found`)
    })

    app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`))
}