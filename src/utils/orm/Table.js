import initTable from './helpers/TableInit'
import CRUD from './helpers/TableCRUD'


class Table {
    constructor(...args) {
        initTable.config.call(this, ...args)
        initTable.createSchema.call(this)
        initTable.introspectTable.call(this).then(async tableExists => {
            if(!tableExists) initTable.createTable.call(this)
            if(tableExists) {
                console.log(`Table "${this.name}" already exists.`)
                if(this.model.options.rebuild) {
                    console.log(`The table will be rebuilt.`)
                    let response = await initTable.dropTable.call(this)
                    initTable.createTable.call(this)
                }
            }
        })
    }

    async find(input) {
        const response = await CRUD.find.call(this, input)
        return response
    }

    async insertOne(input) {
        const response = await CRUD.insertOne.call(this, input)
        return response
    }

    async findOne(input) {
        const response = await CRUD.findOne.call(this, input)
        return response
    }

    async updateOne(input) {
        const response = await CRUD.updateOne.call(this, input)
        return response
    }

    async deleteOne(input, options) {
        const response = await CRUD.deleteOne.call(this, input)
        return response
    }
}

export default Table