# Ormaroo Backend Server: WORK IN PROGRESS

![](https://pandao.github.io/editor.md/images/logos/editormd-logo-180x180.png)

![](https://img.shields.io/github/stars/pandao/editor.md.svg) ![](https://img.shields.io/github/forks/pandao/editor.md.svg) ![](https://img.shields.io/github/tag/pandao/editor.md.svg) ![](https://img.shields.io/github/release/pandao/editor.md.svg) ![](https://img.shields.io/github/issues/pandao/editor.md.svg) ![](https://img.shields.io/bower/v/editor.md.svg)

Define your models once, use everywhere.

## Features

- **Ambitious database-agnostic ORM/ODM (Object Relational Mapper/ Object Document Mapper)**
	- Build on knex.js and thus is compatible with the most common SQL databases -> MySQL, Postgres, SQLite, MSSQL
	- Tested extensively with Postgres on a Windows 10 platform
	- Basic CRUD functions available out-of-the-box
	- Add event subscribers/hooks
	- Validate/parse input before it reaches the database
	- *TODO*: Migrations, MongoDB/Cassandra/CouchDB compatibility
- **Automated REST/GraphQL server**
	- Automatic REST end-points generated with basic CRUD functionality at `/api` with the ability to add custom end-points
	- Automatic GraphQL end-point generated from models and Apollo Server (v 2.0) is deployed at `/graphql`
- **Express server with middleware preloaded**
	- The usual middleware are pre-loaded onto the server including body parser, cookie parser, cors and morgan for logging
	- Static files are served from the **public** directory in root at `/file`
- **Graphical user interface for the backend**

[TOC]

## Installation

1. Run `git clone <REPOSITORY_URL> .` in new folder. If running in existing project, be wary that some files may be replaced
2. Run `npm install` or `yarn install` from root
3. Edit `src/backend/rooconfig.js` with the appropriate database information.
4. Run `npm start`.
5. Your server is now running at `http://localhost:4000`


!!

Objectives

1. Create a ORM that maps to Postgresql, SQLite, MySQL, MSSQL and MongoDB
2. 

1. Generate connection from settings file

Connection Settings {
dialect
host
port

}

2. Build your universal models, each model should have its own file and be stored in the models folder under src

models should have a 
-name LOWERCASE
-columns OBJECT of key:value pairs

columns OBJECT 
-fieldname (key) LOWERCASE : OBJECT (value)
--type
--databaseType



Standard GraphQL Mongoose Sequelize Prisma 

Schema TypeDefs + Resolvers Schema Model + SQL
Models Schema Model