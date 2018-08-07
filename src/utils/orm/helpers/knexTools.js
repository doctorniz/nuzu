const knexTools = {
    _connect (config) {
        const knex = require('knex')({
            client: this.dialect,
            connection: config
        })
        this.client = knex
        this.sql = this.client.raw
        knexTools._testConnect.call(this)
    },
    async _testConnect() {
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
    ${this.dialect === "postgres" && this.schema ? `AND table_schema = '${this.schema}'` : ""}
    AND table_schema NOT IN ('pg_catalog', 'information_schema');`)
        this._initialTables = rows
        console.log(`Found ${rows.length} tables in database: ${rows.map(a => `"${a.name}"`).join(", ")}`)
    },
    _createSchema() {
        let returnObj = {}, 
            columns = this.model.columns, 
            knex = this.db.client,
            idTaken = false
        for(let key in columns) {
            if(["id", "_id"].includes(key.toLowerCase())) idTaken = key
            Object.assign(returnObj, knexTools._createColumn(key, columns[key]))
        }
        if(idTaken) {
            Object.assign(returnObj, knexTools._createIDColumn("id", columns[idTaken].uuid, knex ))
        } else {
            Object.assign(returnObj, knexTools._createIDColumn())
            Object.assign(returnObj, knexTools._createIDColumn("uuid", true, knex))
        }
        return returnObj
    },
    _createColumn(name, props) {
        return {
            [name]: {
                knexFn: knexTools._getKnexFunction(props.type),
                required: props.required || false,
                unique: props.unique || false,
                defaultValue: props.defaultValue || null,
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
                knexFn: uuid ? "uuid" : "increments",
                primary: true,
                required: true,
                unique: true, 
                isEnum: false,
                defaultValue: uuid ? knex.raw("uuid_generate_v4()") : null,
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
        const response = await knex.schema.createTable(this.name, knexTools._produceTableCB(this.schema))
        console.log(`New table "${this.name}" created successfully`)
        return response
    },
    _produceTableCB( { id, ...rest } ) {
        return table => {
            table[id.knexFn]("id")
            let uniques = ["id"], indices = []
            for(let key in rest) {
                let {
                    knexFn,
                    defaultValue,
                    unique,
                    required
                } = rest[key]
                if(unique) uniques.push(key)
                let t = table[knexFn](key)
                if(required) t.notNullable()
                if(defaultValue !== null) t.defaultsTo(defaultValue)                   
            }
            table.timestamps(true, true);
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