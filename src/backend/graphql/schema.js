import { mergeTypes, mergeResolvers, fileLoader } from 'merge-graphql-schemas'
import { makeExecutableSchema } from 'graphql-tools'
import path from 'path'
import glob from 'glob'
import generateTypes from '../../utils/graphql/createTypes'
import generateResolvers from '../../utils/graphql/createResolvers'


export default (models) => {
    const generatedTypes = generateTypes(models)
    const loadedTypes = fileLoader(path.join(__dirname,'./types'))
    const typeDefs = mergeTypes([...generatedTypes, ...loadedTypes])

    const generatedResolvers = generateResolvers(models)
    const loadedResolvers = glob.sync(`${path.join(__dirname, './resolvers')}/*.js`)
                                .map(each => require(each))
    const resolvers = mergeResolvers([...generatedResolvers, ...loadedResolvers])
    
    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    })

    return {
        typeDefs, 
        resolvers,
        schema
    }
}
