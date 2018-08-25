import { Router } from 'express'
import pluralize from 'pluralize'
import capitalize from 'capitalize'
import flatten from 'lodash/flatten'
import keyBy from 'lodash/keyBy'

const createAPIs = (db, models) => {
    let result = {}
    const tables = db._tables
    tables.forEach(table => {
        let methods = []
        
        const { uniques } = db[table]
        const uniqueMethods = uniques.map(each => {
            return {
                path: `/api/${table}By${capitalize(each)}/:${each}`,
                method: 'get',
                func: async (req, res) => res.send(await db[table].findOne({[each]: req.params[each]}))
            }
        })

        methods.push({
            path: `/api/${pluralize(table)}`,
            method: `get`,
            func: async (req, res) => res.send(await db[table].find(req.query))
        }, {
            path: `/api/${table}`,
            method: `get`,
            func: async (req, res) => res.send (await db[table].findOne(req.body))
        }, 
        ...uniqueMethods, 
        {
            path: `/api/Create${table}`,
            method: `post`,
            func: async (req, res) => res.send (await db[table].insertOne(req.body))
        }, {
            path: `/api/Update${table}`,
            method: `post`,
            func: (req, res) => db[table].updateOne(req.body)
        })
        result[table] = methods
    })
    return result
}


export default (db, models) => {
    const routes = Router()
    const methods = createAPIs(db, models)
    const methodArr = flatten(Object.values(methods))
    methodArr.forEach(({ path, method, func }) => {
        routes[method](path, func)
    })

    routes.use('/error', (req, res, next) => {
        res.render('error', {
            error: req.error
        })
    })

    routes.use('/explorer', (req, res, next) => {
        res.render('explorer', {
            models: keyBy(models, "name"),
            methods
        })
    })



    routes.use('/admin/db', (req, res, next) => {
        res.render('db', {
            db
        })
    })

    routes.use('/admin', (req, res, next) => {
        res.render('admin', {
            models: db._tables
        })
    })

    routes.use('/user', (req, res, next) => {
        res.send("johnny")
    })

    routes.use('/twelve', (req, res, next) => {
        res.send("twelve tin soldiers")
    })
    return routes
}