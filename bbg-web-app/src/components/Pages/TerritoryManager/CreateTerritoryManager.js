import React, { useState, useEffect, useContext } from "react";
import TextField from "../../FormGroups/Input";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import {
    CREATE_TERRITORY_MANAGER,
    DELETE_USER,
    DELETE_TERRITORY_MANAGER_PROFILE_IMAGE,
    FETCH_TERRITORY_MANAGERS_QUERY,
    MASS_UPDATE_TMS,
    UPDATE_TERRITORY_MANAGER,
    USER_PROFILE_UPLOAD,
} from "../../../lib/user";
import { FETCH_STATES_QUERY } from "../../../lib/common";
import Button from "../../Buttons";
import CommonSelect from "../../Select";
import { isValidEmail, isValidPhone } from "../../../util/validations";
import Modal from "../../Modal";
import { XCircleIcon } from "@heroicons/react/solid";
import { FORGET_PASSWORD } from "../../../lib/auth";
import { AuthContext } from "../../../contexts/auth";

const CreateTerritoryManager = ({
    archieved,
    edit,
    user,
    fillColumns,
    searchString,
    afterArchive,
    SearchStringHandler,
}) => {
    const [fields, setFields] = useState(user);
    const [assignStates, setAssignStates] = useState([]);
    const [callAction, setCallAction] = useState(false);
    const [finalError, setFinalError] = useState(false);
    const [reAssignmentBuilders, setReAssignmentBuilders] = useState();
    const [showModal, setShowModal] = useState(false);
    const [stepTwoOfModal, setStepTwoOfModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState();
    const [checked, setChecked] = useState();
    const [firstTM, setFirstTM] = useState();
    const [firstMutationObject, setFirstMutationObject] = useState();
    const [firstMutation, setFirstMutation] = useState();
    const [secondMutation, setSecondMutation] = useState(false);
    const [files, setFiles] = useState([]);
    const [imageUploadMode, setImageUploadMode] = useState();

    const { type } = useContext(AuthContext);

    const [errors, setErrors] = useState({
        first_name: false,
        last_name: false,
        email: false,
        mobile_phone: false,
        address: false,
        address2: false,
        zip_postal: false,
        state: false,
    });

    useEffect(() => {
        if (edit === false) {
            setFields({
                ...fields,
                first_name: searchString,
            });
        }
        // eslint-disable-next-line
    }, [searchString]);

    useEffect(() => {
        if (callAction === true) {
            updateTerritoryManager();
            setCallAction(false);
        }
        // eslint-disable-next-line
    }, [callAction]);

    useEffect(() => {
        if (edit === false) {
            setFields({
                ...fields,
                id: "",
                first_name: searchString?.length > 0 ? searchString : "",
                last_name: "",
                email: "",
                office_phone: "",
                office_phone_ext: "",
                address: "",
                address2: "",
                city: "",
                zip_postal: "",
                mobile_phone: "",
                state: undefined,
                email_verified_at: "",
                userImage: "",
                states: [],
            });
            setImageUploadMode(true);
            setAssignStates(() => []);
        }
        // eslint-disable-next-line
    }, [user, edit]);

    useEffect(() => {
        //This Use-Effect fills the Data
        if (edit === true) {
            if (user?.userImage) {
                setImageUploadMode(false);
            } else {
                setImageUploadMode(true);
            }
            setFiles([]);
            setFields({
                ...fields,
                id: user?.id,
                first_name: user?.first_name,
                last_name: user?.last_name,
                email: user?.email,
                office_phone: user?.office_phone,
                office_phone_ext: user?.office_phone_ext,
                city: user?.city,
                address: user?.address,
                address2: user?.address2,
                mobile_phone: user?.mobile_phone,
                zip_postal: user?.zip_postal,
                states: user?.states,
                userImage: user?.userImage,
                email_verified_at: user?.email_verified_at,
                state: {
                    name: user?.state?.name,
                    value: user?.state?.id,
                },
            });
            let states = user?.managedStates?.edges?.map((item) => {
                let object = {};
                object.value = item?.node?.id;
                object.label = item?.node?.name;

                return object;
            });
            setAssignStates(states);
        }
        //eslint-disable-next-line
    }, [user, edit]);

    const stateshandler = (e) => {
        const values = e.map((item) => {
            let object = {};
            object.value = item?.value;
            object.label = item?.label;

            return object;
        });
        setAssignStates(values);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields({
            ...fields,
            [name]: value,
        });
        if (fields?.[name]?.length > 0 && name !== "email" && name !== "mobile_phone") {
            setErrors({
                ...errors,
                [name]: false,
            });
        }
        if (name === "email" && isValidEmail(fields?.email) === true) {
            setErrors({
                ...errors,
                email: false,
            });
        }
        if (name === "mobile_phone" && isValidPhone(fields?.mobile_phone) === true) {
            setErrors({
                ...errors,
                email: false,
            });
        }
    };

    useEffect(() => {
        handleErrors();
        // eslint-disable-next-line
    }, [fields, assignStates]);

    const handleErrors = () => {
        let insideErrors = {};
        if (fields?.first_name?.length < 2) {
            insideErrors.first_name = true;
        }
        if (fields?.last_name?.length < 2 || fields?.last_name === undefined) {
            insideErrors.last_name = true;
        }
        if (fields?.address?.length < 5 || fields?.address === undefined) {
            insideErrors.address = true;
        }
        if (fields?.state?.id === null || fields?.state === undefined) {
            insideErrors.state = true;
        }
        if (fields?.city?.length < 2 || fields?.city === undefined) {
            insideErrors.city = true;
        }
        if (fields?.zip_postal?.length < 5 || fields?.zip_postal === undefined) {
            insideErrors.zip_postal = true;
        }
        if (assignStates?.length < 1) {
            insideErrors.assignStates = true;
        }

        if (isValidEmail(fields?.email) === false) {
            insideErrors.email = true;
        }
        if (isValidPhone(fields?.mobile_phone) === false) {
            insideErrors.mobile_phone = true;
        }

        setErrors(insideErrors);
    };

    const { data: states } = useQuery(FETCH_STATES_QUERY);

    const [newTerritoryManager, { loading: newLoading }] = useMutation(CREATE_TERRITORY_MANAGER, {
        variables: {
            first_name: fields?.first_name,
            last_name: fields?.last_name,
            email: fields?.email,
            address: fields?.address,
            address2: fields?.address2,
            office_phone: fields?.office_phone,
            office_phone_ext: fields?.office_phone_ext,
            mobile_phone: fields?.mobile_phone,
            zip_postal: fields?.zip_postal,
            city: fields?.city,
            state_id: fields?.state?.id,
            managedStates: {
                sync: assignStates?.map((item) => item?.value) || [],
            },
            type: "TERRITORY_MANAGER",
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_TERRITORY_MANAGERS_QUERY,
            });

            delete Object.assign(result.data, {
                node: result.data["createUser"],
            })["createUser"];

            cache.writeQuery({
                query: FETCH_TERRITORY_MANAGERS_QUERY,
                data: {
                    users: {
                        edges: [result.data, ...data.users.edges],
                    },
                },
            });
            SearchStringHandler();
            setFields({ ...fields, first_name: "" });
            toast.success("New Territory Manager Created");
            if (files?.length > 0) {
                updateUserImage({
                    variables: {
                        id: result?.data?.node?.id,
                        image: files,
                    },
                });
            }
        },
    });
    const { data } = useQuery(FETCH_TERRITORY_MANAGERS_QUERY, {
        notifyOnNetworkStatusChange: false,
    });

    const [updateUserImage] = useMutation(USER_PROFILE_UPLOAD, {
        update(cache, result) {
            setFiles([]);
        },
    });

    const [deleteTerritoryManagerImage, { loading: updateImageLoading }] = useMutation(
        DELETE_TERRITORY_MANAGER_PROFILE_IMAGE,
        {
            variables: {
                id: fields?.id,
            },
            update(cache, result) {
                const data = cache.readQuery({
                    query: FETCH_TERRITORY_MANAGERS_QUERY,
                });
                delete Object.assign(result.data, {
                    node: result.data["deleteUserImage"],
                })["deleteUserImage"];

                cache.writeQuery({
                    query: FETCH_TERRITORY_MANAGERS_QUERY,
                    data: {
                        users: {
                            edges: [
                                result.data,
                                ...data.users.edges.filter((u) => u?.node?.id !== result?.data?.node?.id),
                            ],
                        },
                    },
                });
                setFields(result.data.node);
                toast.success(`${fields.first_name} ${fields.last_name} Updated`);
                setImageUploadMode(false);
            },
        }
    );

    const [updateTerritoryManager, { loading: updateLoading }] = useMutation(UPDATE_TERRITORY_MANAGER, {
        variables: {
            type: "TERRITORY_MANAGER",
            id: fields?.id,
            first_name: fields?.first_name,
            last_name: fields?.last_name,
            email: fields?.email,
            address: fields?.address,
            address2: fields?.address2,
            zip_postal: fields?.zip_postal,
            office_phone: fields?.office_phone,
            office_phone_ext: fields?.office_phone_ext,
            mobile_phone: fields?.mobile_phone,
            city: fields?.city,
            state_id: fields?.state?.id,
            managedStates: {
                sync: assignStates?.map((item) => item?.value) || [],
            },
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_TERRITORY_MANAGERS_QUERY,
            });
            delete Object.assign(result.data, {
                node: result.data["updateUser"],
            })["updateUser"];

            cache.writeQuery({
                query: FETCH_TERRITORY_MANAGERS_QUERY,
                data: {
                    users: {
                        edges: [result.data, ...data.users.edges.filter((u) => u.node.id !== result.data.node.id)],
                    },
                },
            });
            setFields(result.data.node);
            toast.success(`${fields.first_name} ${fields.last_name} Updated`);
            setImageUploadMode(false);
            if (files?.length > 0) {
                updateUserImage({
                    variables: {
                        id: fields.id,
                        image: files,
                    },
                });
            }
        },
    });

    const reassignModalHandler = () => {
        setReAssignmentBuilders(user?.managedOrganizations?.edges);
        setShowModal(true);
    };

    const handleAssignSelect = (e, i) => {
        if (newAssignment) {
            setNewAssignment({
                ...newAssignment,
                [i]: {
                    ...newAssignment[i],
                    label: e.label,
                    value: e.value,
                },
            });
        } else {
            setNewAssignment({
                ...newAssignment,
                [i]: {
                    label: e.label,
                    value: e.value,
                },
            });
        }
    };

    const reAssignBuilders = () => {
        let array = [];
        reAssignmentBuilders?.forEach((item) => {
            let object = {};
            object.id = item?.node?.id;

            if (newAssignment?.[item?.node?.id]?.value) {
                object.territoryManagers = {
                    disconnect: [user?.id],
                    syncWithoutDetaching: [newAssignment?.[item?.node?.id]?.value],
                };
            } else {
                object.territoryManagers = {
                    disconnect: [user?.id],
                };
            }

            array.push(object);
        });

        setFirstMutationObject(array);
        setFirstMutation(true);
    };

    useEffect(() => {
        if (firstMutation) {
            massUpdateTM();
        }
        // eslint-disable-next-line
    }, [firstMutation]);

    const [massUpdateTM] = useMutation(MASS_UPDATE_TMS, {
        variables: {
            organizations: firstMutationObject,
        },
        update(cache, result) {
            setFirstMutation(false);
            setFirstMutationObject([]);
            setStepTwoOfModal(true);
        },
    });

    const archiveTM = () => {
        setSecondMutation(true);
    };

    useEffect(() => {
        if (secondMutation === true) {
            deleteTM();
        }
        // eslint-disable-next-line
    }, [secondMutation]);

    const [deleteTM] = useMutation(DELETE_USER, {
        variables: {
            id: [user?.id],
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_TERRITORY_MANAGERS_QUERY,
            });
            delete Object.assign(result.data, {
                node: result.data["deleteUser"],
            })["deleteUser"];

            cache.writeQuery({
                query: FETCH_TERRITORY_MANAGERS_QUERY,
                data: {
                    users: {
                        edges: [result.data, ...data.users.edges.filter((u) => u.node.id === result.data.node.id)],
                    },
                },
            });
            setSecondMutation(false);
            setShowModal(false);
            setStepTwoOfModal(false);
            setFields({
                id: "",
                first_name: searchString?.length > 0 ? searchString : "",
                last_name: "",
                email: "",
                office_phone: "",
                office_phone_ext: "",
                address: "",
                address2: "",
                city: "",
                zip_postal: "",
                mobile_phone: "",
                state: undefined,
                email_verified_at: "",
                userImage: "",
            });
            toast.success(user?.first_name + " " + user?.last_name + " Archived!");
            afterArchive();
        },
    });

    useEffect(() => {
        if (showModal && reAssignmentBuilders?.length === 0) {
            setStepTwoOfModal(true);
        }
    }, [showModal, reAssignmentBuilders]);

    const modal = () => {
        return (
            <>
                <Modal
                    width="3xl"
                    title={!stepTwoOfModal ? "Reassign Builders" : `Archive Territory Manager `}
                    Content={!stepTwoOfModal ? Modal1Content() : Modal2Content()}
                    onSubmit={!stepTwoOfModal ? () => reAssignBuilders() : () => archiveTM()}
                    submitLabel={!stepTwoOfModal ? "Next" : "Confirm"}
                    onClose={() => setShowModal(false)}
                    show={showModal}
                    overflowHidden
                />
            </>
        );
    };

    const handleUseForAll = (id) => {
        setChecked(!checked);
        setFirstTM(id);
    };

    useEffect(() => {
        if (checked === true && firstTM) {
            let object = {};
            reAssignmentBuilders?.forEach((item) => {
                let id = item?.node?.id;
                object[id] = {
                    value: newAssignment?.[firstTM]?.value,
                    label: newAssignment?.[firstTM]?.label,
                };
            });

            setNewAssignment(object);
        }
        // eslint-disable-next-line
    }, [checked, firstTM]);

    const Modal1Content = () => {
        return (
            <div className="flex flex-col px-6 overflow-auto  max-h-partial scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                {reAssignmentBuilders?.map((item, index) => {
                    return (
                        <div className="grid grid-cols-3 items-center gap-5">
                            <p>{item?.node?.name}</p>
                            <CommonSelect
                                optionsToRemove={user?.id}
                                options={{
                                    edges: data?.users?.edges?.map((item) => {
                                        let outObject = {};
                                        let object = {};
                                        object.id = item?.node?.id;
                                        object.name = item?.node?.first_name + " " + item?.node?.last_name;
                                        outObject.node = object;
                                        return outObject;
                                    }),
                                }}
                                value={
                                    newAssignment
                                        ? {
                                              value: newAssignment[item?.node?.id]?.value,
                                              label: newAssignment[item?.node?.id]?.label,
                                          }
                                        : null
                                }
                                onChange={(e) => {
                                    handleAssignSelect(e, item?.node?.id);
                                }}
                                className="col-span-1 lg:w-60 py-1"
                                placeHolder="Leave Unassigned"
                            />
                            {index === 0 ? (
                                <div className="flex items-start">
                                    <div className="h-5 flex items-center ml-5 ">
                                        <input
                                            id="useForAll"
                                            name="useForAll"
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => handleUseForAll(item?.node?.id)}
                                            className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 mb-3 sm:mb-0 text-sm">
                                        <label htmlFor="useForAll" className="font-medium text-secondary">
                                            Use for all Builders
                                        </label>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        );
    };

    const Modal2Content = () => {
        return (
            <div className="flex px-6 font-title text-secondary  text-lg">
                Confirm Archive of{" "}
                <span className="font-semibold ml-1">
                    {" "}
                    {user?.first_name} {user?.last_name}{" "}
                </span>
            </div>
        );
    };

    useEffect(() => {
        let finalError =
            errors?.first_name ||
            errors?.last_name ||
            errors?.address ||
            errors?.state ||
            errors?.city ||
            errors?.zip_postal ||
            errors?.email ||
            errors?.mobile_phone ||
            errors?.assignStates;
        setFinalError(finalError);
    }, [errors]);

    const thumbsContainer = {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    };

    const thumb = {
        display: "inline-flex",
        borderRadius: 2,
        position: "relative",
        border: "1px solid #eaeaea",
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: "border-box",
    };

    const thumbInner = {
        display: "flex",
        minWidth: 0,
        overflow: "hidden",
    };

    const img = {
        display: "block",
        width: "auto",
        height: "100%",
    };

    const removeFile = (name) => {
        setFiles(() => files.filter((item) => item.name !== name));
    };

    const handleEditMutation = () => {
        if (files.length === 0) {
            deleteTerritoryManagerImage();
        } else {
            updateTerritoryManager();
        }
    };

    const handleCreateMutation = () => {
        newTerritoryManager();
    };

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    function StyledDropzone({ files, setFiles, removeFile }) {
        const { getRootProps, getInputProps } = useDropzone({
            maxFiles: 1,
            accept: ".png,.jpeg,.jpg",
            maxSize: 4194304,
            onDrop: (acceptedFiles) => {
                setFiles(
                    acceptedFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        })
                    )
                );
            },
            onDropRejected: (rejectedFile) => {},
        });

        const thumbs = files.map((file) => (
            <div style={thumb} key={file.name}>
                <XCircleIcon
                    className="text-brickRed w-5 h-5 absolute right-0 top-0 cursor-pointer"
                    onClick={() => removeFile(file.name)}
                />
                <div style={thumbInner}>
                    <img src={file.preview} style={img} alt="profile" />
                </div>
            </div>
        ));

        return (
            <section className="container px-4 border-b border-gray-500 flex-1">
                <p className=" font-title py-3  px-2 h2">Profile Photo</p>
                {imageUploadMode && files?.length !== 1 ? (
                    <div className="pb-4 sm:col-span-2" {...getRootProps({})}>
                        <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-300 border rounded-lg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-secondary hover:text-secondary85 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-secondary"
                                    >
                                        <span>Upload a file</span>
                                        <input {...getInputProps()} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                ) : null}
                <aside style={thumbsContainer}>
                    {!imageUploadMode && user?.userImage ? (
                        <div style={thumb}>
                            <XCircleIcon
                                className="text-brickRed w-5 h-5 absolute right-0 top-0 cursor-pointer"
                                onClick={() => {
                                    setImageUploadMode(true);
                                }}
                            />
                            <div style={thumbInner}>
                                <img src={user?.userImage} style={img} alt="profile" />
                            </div>
                        </div>
                    ) : files?.length > 0 ? (
                        thumbs
                    ) : null}
                </aside>
            </section>
        );
    }

    const [resetPassword] = useMutation(FORGET_PASSWORD, {
        variables: {
            email: fields?.email,
            requestingForAnother: type !== "TERRITORY_MANAGER",
        },
        update(cache, result) {
            toast.success(
                `Thank you. An email has been sent to ${fields?.email} with instructions on how to reset password.`
            );
        },
    });

    return (
        <div className="grid grid-cols-6 bg-white  rounded-lg  overflow-hidden h-full">
            <div
                className="flex flex-col col-span-6 md:flex-row justify-between items-center   border-b-2 border-gray-400"
                style={{ maxHeight: "68px" }}
            >
                <div className=" font-title py-5 px-4 text-center h2">
                    {edit && fields?.first_name
                        ? `${fields?.first_name} ${fields?.last_name}`
                        : "Create Territory Manager"}
                </div>
            </div>
            <div className="col-span-9 lg:col-span-4 overflow-hidden">
                <div className="h-full relative   lg:pr-0  2xl:pr-0">
                    <div className="h-full flex flex-col">
                        <div className="flex  w-full h-full lg:min-h-smallMin overflow-auto  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                            {fillColumns ? (
                                <div className="w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                    <div className="grid grid-cols-6 col-span-6 2xl:col-span-4">
                                        <TextField
                                            flex
                                            parentClass="col-span-6 sm:col-span-6 border-b py-4 "
                                            id="first_name"
                                            label="First Name"
                                            onChange={handleChange}
                                            value={fields?.first_name}
                                            name="first_name"
                                            placeholder="First Name"
                                            type="text"
                                            errorClassName="mb-2"
                                            error={errors?.first_name}
                                            errorMessage={"First name is required"}
                                            disabled={archieved}
                                        />
                                        <TextField
                                            flex
                                            parentClass="col-span-6 sm:col-span-6 border-b py-4 "
                                            id="last_name"
                                            label="Last Name"
                                            onChange={handleChange}
                                            value={fields?.last_name}
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
                                            parentClass="col-span-6 sm:col-span-6 border-b py-4 "
                                            id="email"
                                            label="Email"
                                            onChange={handleChange}
                                            value={fields?.email}
                                            name="email"
                                            errorClassName="mb-2"
                                            error={errors?.email}
                                            errorMessage={"A valid Email is required"}
                                            placeholder="example@email.com"
                                            type="email"
                                            disabled={archieved}
                                        />

                                        <div className="border-b col-span-6 px-4   grid grid-col-2 grid-cols-3 items-start justify-between sm:items-center w-full ">
                                            <TextField
                                                width="w-32"
                                                label="Office Phone"
                                                onChange={handleChange}
                                                parentClass="grid grid-cols-2 items-center col-span-2 py-4 "
                                                id="office_phone"
                                                value={fields && fields.office_phone}
                                                name="office_phone"
                                                placeholder="123-456-7890"
                                                type="tel"
                                                disabled={archieved}
                                            />

                                            <TextField
                                                width="w-16"
                                                label="Extenstion"
                                                onChange={handleChange}
                                                value={fields?.office_phone_ext}
                                                parentClass="grid grid-cols-2 col-span-1 items-center py-4 "
                                                id="office_phone_ext"
                                                name="office_phone_ext"
                                                placeholder="1124"
                                                disabled={archieved}
                                                type="tel"
                                            />
                                        </div>

                                        <TextField
                                            flex
                                            width="w-36"
                                            label="Cell"
                                            parentClass="col-span-6 sm:col-span-6 border-b py-4 "
                                            id="mobile_phone"
                                            onChange={handleChange}
                                            value={fields?.mobile_phone}
                                            name="mobile_phone"
                                            placeholder="123-456-7890"
                                            type="tel"
                                            errorClassName="mb-2"
                                            error={errors?.mobile_phone}
                                            errorMessage={"A valid Mobile Number is required"}
                                            disabled={archieved}
                                        />
                                        <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-3 gap-5 items-start justify-between  sm:items-center w-full">
                                            <TextField
                                                errorBelow
                                                width="w-full"
                                                label="Address"
                                                onChange={handleChange}
                                                parentClass="sm:grid sm:grid-cols-2 items-center col-span-2 py-7 pt-4"
                                                id="address"
                                                inputClass="ml-1"
                                                value={fields?.address}
                                                name="address"
                                                error={errors?.address}
                                                errorMessage={"A valid address is required"}
                                                placeholder="Address Line 1"
                                                type="text"
                                                disabled={archieved}
                                            />
                                            <TextField
                                                width="w-full"
                                                onChange={handleChange}
                                                value={fields?.address2}
                                                parentClass="grid mt-2 sm:mt-0 grid-cols-1 col-span-1 items-center  py-7 pt-4"
                                                id="address2"
                                                name="address2"
                                                placeholder="Unit 123"
                                                disabled={archieved}
                                                type="text"
                                            />
                                        </div>
                                        <TextField
                                            flex
                                            width="w-44"
                                            label="City"
                                            onChange={handleChange}
                                            parentClass="col-span-6 sm:col-span-6 border-b py-4 "
                                            id="city"
                                            error={errors?.city}
                                            errorMessage={"A valid city is required"}
                                            value={fields?.city}
                                            name="city"
                                            errorClassName="mb-2"
                                            placeholder="City"
                                            type="text"
                                            disabled={archieved}
                                        />
                                        <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-3 items-start justify-between py-4 sm:items-center w-full">
                                            <div className="sm:grid sm:grid-cols-3 col-span-3 items-center">
                                                <label className="block text-md font-medium text-secondary">
                                                    State/Province
                                                </label>
                                                <CommonSelect
                                                    value={{
                                                        label: fields?.state?.name,
                                                        value: fields?.state?.id,
                                                    }}
                                                    error={errors?.state}
                                                    edit={edit}
                                                    options={states && states.states}
                                                    className=" w-60"
                                                    placeHolder="State"
                                                    menuPlacement={"top"}
                                                    onChange={(e) =>
                                                        setFields({
                                                            ...fields,
                                                            state: {
                                                                id: e.value,
                                                                name: e.label,
                                                            },
                                                        })
                                                    }
                                                />
                                                {errors?.state ? (
                                                    <p className="self-end col-start-2 col-span-3 3xl:col-span-1 3xl:col-start-3  text-xs px-2 text-brickRed font-medium">
                                                        {" "}
                                                        Select a state
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                        <TextField
                                            flex
                                            width="w-32"
                                            parentClass="col-span-4 sm:col-span-6 py-4 "
                                            onChange={handleChange}
                                            value={fields?.zip_postal}
                                            id="zip_postal"
                                            label="Zip/Postal"
                                            name="zip_postal"
                                            placeholder="90210"
                                            disabled={archieved}
                                            type="text"
                                            error={errors?.zip_postal}
                                            errorMessage={"A valid ZIP is required"}
                                            errorClassName="mb-2"
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white  overflow-auto rounded-lg rounded-l-none col-span-9 lg:col-span-2  2xl:max-h-partial">
                <div className="h-full overflow-auto relative">
                    <div className="inset-0  overflow-auto h-full flex flex-col">
                        <div className="flex overflow-auto flex-col w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                            {fillColumns ? (
                                <StyledDropzone files={files} setFiles={setFiles} removeFile={removeFile} />
                            ) : null}
                            {fillColumns ? (
                                <div className="flex w-full h-full flex-1">
                                    <div className=" col-span-6 sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full h-full xl:py-0">
                                        <p className=" font-title pt-3  px-4 h2 col-span-2">State Assignment</p>
                                        <div className="flex flex-col col-span-2 items-center px-4">
                                            <CommonSelect
                                                error={errors?.assignStates}
                                                value={assignStates}
                                                edit={edit}
                                                isMulti
                                                options={states && states.states}
                                                optionsToRemove={assignStates?.map((item) => parseInt(item?.value))}
                                                placeHolder="State"
                                                className="w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 mt-2"
                                                menuPlacement={"top"}
                                                onChange={(e) => {
                                                    stateshandler(e);
                                                }}
                                            />
                                            {errors?.assignStates ? (
                                                <p className="self-end  text-xs px-2 text-brickRed font-medium">
                                                    {" "}
                                                    Select at least one state to assign
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            {fillColumns ? (
                <div className="py-2 pr-5 flex  col-span-9 items-end justify-end border-t">
                    {modal()}
                    {edit ? <Button title="Reset Password" color="secondary" onClick={() => resetPassword()} /> : null}
                    {fields?.email_verified_at ? (
                        <Button
                            color="brickRed"
                            title="Archive Territory Manager"
                            onClick={() => reassignModalHandler()}
                        />
                    ) : null}
                    <Button
                        color="primary"
                        disabled={finalError}
                        title={
                            edit
                                ? updateLoading || updateImageLoading
                                    ? "Saving Updates"
                                    : "Save Updates"
                                : newLoading
                                ? "Saving"
                                : "Save"
                        }
                        onClick={edit ? handleEditMutation : handleCreateMutation}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default CreateTerritoryManager;
