import UserModel from '../models/user'
import UserType from './types/user'
import {
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull
} from 'graphql'

const findUser = () => {
    return new Promise((resolve, reject) => {
        UserModel.find((err, users) => {
            if (err) reject(err)

            else resolve(users)
        })
    })
}

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root schema',
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            description: 'List of all Users',
            resolve: () => {
                return findUser()
            }
        }
    })
})

export default QueryType