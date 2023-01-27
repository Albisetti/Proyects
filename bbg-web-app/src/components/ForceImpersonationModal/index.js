/*
 * Force the current user to assume an impersonation.
 */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import Modal from "../Modal";
import { GET_USERS_BY_TYPE, IMPERSONATE } from "../../lib/user";
import {
    ALLOWED_USER_TYPES,
    HUMANIZED_USER_TYPE_ENUM_VALUES,
} from "../../util/constants";
import { useMutation, useLazyQuery } from "@apollo/client";
import Select from "react-select";
import Loader from "../Loader/Loader";
import { useHistory, useLocation } from "react-router";

function ForceImpersonationModal({
    children,
    title = "Who would you like to Work As?",
    confirmLabel = "Confirm",
    permittedUserTypes = ["BUILDERS"],
}) {
    const location = useLocation();
    const {
        type,
        setForcingImpersonation,
        whoAmI,
        setImpersonationLoading,
    } = useContext(AuthContext);
    const [option, setOption] = useState(null);
    const [
        impersonate,
        { data: impersonationResults, loading: impersonationLoading },
    ] = useMutation(IMPERSONATE, {
        update(cache, result) {
            cache.evict({
                field: "organizations",
            });
            cache.evict({
                field: "users",
            });
            cache.evict({
                field: "subcontractors",
            });
            cache.gc();
            window.location.reload("/");
        },
    });

    useEffect(() => {
        setImpersonationLoading(impersonationLoading);
        // eslint-disable-next-line
    }, [impersonationLoading]);

    const [getUsersByType, { data, loading, error }] = useLazyQuery(
        GET_USERS_BY_TYPE,
        {
            fetchPolicy: "no-cache",
            notifyOnNetworkStatusChange: false,
            variables: {
                types: permittedUserTypes,
            },
        }
    );

    useEffect(() => {
        getUsersByType();
        // eslint-disable-next-line
    }, [permittedUserTypes]);

    const history = useHistory();

    if (!type || !type.length || permittedUserTypes.includes(type)) {
        return null;
    }

    function renderSelectOptions() {
        if (loading || error || !data?.users?.edges?.length) {
            return [];
        }

        const userGroups = [...data.users.edges]
            .filter((user) => ALLOWED_USER_TYPES.includes(user.node.type))
            .reduce((groups, item) => {
                const group = groups[item.node.type] || [];
                group.push(item);

                groups[item.node.type] = group;
                return groups;
            }, {});
        const selectOptions = Object.keys(userGroups).map((group) => ({
            label: HUMANIZED_USER_TYPE_ENUM_VALUES[group],
            options: [...userGroups[group]]
                .sort((a, b) =>
                    a.node.first_name.localeCompare(b.node.first_name)
                )
                .map((user) => ( {
                    label: `${user?.node?.type === "BUILDERS" ? user.node.first_name + " " + user.node.last_name + ` ${user?.node?.organizations?.edges?.[0]?.node?.name? `(${user?.node?.organizations?.edges?.[0]?.node?.name})` : "" } `: user.node.first_name + " " + user.node.last_name  } `,
                    value: user.node.id,
                })),
        }));
        return selectOptions;
    }

    function customTheme(theme) {
        return {
            ...theme,
            colors: {
                ...theme.colors,
                primary25: "rgba(22, 60, 107, 0.1)",
                primary: "#163c6b",
            },
        };
    }

    const customStyles = {
        input: (provided, state) => ({
            ...provided,
            "& input:focus": {
                boxShadow: "none",
            },
        }),
        menuPortal: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
        option: (provided, state) => ({
            ...provided,
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: "#163c6b",
        }),
        control: (provided, state) => ({
            ...provided,
            minHeight: 45,
            borderRadius: "0.5rem",
            border: state.isFocused
                ? error
                    ? "2px solid #b13626"
                    : "2px solid #163c6b"
                : error
                ? "1px solid #b13626"
                : "1px solid rgba(212, 212, 216,1)",
            fontSize: "0.875rem",
            "&:hover": {},
            // This line disable the blue border
            boxShadow: "none",
        }),
    };

    function renderImpersonationModalContent() {
        return (
            <div
                className="grid px-6 grid-cols-1 w-full"
                style={{ minHeight: "37vmin" }}
            >
                <div className="">
                    {loading ? (
                        <Loader />
                    ) : (
                        <Select
                            className="focus:outline-none"
                            value={option}
                            width={""}
                            theme={customTheme}
                            placeHolder="Select"
                            options={renderSelectOptions()}
                            onChange={setOption}
                            noOptionsMessage={() => "No Results Found"}
                            styles={{ ...customStyles }}
                        />
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <Modal
                width={"2xl"}
                title={title}
                Content={renderImpersonationModalContent()}
                submitLabel={confirmLabel}
                disabled={loading || impersonationResults?.loading}
                onClose={() => {
                    if (location.pathname !== "/") {
                        history.push("/");
                    }

                    setForcingImpersonation([]);
                }}
                onSubmit={async () => {
                    try {
                        const result = await impersonate({
                            variables: { id: option.value },
                        });
                        const { token } = result?.data?.impersonate;
                        localStorage.setItem("token", token);
                        whoAmI();
                        localStorage.setItem("currentOrganization", result?.data?.impersonate["user"]?.organizations?.edges[0]?.node?.name)
                    } catch (err) {
                        console.error("Failed impersonation: " + err);
                    }
                }}
                IconJSX={null}
                show={true}
            />

            {children}
        </>
    );
}

export default ForceImpersonationModal;
