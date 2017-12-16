import UserModel from '../models/user'
import UserType from './types/user'
import {
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull
} from 'graphql'

const promiseAddUser = (args) => {
    var newUser = new UserModel(args)

    return new Promise((resolve, reject) => {
        newUser.save((error) => {
            if (error) reject(error)

            else resolve(newUser)
        })
    })
}

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addUser: {
            type: UserType,
            description: 'Add new a user.',
            args: {
                username: {
                    name: 'Username',
                    type: GraphQLString,
                },
                password: {
                    name: 'Password',
                    type: GraphQLString,
                }
            },
            resolve: (root, args) => {
                return promiseAddUser(args)
            }
        }
    })
})

export default MutationType