module.exports = {
    "name": "User",
    "columns": {
        "firstName": {
            "type": "String",
            "required": true
        },
        "lastName": {
            "type": "String",
            "required": true
        },
        "password": {
            "type": "String",
            "required": true,
            "private": true
        },
        "email": {
            "type": "String",
            "required": true,
            "unique": true
        },
        "married": {
            "type": "Boolean",
            "defaultValue": "false"
        }
    },
    "hooks": {
        "beforeCreate": {
            "args": "next",
            "body": ""
        }
    },
    "methods": {

    },
    "options": {
        "dropBefore": false,
        "timestamps": true
    }
}