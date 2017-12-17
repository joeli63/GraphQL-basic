import UserModel from '../models/user'
import UserType from './types/user'
import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} from 'graphql'

const promiseAddUser = (args) => {
    return new UserModel(args).save((error, user) => {
        if (error) return error

        return user
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
                    type: new GraphQLNonNull(GraphQLString),
                },
                password: {
                    name: 'Password',
                    type: new GraphQLNonNull(GraphQLString),
                }
            },
            resolve: (root, args) => {
                return promiseAddUser(args)
            }
        }
    })
})

export default MutationType