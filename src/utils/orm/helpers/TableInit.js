import knexTools from './knexTools'

export default {

    config (model, dialect, database) {
        this.name = model.name
        this.dialect = dialect
        this.db = database
        this.model = model
        this.methods = model.methods
        this.events = model.events
        this.uniques = []
    },

    createSchema () {
        switch (this.dialect) {
            case "postgres":
            case "mysql":
            case "sqlite":
            case "mssql":
                this.schema = knexTools._createSchema.call(this)
                break;
            case "mongodb":
            default:
                console.log(`Unsupported ${this.dialect} connection at this stage`)
                break;
        }
    },

    async introspectTable() {
        switch (this.dialect) {
            case "postgres":
            case "mysql":
            case "sqlite":
            case "mssql":
                let response = await knexTools._introspectTable.call(this)
                return response;
                break;
            case "mongodb":
            default:
                console.log(`Unsupported ${this.dialect} connection at this stage`)
                return undefined;
                break;
        }
    },

    async dropTable() {
        switch (this.dialect) {
            case "postgres":
            case "mysql":
            case "sqlite":
            case "mssql":
                let response = await knexTools._dropTableIfExists.call(this)
                return response;
                break;
            case "mongodb":
            default:
                console.log(`Unsupported ${this.dialect} connection at this stage`)
                return undefined;
                break;
        }

    },
    
    createTable() {
        switch (this.dialect) {
            case "postgres":
            case "mysql":
            case "sqlite":
            case "mssql":
                let response = knexTools._createTable.call(this)
                return response;
                break;
            case "mongodb":
            default:
                console.log(`Unsupported ${this.dialect} connection at this stage`)
                return undefined;
                break;
        }
    }
}