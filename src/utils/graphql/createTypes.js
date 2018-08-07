import { gql } from 'apollo-server-express'
import pluralize from 'pluralize'

export default models => {
    let generatedTypes = []
    Object.values(models).forEach(a => generatedTypes.push(createEachType(a)) )
    //let loadedTypes = ``
    //let result = mergeTypes([...generatedTypes, ...loadedTypes])
    return generatedTypes
}

const parseRelation = (key, { type, joinTable, target, ...rest }) => {
    let result = ""
    switch(type) {
        case "one-to-one":
            result = `${key}: ${target}`
            break;
        case "many-to-many":
            if(joinTable) result = `${key}: [${target}]`
            break;
    }
    return result
}

const parseRelationInput = (key, { type, joinTable, target, ...rest }) => {
    let result = ""
    switch(type) {
        case "one-to-one":
            result = `${key}: ID`
            break;
        case "many-to-many":
            if(joinTable) result = `${key}: [ID]`
            break;
    }
    return result
}

const parseGraphQLType = ({type, array}) => {
    let returnString = ``
    if(array) returnString += `[`
    switch(type.toLowerCase()) {
        case "":
        case "uuid":
            returnString += "ID"
            break;
        case "varchar":
        case "string":
        case "text":
        case "char":
        case "tinytext":
        case "mediumtext":
        case "blob":
        case "longtext":
        case "tinyblob":
        case "mediumblob":
        case "longblob":
        case "multilinestring":
        case "decimal":
            returnString += "String"
            break;
        case "tinyint":
        case "smallint":
        case "bigint":
        case "int":
        case "integer":
            returnString += "Int"
            break;
        case "float":
        case "double":
            returnString += "Float"
            break;
        case "boolean":
            returnString += "Boolean"
            break;
        case "date":
        case "datetime":
        case "time":
            returnString += "DateTime"
            break;
        case "json":
        case "jsonb":
            returnString += "JSON"
            break;
        default:
            return "entity type unknown"

    }
    if(array) returnString += `]`
    return returnString
}

const createEachType = ({ name, columns, relations }) => {
    let schema = "",
        columnFields = [],
        columnInputs = [],
        fields = [],
        relationsFields = [],
        relationsInputs = [],
        enums = [],
        otherFields = ``

    if(columns) {
        let columnKeys = Object.keys(columns)
        columnKeys.map((field, i) =>  {
            if(field.toLowerCase() === "id") return
            let column = `${field}: ${parseGraphQLType(columns[field])}`
            columnInputs.push(column)
            columnFields.push(`${column}${columns[field].required ? "!" : ""}`)
        })
    }

    if(relations) {
        let relationKeys = Object.keys(relations)
        relationKeys.map((field, i) => {
            let relation = parseRelation(field, relations[field])
            if(relation) {
                relationsFields.push(relation)
                relationsInputs.push(parseRelationInput(field, relations[field]))
            }
        })
    }

    let typeDefinition = `{
    id: ID!
    ${columnFields.join(`
    `)}
    ${relationsFields.join(`
    `)}
}`

    let inputDefinition = `{
    id: ID!
    ${columnFields.join(`
    `)}
    ${relationsInputs.join(`
    `)}
}`

    schema += `
type ${name} ${typeDefinition}

`
    schema += `type Query {
    ${name}(id: ID, ${columnInputs.concat(relationsInputs).join(`, `)}): ${name}Payload
    ${pluralize(name)}(id: ID, ${columnInputs.concat(relationsInputs).join(`, `)}): ${name}Payload
}

type Mutation {
    Create${name}(${columnInputs.concat(relationsInputs).join(`, `)}): ${name}Payload
    Update${name}(id: ID!, ${columnInputs.concat(relationsInputs).join(`, `)}): ${name}Payload
    Remove${name}(id: ID!): ${name}Payload
}

type ${name}Payload {
    success: Boolean
    error: String
    item: ${name}
    items: [${name}]
    message: String
}

input ${name}Input ${inputDefinition}


`
    return schema
} 