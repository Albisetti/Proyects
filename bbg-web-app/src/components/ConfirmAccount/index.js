import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { Helmet } from "react-helmet";
import { Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../Buttons/Button";
import TextField from "../FormGroups/Input/TextField";

import { AuthContext } from "../../contexts/auth";
import { CONFIRM_ACCOUNT_REQUEST } from "../../lib/user";

import { APP_TITLE } from "../../util/constants";

const RESET_PASSWORD_ERROR_NONE = "null";
const RESET_PASSWORD_ERROR_NO_PASSWORD = "no-password";
const RESET_PASSWORD_ERROR_NO_MATCH = "no-match";

const RESET_TOAST_FAILURE_TEXT = `Something went wrong with your account confirmation request. Please try again or contact ${ APP_TITLE } for assistance. `;
const RESET_TOAST_SUCCESS_TEXT = `Account confirmed successfully.  Logged in.`;

function ResetPassword(props) {
    const RESET_PASSWORD_ERRORS = {
        RESET_PASSWORD_ERROR_NONE: null,
        RESET_PASSWORD_ERROR_NO_PASSWORD: "You must provide a password of at least 5 characters.",
        RESET_PASSWORD_ERROR_NO_MATCH: "Passwords must match.",
    };

    const history = useHistory();
	const { whoAmI } = useContext(AuthContext);

    const [passwordError, setPasswordError] = useState(
        RESET_PASSWORD_ERROR_NONE
    );
    const [passwordInput, setPasswordInput] = useState("");
    const [redirected, setRedirected] = useState(false);
    const [confirmedPasswordInput, setConfirmedPasswordInput] = useState("");

    const [attemptPasswordUpdate] = useMutation(CONFIRM_ACCOUNT_REQUEST);

    const { code } = props?.match?.params;
    /* No validation: redirect if we had a missing route param. */
    if (redirected || !code || !code.length) {
        return <Redirect to="/login" />;
    }

    async function handlePasswordResetAttempt() {
        if (confirmedPasswordInput !== passwordInput) {
            setPasswordError(RESET_PASSWORD_ERROR_NO_MATCH);
            return;
        }

        if (passwordInput.length < 5) {
            setPasswordError(RESET_PASSWORD_ERROR_NO_PASSWORD);
            return;
        }

        setPasswordError(RESET_PASSWORD_ERROR_NONE);
        try {
            const { data } = await attemptPasswordUpdate({
                variables: {
                    forgotCode: code,
                    newPassword: passwordInput,
                },
            });

            const { token, user } = data.confirmAccountRequest;
            if (token === null || user === null) {
				toast.warn(RESET_TOAST_FAILURE_TEXT);

                setRedirected(true);
                return;
            } else {
                toast.success(RESET_TOAST_SUCCESS_TEXT);

                localStorage.setItem("token", token);
                setTimeout(whoAmI, 0);
                history.push("/");
                return;
            }
        } catch (err) {
            setPasswordError(err);
        }
    }

    return (
        <div className="form-container max-w-md mx-auto mt-20">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Confirm Your New Account</title>
            </Helmet>

            <TextField
                parentClass="mt-5"
                id="password"
                label="New password"
                name="password"
                value={passwordInput}
                onChange={(ev) => setPasswordInput(ev.target.value)}
                error={passwordError !== RESET_PASSWORD_ERROR_NONE}
                placeholder="New password"
                errorClassName="mt-1"
                type="password"
            />
            <TextField
                parentClass="mt-5"
                id="password_confirmed"
                label="Confirm new password"
                name="password_confirmed"
                value={confirmedPasswordInput}
                onChange={(ev) => setConfirmedPasswordInput(ev.target.value)}
                placeholder="Confirm new password"
                errorClassName="mt-1"
                errorMessage={
                    passwordError !== RESET_PASSWORD_ERROR_NONE &&
                    RESET_PASSWORD_ERRORS[passwordError]
                }
                error={passwordError !== RESET_PASSWORD_ERROR_NONE}
                type="password"
            />

            <div className="mt-5 flex flex-col justify-center items-center">
                <Button
                    title="Confirm Account"
                    color="secondary  hover:opacity-75 "
                    onClick={handlePasswordResetAttempt}
                />
            </div>
        </div>
    );
}

export default ResetPassword;
