import React, { useState, useEffect, useContext } from "react";
import TextField from "../FormGroups/Input";
import { useMutation } from "@apollo/client";
import { CREATE_ADMIN, UPDATE_ADMIN, FETCH_USERS_QUERY } from "../../lib/admin";
import Button from "../Buttons";
import Modal from "../Modal";
import { isValidEmail, isValidPhone } from "../../util/validations";
import { toast } from "react-toastify";
import { DELETE_USER, IS_EMAIL_AVAILABLE } from "../../lib/user";
import { FORGET_PASSWORD, SEND_USER_INVITE } from "../../lib/auth";
import { AuthContext } from "../../contexts/auth";

const CreateAdmin = ({ archieved, edit, user, fillColumn, searchString,cleanUp }) => {
  //  const [enabled, setEnabled] = useState("ADMIN");
    const [showModal, setShowModal] = useState(false);
    const [fields, setFields] = useState(user);
    const [errors, setErrors] = useState({
        first_name: false,
        last_name: false,
        email: false,
        mobile_phone: false,
    });
    const [finalError, setFinalError] = useState(false);
    const [emailCopy, setEmailCopy] = useState();

    const {organizationNode} = useContext(AuthContext)

    useEffect(() => {
        if (edit === false) {
            setFields({
                ...fields,
                id: "",
                first_name: searchString?.length > 0 ? searchString : "",
                last_name: "",
                email: "",
                title: "",
                office_phone: "",
                office_phone_ext: "",
                mobile_phone: "",
                email_verified_at:""
            });
            //setEnabled("ADMIN");
        }
        // eslint-disable-next-line
    }, [user, edit]);

    useEffect(() => {
        //This Use-Effect fills the Data
        if (edit === true) {
            setEmailCopy(user?.email);
            setFields({
                ...fields,
                
                id: user?.id,
                first_name: user?.first_name,
                last_name: user?.last_name,
                email: user?.email,
                office_phone: user?.office_phone,
                office_phone_ext: user?.office_phone_ext,
                mobile_phone: user?.mobile_phone,
                title: user?.title,
                email_verified_at:user?.email_verified_at
            });
           // setEnabled(user?.type);
        }
        //eslint-disable-next-line
    }, [user, edit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields({
            ...fields,
            [name]: value,
        });
    };

    // const handleBoolChange = (e) => {
    //     setEnabled(e.target.id);
    // };

    const IconJSX = () => {
        return (
            <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            </svg>
        );
    };

    // const switchButton = () => {
    //     return (
    //         <div className="flex flex-row sm:grid sm:grid-cols-3 items-center justify-between  px-4 sm:items-center w-full  xl:px-4 py-3 xl:py-0">
    //             <div className=" text-md  font-medium text-secondary ">
    //                 Role
    //             </div>
    //             <div className="flex flex-row bg-gray-50 rounded-md hover:bg-gray-100" style={{maxWidth:"min-content"}}>
    //                 <button
    //                     type="button"
    //                     onClick={handleBoolChange}
    //                     id="ADMIN"
    //                     className={`inline-flex justify-center items-center text-center px-4 py-2 m-1 mr-0 h-10 border border-r-0 border-gray-500 rounded-md rounded-r-none shadow-sm text-sm font-medium text-white ${
    //                         enabled === "ADMIN"
    //                             ? "bg-secondary border-secondary"
    //                             : "text-secondary bg-white hover:bg-gray-50"
    //                     }  focus:outline-none `}
    //                 >
    //                     Admin
    //                 </button>
    //                 <button
    //                     type="button"
    //                     onClick={handleBoolChange}
    //                     id="EXECUTIVE"
    //                     className={`inline-flex items-center justify-center py-2 m-1 px-4 ml-0 h-10 border border-gray-500 text-center border-l-0 rounded-md rounded-l-none shadow-sm text-sm font-medium text-white ${
    //                         enabled === "EXECUTIVE"
    //                             ? "bg-secondary border-secondary"
    //                             : "text-secondary bg-white hover:bg-gray-50"
    //                     }  focus:outline-none  `}
    //                 >
    //                     Executive
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // };

    useEffect(() => {
        handleErrors();
        // eslint-disable-next-line
    }, [fields]);

    const handleErrors = () => {
        let insideErrors = {};
        if (fields?.first_name?.length < 2) {
            insideErrors.first_name = true;
        }
        if (fields?.last_name?.length < 2 || fields?.last_name === undefined) {
            insideErrors.last_name = true;
        }

        if (isValidEmail(fields?.email) === false) {
            insideErrors.email = true;
        }
        if (isValidPhone(fields?.mobile_phone) === false) {
            insideErrors.mobile_phone = true;
        }

        setErrors(insideErrors);
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const [isEmailAvailable] = useMutation(IS_EMAIL_AVAILABLE, {
        variables: {
            email: fields?.email,
        },
        update(cache, result) {
            if (result?.data?.isEmailAddressAvailable?.exists) {
                toast.error(
                    `An ${capitalizeFirstLetter(
                        result?.data?.isEmailAddressAvailable?.existing_account_type.toLowerCase()
                    )} account with that email already exist in the system`
                );
            } else {
                if (edit) {
                    updateAdmin();
                } else {
                    newAdmin();
                }
            }
        },
    });

    const handleEditCase = () => {
        if (fields?.email === emailCopy) {
            updateAdmin();
        } else {
            isEmailAvailable();
        }
    };

    const [deleteAdmin] = useMutation(DELETE_USER, {
        variables: {
            id: [user?.id],
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_USERS_QUERY,
            });
            delete Object.assign(result.data, {
                node: result.data["deleteUser"],
            })["deleteUser"];

            cache.writeQuery({
                query: FETCH_USERS_QUERY,
                data: {
                    users: {
                        edges: [
                            result.data,
                            ...data.users.edges.filter(
                                (u) => u.node.id === result.data.node.id
                            ),
                        ],
                    },
                },
            });

            setShowModal(false)
        },
    });


    const [newAdmin] = useMutation(CREATE_ADMIN, {
        variables: {
            email: fields.email,
            first_name: fields.first_name,
            last_name: fields.last_name,
            office_phone: fields?.office_phone,
            office_phone_ext: fields?.office_phone_ext,
            mobile_phone: fields?.mobile_phone,
            title: fields?.title,
            type: "ADMIN",
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_USERS_QUERY,
            });

            delete Object.assign(result.data, {
                node: result.data["createUser"],
            })["createUser"];

            cache.writeQuery({
                query: FETCH_USERS_QUERY,
                data: {
                    users: {
                        edges: [result.data, ...data.users.edges],
                    },
                },
            });
            toast.success(`${fields?.first_name + fields?.last_name} Created!`);
            cleanUp()
        },
    });

    const [updateAdmin] = useMutation(UPDATE_ADMIN, {
        variables: {
            id: fields.id,
            email: fields.email,
            first_name: fields.first_name,
            last_name: fields.last_name,
            office_phone: fields?.office_phone,
            office_phone_ext: fields?.office_phone_ext,
            mobile_phone: fields?.mobile_phone,
            title: fields?.title,
            type: "ADMIN",
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_USERS_QUERY,
            });
            delete Object.assign(result.data, {
                node: result.data["updateUser"],
            })["updateUser"];

            cache.writeQuery({
                query: FETCH_USERS_QUERY,
                data: {
                    users: {
                        edges: [
                            result.data,
                            ...data.users.edges.filter(
                                (u) => u.node.id !== result.data.node.id
                            ),
                        ],
                    },
                },
            });
            setFields(result.data.node);
            toast.success(`${fields?.first_name} saved!`);
        },
    });

    useEffect(() => {
        let finalError =
            errors?.first_name || errors?.last_name || errors?.email;

        setFinalError(finalError);
    }, [errors]);

    const modalContent = () => {
        return(
            <div className="text-gray-500 text-lg font-medium px-4 ">
                Are you sure you want to Archive {fields?.first_name} {fields?.last_name} ?
            </div>
        )
    }

    const modal = () => {
        return (
            <>
                <Modal
                    title="Confirm Archive"
                    submitLabel="Confirm"
                    onClose={() => setShowModal(false)}
                    IconJSX={<IconJSX />}
                    Content={modalContent()}
                    onSubmit={() => deleteAdmin()}
                    show={showModal}
                />
            </>
        );
    };

    const [resetPassword] = useMutation(FORGET_PASSWORD, {
        variables: {
            email: fields?.email,
            requestingForAnother: organizationNode?.id !== fields?.id,
        },
        update(cache, result) {
            toast.success(
                `Thank you. An email has been sent to ${fields?.email} with instructions on how to reset password.`
            );
        },
    });

    const [sendUserInvite] = useMutation(SEND_USER_INVITE, {
        variables:{
            id:fields?.id
        },
        update(cache,result) {
            toast.success(`An invite has been sent to ${fields?.email} with instructions.`)
        }
    })

    return (
        <div className="grid grid-cols-6 border rounded-lg  rounded-t-none bg-white ">
            {modal()}
            {fillColumn ? (
                <>
                    {/* <div className="col-span-6 flex sm:col-span-6 border-b py-3">
                        {switchButton()}
                    </div> */}
                    <TextField
                        flex
                        parentClass="col-span-6 sm:col-span-6 border-b py-3"
                        id="first_name"
                        label="First Name"
                        onChange={handleChange}
                        value={fields?.first_name}
                        name="first_name"
                        placeholder="First Name"
                        type="text"
                        disabled={archieved}
                        errorClassName="mb-2"
                        error={errors?.first_name}
                        errorMessage={"First name is required"}
                    />
                    <TextField
                        flex
                        parentClass="col-span-6 sm:col-span-6 border-b py-3"
                        id="last_name"
                        value={fields?.last_name}
                        onChange={handleChange}
                        label="Last Name"
                        name="last_name"
                        errorClassName="mb-2"
                        error={errors?.last_name}
                        errorMessage={"Last name is required"}
                        placeholder="Last Name"
                        type="text"
                        disabled={archieved}
                    />

                    <TextField
                        flex
                        width="w-24"
                        parentClass="col-span-6 sm:col-span-6 border-b py-3"
                        id="title"
                        onChange={handleChange}
                        label="Title"
                        value={fields && fields.title}
                        name="title"
                        placeholder="Title"
                        type="text"
                        disabled={archieved}
                    />

                    <div className="col-span-6 border-b grid sm:grid-cols-3  items-start justify-between px-4 xl:px-4 sm:items-center w-full py-3 ">
                        <label
                            htmlFor="email"
                            className="hover:block  text-md col-span-1  font-medium text-secondary"
                        >
                            Email
                        </label>
                        <div className="col-span-2 flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    value={fields?.email}
                                    placeholder="xyz@gmail.com"
                                    id="email"
                                    className={`mt-1 block col-span-1 focus:outline-none shadow-sm sm:text-sm rounded-md ${
                                        errors?.email
                                            ? "input-error"
                                            : " input-no-error"
                                    }`}
                                />
                                {errors?.email ? (
                                    <p
                                        className={`self-end pl-2 text-xs text-brickRed font-medium`}
                                    >
                                        A valid email required
                                    </p>
                                ) : null}
                            </div>

                            {!fields?.email_verified_at && edit === true ? (
                                <div className="col-span-2 sm:col-start-3 xl:col-start-4 bg-primary px-5 py-2 rounded-lg text-white font-title text-sm hover:opacity-75 cursor-pointer" onClick={() => sendUserInvite()}>
                                    Send Invite
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <TextField
                        flex
                        width="w-32"
                        label="Office Phone"
                        onChange={handleChange}
                        parentClass="col-span-4 sm:col-span-6 border-b py-3"
                        id="officePhone"
                        value={fields && fields.office_phone}
                        name="office_phone"
                        placeholder="123-456-7890"
                        type="tel"
                        disabled={archieved}
                    />
                    <TextField
                        width="w-16"
                        flex
                        label="Ext."
                        onChange={handleChange}
                        value={fields && fields.office_phone_ext}
                        parentClass="col-span-2 sm:col-span-6 border-b py-3"
                        id="officeExtension"
                        name="office_phone_ext"
                        placeholder="112"
                        disabled={archieved}
                        type="tel"
                    />
                    <TextField
                        flex
                        width="w-32"
                        label="Mobile Phone"
                        parentClass="col-span-4 sm:col-span-6 py-3"
                        id="mobilePhone"
                        onChange={handleChange}
                        value={fields && fields.mobile_phone}
                        name="mobile_phone"
                        placeholder="123-456-7890"
                        type="tel"
                        disabled={archieved}
                    />
                </>
            ) : null}
            {fillColumn ? (
                <div className="col-span-6 sm:col-span-6 border-t py-3">
                    <div className="flex flex-col md:flex-row items-start sm:items-center justify-between gap-5 px-2 h-full">
                        <div className="flex flex-col md:flex-row gap-5">
                            {fields?.email_verified_at && edit === true ? (
                                <Button
                                    title="Archive Administrator"
                                    onClick={() => setShowModal(true)}
                                    color="red-800"
                                />
                            ) : null}
                            {edit ? (
                                <>
                                    <Button
                                        title="Reset Password"
                                        color="secondary"
                                        onClick={() => resetPassword()}
                                    />
                                </>
                            ) : null}
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            {edit ? (
                                <Button
                                    disabled={finalError}
                                    title="Save Updates"
                                    color="secondary"
                                    onClick={() => handleEditCase()}
                                />
                            ) : null}
                            {edit === true ? null : (
                                <Button
                                    disabled={finalError}
                                    title="Save and Send Invite"
                                    color="secondary"
                                    onClick={() => isEmailAvailable()}
                                />
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CreateAdmin;
