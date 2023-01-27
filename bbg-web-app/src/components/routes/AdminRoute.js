import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'

const AdminRoute = ({ component: Component, ...rest }) => {

  // Add your own authentication on the below line.
  let {type} = useContext(AuthContext);
    let whoCanAccess = type === "ADMIN"
 


  return (
    <Route
      {...rest}
      render={props =>
        whoCanAccess ? (
            <Component {...props} />
        ) : (
            <Redirect to={{ pathname: '/', state: { from: props?.location?.pathname } }} />
        )
      
      }
    />
  )
}

export default AdminRoute