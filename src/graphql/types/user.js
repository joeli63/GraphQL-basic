import UserModel from '../../models/user'
import {
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull
} from 'graphql'

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represent a User',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        token: { type: GraphQLString }
    })
})

export default UserType