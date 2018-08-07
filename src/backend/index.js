import initializeDatabase from './db'
import routes from './routes'
import applyMiddleware from './middleware'
import graphqlServer from './graphql'

export default (app) => {
    let [db, models] = initializeDatabase()
    applyMiddleware(app)
    app.use(routes(db, models))
    const server = graphqlServer(app, db, models)    
    app.use("*", (req,res) => res.send({twilight: "hello"}))
    return server
}