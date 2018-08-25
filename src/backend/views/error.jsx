import React from 'react'
import DefaultLayout from './components/defaultLayout.jsx'

const ErrorPage = (props) => (
    <DefaultLayout title={"Error"}>
        <h1>Error</h1>
        <p>
            You probably should not be here
        </p>

        <p>
            Click <a href="/">here</a> to go back
        </p>

    </DefaultLayout>
)

export default ErrorPage;