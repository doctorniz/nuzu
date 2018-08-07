import { Router } from 'express'

const createAPIs = (db, models) => {
    let methods = []
    const tables = db._tables
    tables.forEach(table => methods.push({
        path: `/api/${table}`,
        method: `get`,
        func: async (req, res) => res.send(await db[table].find(req.query))
    }, {
        path: `/api/${table}`,
        method: `post`,
        func: async (req, res) => res.send (await db[table].insertOne(req.body))
    }, {
        path: `/api/${table}`,
        method: `put`,
        func: (req, res) => db[table].updateOne(req.body)
    }))
    return methods
}


export default (db, models) => {
    const routes = Router()
    const methods = createAPIs(db,models)

    methods.forEach(({ path, method, func }) => {
        routes[method](path, func)
    })

    routes.use('/user', (req, res, next) => {
        res.send("johnny")
    })

    routes.use('/twelve', (req, res, next) => {
        res.send("twelve tin soldiers")
    })
    return routes
}