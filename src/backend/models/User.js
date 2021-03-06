module.exports = {
    name: "User",
    columns: {
        firstName: {
            type: "String",
            required: true
        },
        lastName: {
            type: "String",
            required: true
        },
        password: {
            type: "String",
            required: true,
            hash: true
        },
        email: {
            type: "String",
            required: true,
            unique: true
        },
        isVerified: {
            type: "Boolean",
            defaultValue: false,
        },
        
    },
    events: {
        beforeInsert: ["hashPassword"],
    },
    methods: {
        hash: async (input) => {
            const bcrypt = require('bcrypt')
            const salt = bcrypt.genSaltSync()
            const output = await bcrypt.hashSync(input, salt)
            return output
            },
        hashPassword: async (input, row, table, database) => {
            input.password = await table.methods.hash(input.password)
            return input // return input to the lifecycle
        }
    },
    options: {
        rebuild: true,
        timestamps: true,
        shortid: true,
        uuid: true
    }
}