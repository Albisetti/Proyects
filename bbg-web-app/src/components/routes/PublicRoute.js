import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const PublicRoute = ({ component: Component, ...rest }) => {

  // Add your own authentication on the below line.
  const token = localStorage.getItem('token')

  return (
    <Route
      {...rest}
      render={props =>
        token ? (
            <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        ) : (
          <Component {...props} />
        )
      }
    />
  )
}

export default PublicRoute