import React from 'react'
import DefaultLayout from './components/defaultLayout.jsx'

const Explorer = (props) => (
    <DefaultLayout title={"Explorer"}>

      <h1>Explorer</h1>
      {Object.keys(props.methods).map(model => (
        <div key={model} className="eachModel">
          <h2> {model} </h2>
      
          {props.methods[model].map(eachMethod => (
            <div key={eachMethod.path} className="eachMethod">
              <span> {eachMethod.path} </span>
              <span> {eachMethod.method} </span>
            </div>
          ))}
        </div>
      ))}
    </DefaultLayout>
)

export default Explorer