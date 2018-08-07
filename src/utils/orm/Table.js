import initTable from './helpers/TableInit'
import CRUD from './helpers/TableCRUD'


class Table {
    constructor(...args) {
        initTable.config.call(this, ...args)
        initTable.createSchema.call(this)
        initTable.introspectTable.call(this).then(tableExists => {
            if(!tableExists) initTable.createTable.call(this)
            if(tableExists) console.log(`Table "${this.name}" already exists.`)
        })
    }

    async find(query, options) {
        const response = await CRUD.find.call(this, query, options)
        return response
    }

    async insertOne(values, options) {
        // validate 'values' first
        const response = await CRUD.insertOne.call(this, values, options)
        return response
    }

    async findOne(query, options) {
        const response = await CRUD.findOne.call(this, query, options)
        return response
    }

    async updateOne(selector, values, options) {
        const response = await CRUD.updateOne.call(this, selector, values, options)
        return response
    }

    async deleteOne(selector, options) {
        const response = await CRUD.deleteOne.call(this, selector, options)
        return response
    }
}

export default Table