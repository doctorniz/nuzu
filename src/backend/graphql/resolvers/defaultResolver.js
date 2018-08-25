import { DateTime } from '@okgrow/graphql-scalars'
import JSON from 'graphql-type-json';


export default {
    DateTime,
    JSON,
    Mutation: {
        LogInUser: async(_, args, { db, models }) => {
            return {
                error: false,
                message: "Lovely to see you"
            }
        }
    }
}