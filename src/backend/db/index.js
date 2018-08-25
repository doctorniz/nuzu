import Database from '../../utils/orm/Database'
import glob from 'glob'
import path from 'path'

export default (config) => {
    let db = new Database(config.database)
    let modelsDir = config.modelsDir || 'src/backend/models'
    let models = glob.sync(`${modelsDir}/*.js`)
                    .map(each => require(path.resolve('.',each)))
    db.define(models)
    //db.User.insertOne({firstName: "Bob", lastName: "Marley", password: "pass", email: "Bob@marley.com"})
    return [db, models]
} 
