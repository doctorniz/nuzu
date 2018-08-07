import Table from './Table'
import initDB from './helpers/DatabaseInit'

class Database {
    constructor(config, name) {
        // this is where we first initialize the configuration
        // of the database
        this._tables = []
        initDB.config.call(this, config, name)
        initDB.connect.call(this, config) // -> and then tested
        initDB.introspect.call(this)
    }

    define(model) {
        if(Array.isArray(model)) return model.forEach(each => this.define(each))
        initDB.addTable.call(this, model)
    }

    static help = "Help delivered"

    static hash = async value => {
        const bcrypt = require('bcrypt'),
            salt = bcrypt.genSaltSync(),
            hashValue = await bcrypt.hash(value, salt)
        return hashValue
    }

    static compareHash = async (value, hashedValue) => {
        const bcrypt = require('bcrypt'),
            result = await bcrypt.compare(value, hashedValue)
        return result
    }

}


export default Database