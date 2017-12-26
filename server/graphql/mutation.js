import UserModel from '../models/user'
import UserType from './types/user'
import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} from 'graphql'

const signUp = (args) => {
    return new Promise((resolve, reject) => {
        new UserModel(args).save((error, user) => {
            if (error) return reject(error)

            return resolve(user)
        })
    })
}

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        signUp: {
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
                return signUp(args)
            }
        }
    })
})

export default MutationType