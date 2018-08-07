import Database from '../../utils/orm/Database'
import configFile from '../normConfig'
import glob from 'glob'
import path from 'path'

export default (options) => {
    let config
    if(options) config = options
    if(!options) config = configFile
    let db = new Database(config.database)
    let modelsDir = config.modelsDir || 'src/backend/models'
    let models = glob.sync(`${modelsDir}/*.js`)
                    .map(each => require(path.resolve('.',each)))
    db.define(models)
    //db.User.insertOne({firstName: "Bob", lastName: "Marley", password: "pass", email: "Bob@marley.com"})
    return [db, models]
} 
