import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'

const TMRoute = ({ component: Component, ...rest }) => {

  // Add your own authentication on the below line.
  let {type} = useContext(AuthContext);
  let token = localStorage.getItem("token")
let whoCanAccess = ( type === "TERRITORY_MANAGER")



  return (
    <Route
      {...rest}
      render={props => 
        whoCanAccess ? (
            <Component {...props} />
        ) : token?  (
            <Component {...props} />
        ) : (
            <Redirect to={{ pathname: '/login', state: { from: props?.location?.state?.from ? props?.location?.state?.from : props?.location?.pathname} }} />
        )
    }
    />
  )
}

export default TMRoute