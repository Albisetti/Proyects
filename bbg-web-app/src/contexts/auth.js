import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState, createContext } from "react";
import { toast } from "react-toastify";
import { FORGET_PASSWORD, LOGIN, WHO_AM_I } from "../lib/auth";
import { useHistory, useLocation } from "react-router-dom";
import { STOP_IMPERSONATING } from "../lib/user";
import {APP_TITLE} from "../util/constants";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
    const history = useHistory();

    const location = useLocation();

    const [type, setType] = useState("");
    const [fields, setFields] = useState();
    const [hideHeader, setHideHeader] = useState();
    const [mutation, setMutation] = useState(false);
    const [forgotPasswordMutation, setForgotPasswordMutation] = useState(false);
    const [from, setFrom] = useState();
    const [organizationId, setOrganizationId] = useState();
    const [organizationNode, setOrganizationNode] = useState({});
    const [impersonationLoading,setImpersonationLoading] = useState();
    const [programs,setPrograms] = useState();

    useEffect(() => {
        let split = location?.pathname?.split("/");
        if (split?.includes("forgot")) {
            setHideHeader(true);
        } else {
            setHideHeader(false);
        }
    }, [location?.pathname]);

    /*
     * "impersonator" state will hold null or a reference to information about
     * the original impersonating user.
     */
    const [impersonator, setImpersonator] = useState(null);
    const [userData, setUserData] = useState({});

 

    /*
     * If forcingImpersonation is '', then we are not attempting to force an
     * impersonation.  If forcingImpersonation != '', we are trying to force
     * an impersonation on those user type(s).
     */
    const [forcingImpersonation, setForcingImpersonation] = useState("");

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            whoAmI();
        } else {
            setType("");
        }
        // eslint-disable-next-line
    }, []);

    const [whoAmI, { data: user }] = useLazyQuery(WHO_AM_I, {
        fetchPolicy: "no-cache",
        onCompleted: () => {
            if (!user?.whoAmI?.user) {
                setType("");
                setUserData(null);
            } else {
                setType(user?.whoAmI?.user?.type);
                setOrganizationId(
                    user?.whoAmI?.user?.organizations?.edges?.[0]?.node?.id
                );
                setOrganizationNode(user?.whoAmI?.user);
                setUserData(user?.whoAmI?.user)
                setImpersonator(user?.whoAmI?.impersonator);
            }
        },
    });

    const loginFunction = (email, password, from) => {
        setFields({
            email,
            password,
        });
        setFrom(from);
        setMutation(true);
    };

    const forgetPasswordFunction = (email) => {
        setFields({
            email,
        });
        setForgotPasswordMutation(true);
    };

    const [login] = useMutation(LOGIN, {
        variables: {
            email: fields?.email,
            password: fields?.password,
        },
        update(cache, result) {
            setMutation(false);
            if (
                result?.data?.login?.error === false &&
                result?.data?.login?.token
            ) {
                localStorage.setItem("token", result?.data?.login?.token);
                toast.success("Login successful")
                setType(result?.data?.login?.user?.type);
                setOrganizationId(
                    result?.data?.login?.user?.organizations?.edges?.[0]?.node
                        ?.id
                );
                setOrganizationNode(result?.data?.login?.user);
                if (from) {
                    history.push(from);
                } else {
                    history.push("/");
                }
            } else {
                toast.error("Invalid Email or Password");
            }
        },
    });

    const [forgotPassword] = useMutation(FORGET_PASSWORD, {
        variables: {
            email: fields?.email,
        },
        update(cache, result) {
            setForgotPasswordMutation(false);

            if (result?.data?.forgotPassword?.success) {
                toast.success(result?.data?.forgotPassword?.message);
            } else {
                toast.error(
                    "No account with that e-mail address could be found.  Please try again or contact "+APP_TITLE+" for assistance. "
                );
            }
        },
    });

    useEffect(() => {
        if (forgotPasswordMutation === true) {
            forgotPassword();
        }
        // eslint-disable-next-line
    }, [forgotPasswordMutation]);


    const [stopImpersonating] = useMutation(STOP_IMPERSONATING, {
        onCompleted: (data) => {
            localStorage.setItem("token", data?.stopImpersonating?.token);
            setTimeout(whoAmI, 0);
            setForcingImpersonation([]);
            window.location.href = "/"
        },
        update(cache, result) {
            cache.evict({
                field: "organizations",
            });
            cache.evict({
                field: "users",
            });
            cache.evict({
                field:"subcontractors"
            })
            cache.gc();
        },
    });

    useEffect(() => {
        if (mutation === true) {
            login();
        }
        // eslint-disable-next-line
    }, [mutation]);

    return (
        <AuthContext.Provider
            value={{
                type,
                loginFunction,
                forgetPasswordFunction,
                setType,
                organizationId,
                impersonator,
                setImpersonator,
                forcingImpersonation,
                setForcingImpersonation,
                organizationNode,
                stopImpersonating,
                whoAmI,
                userData,
                setUserData,
                setOrganizationNode,
                setImpersonationLoading,
                impersonationLoading,
                hideHeader,
                programs,
                setPrograms
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};
