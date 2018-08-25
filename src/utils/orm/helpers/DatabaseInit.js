import knexTools from './knexTools'
import Table from '../Table'

export default {
    config (dbConfig, name)  {
        this.isConnected = false
        this.name = name
        this._tables = []
        this._tableObject = { }
        this.dialect = dbConfig.dialect
        if (dbConfig.connection.schema) this.pgSchema = dbConfig.connection.schema
    },
    connect (config) {
        switch (this.dialect) {
            case "postgres":
            case "mysql":
            case "sqlite":
            case "mssql":
                knexTools._connect.call(this, config)
                break;
            case "mongodb":
            default:
                console.log(`Unsupported ${this.dialect} connection at this stage`)
                break;
        }
    },
    introspect () {
        switch (this.dialect) {
            case "postgres":
            case "mysql":
            case "sqlite":
            case "mssql":
                knexTools._introspectSQL.call(this)
                break;
            case "mongodb":
            default:
                console.log(`Unsupported ${this.dialect} connection at this stage`)
                break;
        }
    },
    addTable (model) {
        if(Array.isArray(model)) return model.forEach(each => this.addTable(each))
        const table = new Table(model, this.dialect, this)
        this._tables.push(model.name)
        this._tableObject[model.name] = table
        this[model.name] = table
    }
}