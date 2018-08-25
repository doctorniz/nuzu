import nuzuConfig from './normConfig'
import initializeDatabase from './db'
import routes from './routes'
import middlehorse from '../utils/middleware'
import graphqlServer from './graphql'

export default (app) => {
    let [db, models] = initializeDatabase(nuzuConfig)
    middlehorse(app, nuzuConfig.middleware)
    app.use(routes(db, models))
    const server = graphqlServer(app, db, models)    
    app.use("*", (req,res) => res.send({twilight: "hello"}))
    return server
}