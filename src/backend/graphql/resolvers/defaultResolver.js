
module.exports = {
    Mutation: {
        LogInUser: async(_, args, { db, models }) => {
            return {
                error: false,
                message: "Lovely to see you"
            }
        }
    }
}