import React, { useContext, useState, useEffect } from "react";

import TextField from "../../FormGroups/Input";
import Button from "../../Buttons";
import { AuthContext } from "../../../contexts/auth";
import { isValidEmail } from "../../../util/validations";
import { Helmet } from "react-helmet";
import {APP_TITLE} from "../../../util/constants";

const Login = (props) => {

 
    const [fields, setFields] = useState();
    const { loginFunction, forgetPasswordFunction } = useContext(AuthContext);
    const [errors, setErrors] = useState({
        email: false,
        password: false,
    });
    const [finalError, setFinalError] = useState({
        login: false,
        forgetPassword: false,
    });
    const [login, setLogin] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields({
            ...fields,
            [name]: value,
        });
    };

    const handleLogin = () => {
        if (!finalError?.login && fields?.password?.length > 5) {
            loginFunction(fields?.email, fields?.password,props?.location?.state?.from);
            setLogin(true);
        } else {
            setLogin(true);
        }
    };

    useEffect(() => {
        handleErrors();
        // eslint-disable-next-line
    }, [fields, login, forgotPassword]);

    const handleErrors = () => {
        let insideErrors = {};
        if (login || forgotPassword) {
            if (isValidEmail(fields?.email) === false) {
                insideErrors.email = true;
            }
        }
        if (login) {
            if (
                fields?.password?.length < 5 ||
                fields?.password === undefined ||
                fields?.password === ""
            ) {
                insideErrors.password = true;
            }
        }
        setErrors(insideErrors);
    };

    useEffect(() => {
        let finalLoginError = errors?.password || errors?.email;

        let finalForgetPasswordError = errors?.email;

        let object = {};
        object.login = finalLoginError;
        object.forgetPassword = finalForgetPasswordError;

        setFinalError(object);
    }, [errors]);

    const handleForgotPassword = () => {
        if (isValidEmail(fields?.email)) {
            setForgotPassword(true);
            forgetPasswordFunction(fields?.email);
        } else {
            setForgotPassword(true);
        }
    };

    return (
        <div className="form-container max-w-md mx-auto mt-20">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Login</title>
            </Helmet>

            <TextField
                onChange={handleChange}
                parentClass=""
                id="email"
                label="Email"
                value={fields?.email}
                name="email"
                placeholder={"example@email.com"}
                type="email"
                errorClassName="mt-1"
                error={errors?.email}
                errorMessage={"Email is required"}
            />
            <TextField
                onChange={handleChange}
                parentClass="mt-5"
                id="password"
                label="Password"
                value={fields?.password}
                name="password"
                placeholder="Password"
                errorClassName="mt-1"
                error={errors?.password}
                errorMessage={"Password can not be empty"}
                type="password"
            />
            <div className="mt-5 flex flex-col justify-center items-center">
                <Button
                    title="Login"
                    color="secondary  hover:opacity-75 "
                    onClick={() => handleLogin()}
                />
                <span
                    className="font-title text-secondary text-md text-center cursor-pointer"
                    onClick={() => handleForgotPassword()}
                >
                    {" "}
                    Forgot Your Password?{" "}
                </span>
            </div>
        </div>
    );
};

export default Login;
