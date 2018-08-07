import knexTools from './knexTools'
import Table from '../Table'

export default {
    config (configuration, name)  {
        this.isConnected = false
        this.name = name
        this.dialect = configuration.dialect
        if (configuration.schema) this.schema = configuration.schema
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
        this[model.name] = table
    }
}