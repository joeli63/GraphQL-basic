import UserModel from '../models/user'
import UserType from './types/user'
import {
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull
} from 'graphql'
import passport from '../passport'
import { encrypt, secret } from '../utils/crypto'
import jwt from 'jsonwebtoken'

const findUser = () => {
    return UserModel.find((error, users) => {
        if (error) return error

        else return users
    })
}

const findUserById = (args) => {
    return new Promise((resolve, reject) => {
        UserModel.findById(args._id, (error, user) => {
            if (error) return reject(error)
    
            else return resolve(user)
        })
    })
}

const login = (args) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({
            username: args.username
        }, (error, user) => {
            if (error) return reject(error)

            if (!user) return reject('Not found user.')

            user.comparePassword(args.password, (e, isMatch) => {
                if (e) return reject(e)

                if (!isMatch) return reject('Somethings went wrong!!!')
                
                var data = {
                    username: user.username,
                    password: args.password
                }
                var payload = encrypt(JSON.stringify(data))
                var token = jwt.sign(payload, secret)
                user.token = token
                return resolve(user)
            })
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
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (root, args, context) => {
                    console.log(context.user)
                    
                    if (!context.user) return new Promise((resolve, reject) => reject('Unauthorization.'))

                    return findUserById(args)
                }
            },
            login: {
                type: UserType,
                description: 'Login query.',
                args: {
                    username: {
                        name: 'username',
                        type: new  GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        name: 'password',
                        type: new  GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (root, args, req) => {
                    return login(args)
                }
            }
        }
    }
})

export default QueryType