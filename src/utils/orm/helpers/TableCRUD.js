import knexTools from './knexTools'
import compact from 'lodash/compact'

const filterByTool = async function (func, ...args) {
    switch (this.dialect) {
        case "postgres":
        case "mysql":
        case "sqlite":
        case "mssql":
            return await knexTools[`_${func}`].call(this, ...args)
            break;
        case "mongodb":
        default:
            console.log(`Unsupported ${this.dialect} connection at this stage`)
            break;
    }
}

export default {
    async find (...args) {
        let offset = 0, limit = 50
        let modelOptions = this.model.options,
            modelEvents = this.events,
            modelMethods = this.methods
        try {
            let items = await filterByTool.call(this, "find", ...args)
            if(modelEvents.hasOwnProperty('onLookup')) {
                for(let i in modelEvents.onLookup) {
                    let method = modelEvents.onLookup[i]
                    if(modelMethods.hasOwnProperty(method)) {
                        items = await modelMethods[method](args, items[0], this, this.db, items)
                    } else {
                        throw `${method} does not exist in ${this.name} `
                    }
                }
            }
            if(items.error) throw "Unable to find items"
            return {
                success: true,
                items,
                pagination: {
                    count: items.length,
                    offset,
                    limit
                }
            }
        } catch(error) {
            return {
                success: false,
                error: {
                    message: error
                }
            }
        }
    },
    async findOne (...args) {
        let modelOptions = this.model.options,
            modelEvents = this.events,
            modelMethods = this.methods
        try {
            let item = await filterByTool.call(this, "findOne", ...args)
            if(modelEvents.hasOwnProperty('onLookup')) {
                for(let i in modelEvents.onLookup) {
                    let method = modelEvents.onLookup[i]
                    if(modelMethods.hasOwnProperty(method)) {
                        item = await modelMethods[method](args, item, this, this.db)
                    } else {
                        throw `${method} does not exist in ${this.name} `
                    }
                }
            }
            if(item.error) throw "Unable to find item"
            return {
                success: true,
                item,
                message: "1 item found successfully"
            }
        } catch(error) {
            return {
                success: false,
                error: {
                    message: error
                }
            }
        }
    },
    async insertOne (args) {
        let modelOptions = this.model.options,
            modelEvents = this.events,
            modelMethods = this.methods
        if(modelOptions.timestamps) {
            args.created_at = new Date()
            args.updated_at = new Date()
        }
        if(modelOptions.shortid) {
            args.short = require('shortid').generate()
        }
        if(modelOptions.uuid) {            
            args.uuid = require('uuid/v4')()
        }
        try {
            if(modelEvents.hasOwnProperty('beforeInsert')) {
                for(let i in modelEvents.beforeInsert) {
                    let method = modelEvents.beforeInsert[i]
                    if(modelMethods.hasOwnProperty(method)) {
                        args = await modelMethods[method](args, null, this, this.db)
                    } else {
                        throw `${method} does not exist in ${this.name} `
                    }
                }
            }
            let item = await filterByTool.call(this, "insertOne", args) 
            return {
                success: true,
                item,
                message: "Item inserted successfully"
            }
        } catch(error) {
            return {
                success: false,
                error: {
                    message: error
                }
            }
        }
    },
    async updateOne ({id, offset, limit, ...args}) {
        args.updated_at = new Date()
        let selector = { id }
        let options = compact({ offset, limit })
        let modelOptions = this.model.options,
            modelEvents = this.events,
            modelMethods = this.methods
        try {
            if(modelEvents.hasOwnProperty('beforeUpdate')) {
                for(let i in modelEvents.beforeUpdate) {
                    let method = modelEvents.beforeUpdate[i]
                    if(modelMethods.hasOwnProperty(method)) {
                        let row = await filterByTool.call(this, "findOne", selector)
                        args = await modelMethods[method](args, row, this, this.db)
                    } else {
                        throw `${method} does not exist in ${this.name} `
                    }
                }
            }
            let item = await filterByTool.call(this, "updateOne", selector, args, options)
            return {
                success: true,
                item,
                message: "Item updated successfully"
            } 
        } catch(error) {
            return {
                success: false,
                error: {
                    message: error
                }
            }
        }    
    },
    async deleteOne ({id, ...args}) {
        if(!id) return { success: false, error: { message: "ID required to delete item" }}
        let selector = { id },
            modelOptions = this.model.options,
            modelEvents = this.events,
            modelMethods = this.methods
        try {

            let item = await filterByTool.call(this, "deleteOne", selector, args)
            if(modelEvents.hasOwnProperty('onDelete')) {
                for(let i in modelEvents.onDelete) {
                    let method = modelEvents.onDelete[i]
                    if(modelMethods.hasOwnProperty(method)) {
                        args = await modelMethods[method](args, item, this, this.db)
                    } else {
                        throw `${method} does not exist in ${this.name} `
                    }
                }
            }
            return {
                success: true,
                item,
                message: "Item deleted successfully"
            } 
        } catch(error) {
            return {
                success: false,
                error: {
                    message: error
                }
            }
        }
       
    }
}