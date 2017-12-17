import UserModel from '../models/user'
import UserType from './types/user'
import {
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLID
} from 'graphql'

const findUser = () => {
    return new Promise((resolve, reject) => {
        UserModel.find((error, users) => {
            if (error) reject(error)

            else resolve(users)
        })
    })
}

const findUserById = (args) => {
    return new Promise((resolve, reject) => {
        UserModel.findById(args._id, (error, user) => {
            if (error) reject(error)

            else resolve(user)
        })
    })
}


const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root schema',
    fields: () => {
        return {
            getUser: {
                type: new GraphQLList(UserType),
                description: 'List of all users.',
                resolve: () => {
                    return findUser()
                }
            },
            getUserById: {
                type: UserType,
                description: 'Get user by id.',
                args: {
                    _id: {
                        name: '_id',
                        type: new GraphQLNonNull(GraphQLID)
                    }
                },
                resolve: (root, args) => {
                    return findUserById(args)
                }
            }
        }
    }
})

export default QueryType