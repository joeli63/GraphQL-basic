import UserModel from '../models/user'
import UserType from './types/user'
import {
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull
} from 'graphql'

const findUser = () => {
    return UserModel.find((error, users) => {
        if (error) return error

        else return users
    })
}

const findUserById = (args) => {
    return UserModel.findById(args._id, (error, user) => {
        if (error) return error

        else return user
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
                        type: new GraphQLNonNull(GraphQLString)
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