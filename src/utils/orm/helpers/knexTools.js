const knexTools = {
    _connect (config) {
        const knex = require('knex')({
            client: config.dialect,
            connection: config.connection
        })
        this.client = knex
        this.sql = this.client.raw
        knexTools._testConnection.call(this)
    },
    async _testConnection() {
        try {
            const response = await this.sql(`SELECT 1+1 AS "result"`)
            require('assert')(response.rows[0].result === 2)
            this.isConnected = true
            console.log("Connection to database successful")
        }
        catch(error) {
            console.log("ERROR: Unable to connect to database.")
            console.log(error)
        }
    }, 
    async _introspectSQL() {
        const { rows } = await this.sql(`SELECT 
    table_schema AS schema, table_name AS name
    FROM information_schema.tables
    WHERE table_type = 'BASE TABLE'
    ${this.dialect === "postgres" && this.pgSchema ? `AND table_schema = '${this.pgSchema}'` : ""}
    AND table_schema NOT IN ('pg_catalog', 'information_schema');`)
        this._initialTables = rows
        console.log(`Found ${rows.length} tables in database: ${rows.map(a => `"${a.name}"`).join(", ")}`)
    },
    _createSchema() {
        let returnObj = {}, 
            columns = this.model.columns, 
            knex = this.db.client,
            idTaken = false,
            modelOptions = this.model.options
        for(let key in columns) {
            if(["id", "_id"].includes(key.toLowerCase())) idTaken = key
            Object.assign(returnObj, knexTools._createColumn.call(this, key, columns[key]))
        }
        if(idTaken) {
            this.uniques.push(idTaken) 
            Object.assign(returnObj, knexTools._createIDColumn("id", columns[idTaken].uuid, knex ))
        } else {
            this.uniques.push("id") 
            Object.assign(returnObj, knexTools._createIDColumn())
        }
        if(modelOptions.uuid) {
            this.uniques.push("uuid") 
            Object.assign(returnObj, knexTools._createIDColumn("uuid", true, knex))
        }
        if(modelOptions.shortid) {
            this.uniques.push("short")  
            Object.assign(returnObj, knexTools._createIDColumn("short", true, knex))
        }
        return returnObj
    },
    _createColumn(name, props) {
        if(props.unique) this.uniques.push(name)
        return {
            [name]: {
                knexFn: knexTools._getKnexFunction(props.type),
                required: props.required || false,
                unique: props.unique || false,
                defaultValue: props.hasOwnProperty("defaultValue") ? props.defaultValue : undefined,
                reference: props.reference || null,
                enums: props.enumOptions || null,
                isEnum: props.type.toLowerCase() === "enum",
                maxLength: props.length
            }
        }
    },
    _createIDColumn(id = "id", uuid = false, knex = null) {
        return {
            [id] : {
                knexFn: uuid ? "string" : "increments",
                primary: true,
                required: true,
                unique: true, 
                isEnum: false,
                defaultValue: undefined,
                reference: null,
                enums: null
            }
        }
    },
    _getKnexFunction(type) {
        switch(type.toLowerCase()) {
            case "string":
                return "string";
                break;
            case "integer":
                return "integer";
                break;
            case "number":
            case "float":
                return "float";
                break;
            case "boolean":
                return "boolean";
                break;
            case "date":
                return "date";
                break;
            case "time":
                return "time";
                break;
            case "datetime":
            case "timestamp":
                return "timestamp";
                break;
            case "object":
            case "json":
                return "json";
                break;
            default:
                return "null";
                break;
        }
    },
    async _introspectTable() {
        const hasTable = await this.db.client.schema.hasTable(this.name)
        if(!hasTable) return false
        return true
    },
    async _createTable() {
        const knex = this.db.client
        const response = await knex.schema.createTable(this.name, knexTools._produceTableCB(this.schema, this.model.options, this.uniques))
        console.log(`New table "${this.name}" created successfully`)
        return response
    },
    async _dropTableIfExists() {
        const knex = this.db.client
        try {
            await knex.schema.dropTableIfExists(this.name)
            return {
                success: true,
                error: null
            }
        } catch(error) {
            return {
                success: false,
                error
            }
        }
    },
    _produceTableCB( { id, ...rest }, modelOptions, uniques ) {
        return table => {
            table[id.knexFn]("id")
            let indices = []
            for(let key in rest) {
                let {
                    knexFn,
                    defaultValue,
                    unique,
                    required
                } = rest[key]
                let t = table[knexFn](key)
                if(required) t.notNullable()
                if(rest[key].defaultValue !== undefined) t.defaultsTo(defaultValue)             
            }
            if(modelOptions.timestamps) table.timestamps(true, true);
            table.unique(uniques)
        }
    },
    async _insertOne(values, options) {
        const rows = await this.db.client(this.name)
                                .insert(values)
                                .returning("*")
        return rows[0]
    },
    async _find(query, options) {
        const rows = await this.db.client
                    .from(this.name)
                    .select("*")
                    .where(query)
                    .returning("*")
        return rows

        
    },
    async _findOne(query, options) {
        const rows = await knexTools._find.call(this, query, options)
        if(rows.length > 0) return rows[0]
        return {error: true}
    },
    async _updateOne(selector, values, options) {
        const rows = await this.db.client(this.name)
                                .where(selector)
                                .update(values)
                                .returning("*")
        return rows[0]
    },
    async _deleteOne(selector, options) {
        const rows = await this.db.client(this.name)
                                .where(selector)
                                .del()
                                .returning("*")
        return rows[0]
    }
}

export default knexTools