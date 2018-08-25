export default {
    modelsDir: 'src/backend/models',
    database: {
        name: "postgres",
        dialect: "postgres",
        //version: '9.7.0',
        connection: {
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "",
            database: "testdb",
            schema: "public",
            //filename: 'backend/db/db.sqlite',
        },
        options: {
            alwaysRebuild: false
        }
          
    },
    graphql: {

    },
    rest: {

    },
    middleware: {
        static: {
            path: 'file',
            folder: 'public',
            disable: false
        },
        bodyParser: {
            disable: false
        },
        cookieParser: {
            disable: true
        },
        cors: {
            disable: false
        },
        logging: {
            loggingFormat: 'combined',
            disable: true
        }
    },
    auth: {

    },
    views: {

    },
    cache: {

    },
    email: {

    },
    sockets: {

    },
    streaming: {

    }
    
}

