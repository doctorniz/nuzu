import knexTools from './knexTools'

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
        return await filterByTool.call(this, "find", ...args)
    },
    async findOne (...args) {
        return await filterByTool.call(this, "findOne", ...args)
    },
    async insertOne (...args) {
        return await filterByTool.call(this, "insertOne", ...args) 
    },
    async updateOne (...args) {
        return await filterByTool.call(this, "updateOne", ...args)         
    },
    async deleteOne (...args) {
        return await filterByTool.call(this, "deleteOne", ...args)
    }
}