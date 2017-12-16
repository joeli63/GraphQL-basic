import morgan from 'morgan'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import graphQL from 'express-graphql'

import schema from './graphql/schema'

dotenv.config();
mongoose.connect(process.env.DB_URI)

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/graphql', graphQL({
    schema
}))
app.use('/graphiql', graphQL({
    schema,
    graphiql: true,
}))

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`))