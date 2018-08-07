import pluralize from 'pluralize'

export default models => {
    let generatedResolvers = []
    Object.values(models).forEach(a => generatedResolvers.push(createEachResolver(a)) )
    //let loadedTypes = ``
    //let result = mergeTypes([...generatedTypes, ...loadedTypes])
    return generatedResolvers
}

const createEachResolver = ({ name, columns, relations }) => {
    return {
        Query: {
            [name]: async(_, args, { db }) => {
                const results = await db[name].findOne(args)
                return results
            },
            [`${pluralize(name)}`]: async (_, args, { db }) => {
                const results = await db[name].find(args)
                return results
            }
        },
        Mutation: {
            [`Create${name}`]: async (_, args, { db }) => {
                const results = await db[name].insertOne(args)
                return results
            },
            [`Update${name}`]: async (_, { id, ...args }, { db }) => {
                const results = await db[name].updateOne(id, args)
                return results
            },
            [`Remove${name}`]: async (_, { id }, { db }) => {
                const results = await db[name].removeOne(id)
                return results
            },
        }
    }
}