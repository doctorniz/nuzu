export default {
    database: {
        dialect: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "",
        database: "testdb",
        schema: "public",  
    },
    modelsDir: 'src/backend/models'
}

const normConfig = {
    databases: [
        {
            dialect: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "",
            database: "testdb" 
        }
    ]
}