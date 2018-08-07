import { ApolloServer } from 'apollo-server-express'
import compileSchema from './schema'


export default (app, db, models) => {

    const { schema } = compileSchema(models)

    const server = new ApolloServer({
        schema,
        context: ({req}) => ({
            db,
            models,
            req
        })
    })
    server.applyMiddleware({app})
    app.use('/graphql', () => {}) // to get around the res.next() function on the playground
    return app
}