import React from 'react'

const DefaultLayout = (props) => (
    <html lang="en">
        <head>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet="utf-8" />
            <title>{props.title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link href="/file/styles/backend.css" rel="stylesheet" type="text/css" />
        </head>
        <body>
            <ul id="topBarExplorer">
                <li> Currently in Explorer Mode </li>
                <li> <a href='/'> Exit to App </a> </li>
                <li> /api </li>
                <li> <a href='/graphql'> /graphql </a> </li>
                <li> /db </li>
                <li> /file </li>
                
                <li> /docs </li>
                <li> Login </li>

            </ul>
            {props.children}
        </body>
      </html>
)

export default DefaultLayout