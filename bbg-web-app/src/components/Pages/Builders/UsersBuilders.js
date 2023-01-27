import React, { useContext, useState, useEffect } from "react";
import TextField from "../../FormGroups/Input";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import Button from "../../Buttons";
import { XCircleIcon } from "@heroicons/react/solid";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { GET_BUILDERS, UPDATE_USER } from "../../../lib/builders";
import { DELETE_USER } from "../../../lib/user";
import { AuthContext } from "../../../contexts/auth";
import { FORGET_PASSWORD } from "../../../lib/auth";
import Modal from "../../Modal";

const UsersBuilders = ({ user, callBack, openWhat, setUser }) => {

    const [edit, setEdit] = useState();
    const [active, setActive] = useState();
    const [fields, setFields] = useState();
    const [createNew, setCreateNew] = useState();
    const [requireUserAccount, setRequireUserAccount] = useState(false);
    const [deleteId, setDeleteId] = useState();
    const [showModal, setShowModal] = useState(false);



    const { organizationNode, type } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields({
            ...fields,
            [name]: value,
        });
    };

    useEffect(() => {
        if (openWhat === "user") {
            let item = user?.users?.edges?.find(
                (item) => item?.node?.id === organizationNode?.id
            );
            setUserData(item?.node);
        }
        // eslint-disable-next-line
    }, [openWhat, user]);

    const setUserData = (node) => {
        setActive(node?.id);
        setFields({ ...node });
        setEdit(true);
        setCreateNew(false);
        setRequireUserAccount(node?.require_user_account);
    };

    const [deleteUser] = useMutation(DELETE_USER, {
        variables: {
            id: [deleteId],
        },
        update(cache, result) {
            const data1 = cache.readQuery({
                query: GET_BUILDERS,
            })

            delete Object.assign(result.data, {
                node: result.data["updateOrganization"],
            })["updateOrganization"];

            const getNewOrganizationNode = (data) => {
                let organizationNode = data?.organizations?.edges?.find(((u) => u?.node?.id === result?.data?.deleteUser[0]?.organizations.edges[0]?.node?.id))?.node;
                let newOrganizationNode = {
                    ...organizationNode,
                    users: {
                        edges:
                            data?.organizations?.edges?.find(
                                (u) => u?.node?.id === result?.data?.deleteUser[0]?.organizations?.edges[0]?.node?.id
                            )?.node?.users?.edges?.filter((user) => user?.node?.id !== result?.data?.deleteUser[0]?.id),
                    }
                }
                return newOrganizationNode
            }
            setDeleteId("")
            setShowModal(false)
            toast.success(
                fields?.first_name + " " + fields?.last_name + " deleted!"
            );
            setUser(getNewOrganizationNode(data1))
        }

    });

    useEffect(() => {
        if (deleteId) {
            deleteUser()
        }
        // eslint-disable-next-line
    }, [deleteId])


    const handleCreateNew = () => {
        setEdit(false);
        setCreateNew(true);
        setFields({
            id: "",
            first_name: "",
            last_name: "",
            title: "",
            email: "",
            office_phone: "",
            office_phone_ext: "",
            mobile_phone: "",
        });
        setRequireUserAccount(false);
        setActive("");
    };

    const handleEditObject = () => {
        let object = {};
        let innerObject = {};
        innerObject.id = fields?.id;
        innerObject.first_name = fields?.first_name;
        innerObject.last_name = fields?.last_name;
        innerObject.title = fields?.title;
        innerObject.email = fields?.email;
        innerObject.office_phone = fields?.office_phone;
        innerObject.office_phone_ext = fields?.office_phone_ext;
        innerObject.mobile_phone = fields?.mobile_phone;
        innerObject.require_user_account = requireUserAccount;
        innerObject.password = fields?.password;
        innerObject.type = "BUILDERS";

        object.update = [innerObject];
        return object;
    };

    const handleCreateObject = () => {
        let object = {};
        let innerObject = {};
        innerObject.password = fields?.password;
        innerObject.first_name = fields?.first_name;
        innerObject.last_name = fields?.last_name;
        innerObject.title = fields?.title;
        innerObject.email = fields?.email;
        innerObject.office_phone = fields?.office_phone;
        innerObject.office_phone_ext = fields?.office_phone_ext;
        innerObject.mobile_phone = fields?.mobile_phone;
        innerObject.require_user_account = requireUserAccount;
        innerObject.type = "BUILDERS";

        object.create = [innerObject];
        return object;
    };

    const [updateOrganization, { loading: updateBuilderLoading }] = useMutation(UPDATE_USER, {
        variables: {
            organization_type: "BUILDERS",
            id: user?.id,
            users: edit ? handleEditObject() : handleCreateObject(),
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: GET_BUILDERS,
            });

            delete Object.assign(result.data, {
                node: result.data["updateOrganization"],
            })["updateOrganization"];

            cache.writeQuery({
                query: GET_BUILDERS,
                data: {
                    organizations: {
                        edges: [
                            result.data,
                            ...data.organizations.edges.filter(
                                (u) => u.node.id !== result?.data?.node?.id
                            ),
                        ],
                    },
                },
            });
            toast.success("Builder saved!");
            handleCreateNew();
            callBack(result?.data?.node);
        },
    });

    const [resetPassword] = useMutation(FORGET_PASSWORD, {
        variables: {
            email: fields?.email,
            requestingForAnother: type !== "BUILDERS" && fields?.id !== organizationNode?.id,
        },
        update(cache, result) {
            toast.success(
                `Thank you. An email has been sent to ${fields?.email} with instructions on how to reset password.`
            );
        },
    });

    const modalContent = () => {
        return (
            <div className="text-gray-500 text-lg font-medium px-4 ">
                Are you sure you want to delete {fields?.first_name} {fields?.last_name} ?
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
                    Content={modalContent()}
                    onSubmit={() => setDeleteId(fields?.id)}
                    show={showModal}
                />
            </>
        );
    };

    return (
        <div className="grid grid-cols-3 col-span-6">
            <div className="col-span-1 border-b border-r">
                <div className="flex items-center justify-between border-b px-4">
                    <p className="font-title py-2  col-span-1 text-secondary font-bold text-md ">
                        Users
                    </p>
                    <PlusCircleIcon
                        className="w-7 h-7 text-brickGreen cursor-pointer"
                        onClick={() => handleCreateNew()}
                    />
                </div>

                <div
                    className="flex  w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400"
                    style={{ minHeight: "50vmin" }}
                >
                    <div className="w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                        {modal()}
                        <ul className=" flex-0 w-full h-full  overflow-auto border-l  border-white scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                            {user?.users?.edges?.map((eachData, index) => {
                                return (
                                    <li
                                        className={`  border-b transition-all  border-l-4 cursor-pointer   hover:border-l-6  ${active === eachData.node.id
                                            ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                                            : "text-darkgray75 border-l-primary"
                                            }`}
                                        onClick={() =>
                                            setUserData(eachData?.node)
                                        }
                                    >
                                        <div className="relative">
                                            <div className="text-sm py-3 px-2 font-semibold  ">
                                                <div className="  focus:outline-none">
                                                    <span
                                                        className="absolute inset-0"
                                                        aria-hidden="true"
                                                    ></span>
                                                    <span className="mr-3 flex items-center justify-between" >
                                                        {eachData.node.fullName}
                                                        <div className="relative" onClick={() => setShowModal(true)} >
                                                            <XCircleIcon className="text-left w-7 h-7 text-brickRed" />
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            {edit === true || createNew === true ? (
                <div className="col-span-2 inset-0 flex w-full h-full flex-col">
                    <p className="font-title py-2  px-4 border-b text-secondary font-bold text-md col-span-2 ">
                        {edit === true
                            ? "Update " +
                            fields?.first_name +
                            " " +
                            fields?.last_name
                            : "Create User"}
                    </p>
                    <div className="flex  w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                        <div className="w-full scrollbar-thin h-full scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                            <div className="grid grid-cols-6 h-full col-span-6 2xl:col-span-4">
                                <TextField
                                    flex
                                    parentClass="col-span-6 sm:col-span-6 border-b py-3"
                                    inputClass="col-span-2"
                                    id="first_name"
                                    label="First Name"
                                    onChange={handleChange}
                                    value={fields?.first_name}
                                    name="first_name"
                                    placeholder="First Name"
                                    type="text"
                                />
                                <TextField
                                    flex
                                    parentClass="col-span-6 sm:col-span-6 border-b py-3"
                                    id="last_name"
                                    label="Last Name"
                                    inputClass="col-span-2"
                                    onChange={handleChange}
                                    value={fields?.last_name}
                                    name="last_name"
                                    placeholder="Last Name"
                                    type="text"
                                />
                                <TextField
                                    flex
                                    parentClass="col-span-6 sm:col-span-6 border-b py-3"
                                    id="title"
                                    label="Title"
                                    inputClass="col-span-2"
                                    onChange={handleChange}
                                    value={fields?.title}
                                    name="title"
                                    placeholder="Title"
                                    type="text"
                                />
                                <TextField
                                    flex
                                    parentClass="col-span-6 sm:col-span-6 border-b py-3"
                                    id="email"
                                    label="Email"
                                    inputClass="col-span-2"
                                    onChange={handleChange}
                                    value={fields?.email}
                                    name="email"
                                    placeholder="xyz@gmail.com"
                                    type="email"
                                    width=""
                                />

                                <div className="grid grid-cols-3 col-span-6 border-b">
                                    <TextField
                                        label="Office Phone"
                                        onChange={handleChange}
                                        inputClass="ml-1"
                                        parentClass="col-span-2 grid grid-cols-2 px-4 items-center py-3"
                                        id="office_phone"
                                        value={fields?.office_phone}
                                        width="w-36"
                                        name="office_phone"
                                        placeholder="1234352432"
                                        type="text"
                                    />
                                    <TextField
                                        onChange={handleChange}
                                        value={fields?.office_phone_ext}
                                        label="Ext."
                                        width="w-20"
                                        parentClass="col-span-1 grid grid-cols-2 px-4 items-center py-3 "
                                        id="office_phone_ext"
                                        name="office_phone_ext"
                                        placeholder="123"
                                        type="text"
                                    />
                                </div>

                                <TextField
                                    label="Mobile Phone"
                                    onChange={handleChange}
                                    flex
                                    parentClass="col-span-6 sm:col-span-6 border-b py-3"
                                    id="mobile_phone"
                                    value={fields?.mobile_phone}
                                    width="w-36"
                                    name="mobile_phone"
                                    placeholder="1234352432"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="py-2 px-5 flex  col-span-3 items-end justify-end  border-gray-400">
                {edit ? (
                    <Button
                        title="Reset Password"
                        color="secondary"
                        onClick={() => resetPassword()}
                    />
                ) : null}
                <Button
                    color="primary"
                    title={updateBuilderLoading ? "Saving" : "Save"}
                    onClick={() => updateOrganization()}
                />
            </div>
        </div>
    );
};

export default UsersBuilders;
