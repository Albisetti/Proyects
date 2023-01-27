import React, { useState, useEffect } from "react";
import TextField from "../../FormGroups/Input";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import RichText from "../../RichTextEditor";

import {
    CREATE_ORGANIZATION,
    FETCH_ORGANIZATIONS_QUERY,
    UPDATE_ORGANIZATION,
} from "../../../lib/organization";

import Button from "../../Buttons";
import SupplierPrograms from "./SupplierPrograms";
import CommonSelect from "../../Select";
import { FETCH_STATES_QUERY } from "../../../lib/common";
import { isValidEmail } from "../../../util/validations";

const CreateSupplier = ({
    archieved,
    edit,
    user,
    fillColumns,
    createNew,
    searchString,
    callBack,
    searched,
}) => {
    const [fields, setFields] = useState(user);
    const [errors, setErrors] = useState({
        contact_first_name: false,
        contact_last_name: false,
        contact_email: false,
        state:false
    });
    const [finalError,setFinalError] = useState(false)

    const { data: states } = useQuery(FETCH_STATES_QUERY);

    useEffect(() => {
        //This Use-Effect fills the Data
        if (edit === true) {
            setFields({
                ...fields,
                id: user?.id,
                name: user?.name,
                organization_type: user?.organization_type,
                address: user?.address,
                address2: user?.address2,
                state: user?.state,
                city: user?.city,
                zip_postal: user?.zip_postal,
                contact_first_name: user?.contact_first_name,
                contact_last_name: user?.contact_last_name,
                contact_title: user?.contact_title,
                contact_email: user?.contact_email,
                contact_office_phone: user?.contact_office_phone,
                contact_office_phone_ext: user?.contact_office_phone_ext,
                contact_mobile_phone: user?.contact_mobile_phone,
            });
        }
        //eslint-disable-next-line
    }, [user, edit]);

    useEffect(() => {
        if (edit === false) {
            setFields({
                ...fields,
                name: searchString === "" ? "" : searchString,
            });
        }
        // eslint-disable-next-line
    }, [searchString]);

    useEffect(() => {
        if (edit === false && createNew === true) {
            setFields({
                ...fields,
                name: searchString === "" ? "" : searchString,
                organization_type: "",
                address: "",
                address2: "",
                state: {
                    id: "",
                    name: "",
                },
                city: "",
                zip_postal: "",
                contact_first_name: "",
                contact_last_name: "",
                contact_title: "",
                contact_email: "",
                contact_office_phone: "",
                contact_office_phone_ext: "",
                contact_mobile_phone: "",
                notes:""
            });
        }
        // eslint-disable-next-line
    }, [user, edit]);

    const handleNotesEditorChange = (content, editor) => {
        setFields({
            ...fields,
            notes: content,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields({
            ...fields,
            [name]: value,
        });
        if(name !== "contact_email") {
            if (fields?.[name]?.length > 0) {
                setErrors({
                    ...errors,
                    [name]: false,
                });
            }
        }
        if (name === "contact_email" && isValidEmail(fields?.contact_email) === true) {
            setErrors({
                ...errors,
                contact_email: false,
            });
        }

    };





    useEffect(() => {
        let insideErrors = {}
        if (fields?.contact_first_name?.length < 2) {
            insideErrors.contact_first_name = true
        }
        if (fields?.contact_last_name?.length < 2 || fields?.contact_last_name === undefined) {
            insideErrors.contact_last_name = true
        }
        if (isValidEmail(fields?.contact_email) === false) {
            insideErrors.contact_email = true
        }
        if (fields?.state?.id === null || fields?.state === undefined || fields?.state === null || fields?.state?.id === '') {
            insideErrors.state = true;
        }
        if (!fields?.organization_type ) {
            insideErrors.organizationType = true;
        }

        let finalError = insideErrors?.contact_first_name || insideErrors?.contact_last_name || insideErrors?.contact_email || insideErrors?.organizationType || insideErrors?.state;
        setFinalError(finalError);
        setErrors(insideErrors)
         // eslint-disable-next-line
    }, [fields]);



    const [newOrganization, { loading: newLoading }] = useMutation(
        CREATE_ORGANIZATION,
        {
            variables: {
                name: fields.name,
                organization_type: fields.organization_type,
                city: fields.city,
                address: fields.address,
                address2: fields.address2,
                zip_postal: fields.zip_postal,
                notes: fields.notes,
                state_id: parseInt(fields?.state?.id),
                contact_first_name: fields.contact_first_name,
                contact_last_name: fields.contact_last_name,
                contact_title: fields.contact_title,
                contact_email: fields.contact_email,
                contact_office_phone: fields.contact_office_phone,
                contact_office_phone_ext: fields.contact_office_phone_ext,
                contact_mobile_phone: fields.contact_mobile_phone,
            },
            update(cache, result) {
                callBack();
                const data = cache.readQuery({
                    query: FETCH_ORGANIZATIONS_QUERY,
                });

                delete Object.assign(result.data, {
                    node: result.data["createOrganization"],
                })["createOrganization"];

                cache.writeQuery({
                    query: FETCH_ORGANIZATIONS_QUERY,
                    data: {
                        organizations: {
                            edges: [result.data, ...data.organizations.edges],
                        },
                    },
                });
                toast.success("New supplier created.");
            },
        }
    );

    const [updateOrganization, { loading: updateLoading }] = useMutation(
        UPDATE_ORGANIZATION,
        {
            variables: {
                id: fields.id,
                name: fields.name,
                organization_type: fields.organization_type,
                city: fields.city,
                address: fields.address,
                address2: fields.address2,
                state_id: parseInt(fields?.state?.id),
                notes: fields.notes,
                zip_postal: fields.zip_postal,
                contact_first_name: fields.contact_first_name,
                contact_last_name: fields.contact_last_name,
                contact_title: fields.contact_title,
                contact_email: fields.contact_email,
                contact_office_phone: fields.contact_office_phone,
                contact_office_phone_ext: fields.contact_office_phone_ext,
                contact_mobile_phone: fields.contact_mobile_phone,
            },
            update(cache, result) {
                const data = cache.readQuery({
                    query: FETCH_ORGANIZATIONS_QUERY,
                });
                delete Object.assign(result.data, {
                    node: result.data["updateOrganization"],
                })["updateOrganization"];

                cache.writeQuery({
                    query: FETCH_ORGANIZATIONS_QUERY,
                    data: {
                        organizations: {
                            edges: [
                                {
                                    ...result.data,
                                    state: { id: result.data.node.state.id },
                                },
                                ...data.organizations.edges.filter(
                                    (u) => u.node.id !== result.data.node.id
                                ),
                            ],
                        },
                    },
                });
                setFields(result.data.node);
                callBack();
                toast.info(fields.name + " Updated.");
            },
        }
    );

    return (
        <div className="grid grid-cols-7 bg-white  rounded-lg  overflow-hidden h-full">
            <div className="col-span-7 lg:col-span-4 overflow-auto">
                <div className="h-full relative overflow-hidden lg:pr-0  2xl:pr-0">
                    <div className="inset-0     h-full flex flex-col">
                        <div className="flex flex-col border-r-2  md:flex-row justify-between items-center  border-b-2 border-gray-400">
                            <div className=" font-title py-5 px-4 text-center h2">
                                {fields && fields.name
                                    ? fields.name
                                    : "Create Supplier/Manufacturer"}
                            </div>
                        </div>
                        <div className="flex  w-full h-full lg:min-h-smallMin  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                            {fillColumns ? (
                                <div className="w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                    <div className="grid grid-cols-6 col-span-6 2xl:col-span-4 ">
                                        <TextField
                                            flex
                                            parentClass="col-span-6 sm:col-span-6 border-b py-3"
                                            id="name"
                                            label="Company Name"
                                            onChange={handleChange}
                                            value={fields?.name}
                                            name="name"
                                            placeholder="Company Name"
                                            type="text"
                                            disabled={archieved}
                                        />
                                        <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-3 items-start justify-between  sm:items-center w-full">
                                            <div className="sm:grid sm:grid-cols-3 col-span-3 items-center py-3">
                                                <div className="block text-secondary font-sm font-medium">
                                                    Organization Type
                                                </div>
                                                <div className="mr-5 flex items-center col-span-2">
                                                    <div className="flex flex-col">
                                                    <label className="inline-flex items-center ">
                                                        <input
                                                            type="radio"
                                                            name="organization_type"
                                                            value="MANUFACTURERS"
                                                            onChange={
                                                                handleChange
                                                            }
                                                            className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                            checked={
                                                                fields.organization_type ===
                                                                "MANUFACTURERS"
                                                            }
                                                        ></input>
                                                        <span className="ml-2 text-sm  text-secondary">
                                                            Manufacturer
                                                        </span>
                                                    </label>
                                                    <label className="inline-flex items-center md:mt-1">
                                                        <input
                                                            type="radio"
                                                            name="organization_type"
                                                            value="SUPPLIERS"
                                                            onChange={
                                                                handleChange
                                                            }
                                                            className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                            checked={
                                                                fields.organization_type ===
                                                                "SUPPLIERS"
                                                            }
                                                        ></input>
                                                        <span className="ml-2 text-sm  text-secondary">
                                                            Supplier
                                                        </span>
                                                    </label>
                                                    </div>
                                                    {errors?.organizationType ? (
                                                    <p className="self-end  text-xs px-2 text-brickRed font-medium">
                                                        {" "}
                                                        Organization type is required
                                                    </p>
                                                ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-3 gap-5 items-start justify-between sm:items-center w-full ">
                                            <TextField
                                                width="w-full"
                                                label="Address"
                                                onChange={handleChange}
                                                parentClass="sm:grid sm:grid-cols-2 items-center col-span-2 py-3"
                                                id="address"
                                                value={fields?.address}
                                                name="address"
                                                inputClass="ml-1"
                                                placeholder="Address Line 1"
                                                type="text"
                                                disabled={archieved}
                                            />
                                            <TextField
                                                width="w-full"
                                                onChange={handleChange}
                                                value={fields?.address2}
                                                parentClass="grid mt-2 sm:mt-0 grid-cols-1 col-span-1 items-center py-3 "
                                                id="address2"
                                                name="address2"
                                                placeholder="Unit 123"
                                                disabled={archieved}
                                                type="text"
                                            />
                                        </div>
                                        <TextField
                                            flex
                                            width="w-32"
                                            label="City"
                                            onChange={handleChange}
                                            parentClass="col-span-6 sm:col-span-6 border-b py-3"
                                            id="city"
                                            value={fields?.city}
                                            name="city"
                                            placeholder="City"
                                            type="text"
                                            disabled={archieved}
                                        />
                                        <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-3 items-start justify-between py-3 sm:items-center w-full ">
                                            <div className="sm:grid sm:grid-cols-3 col-span-3 items-center">
                                                <label className="block text-md font-medium text-secondary">
                                                    State/Province
                                                </label>
                                                <div className="flex items-center col-span-2">
                                                
                                                <CommonSelect
                                                    error={errors?.state}
                                                    value={{
                                                        label:
                                                            fields?.state?.name,
                                                        value:
                                                            fields?.state?.id,
                                                    }}
                                                    edit={edit}
                                                    options={
                                                        states && states.states
                                                    }
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
                                                    <p className="self-end  text-xs px-2 text-brickRed font-medium">
                                                        {" "}
                                                        Select a state
                                                    </p>
                                                ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <TextField
                                            flex
                                            width="w-32"
                                            parentClass="col-span-4 sm:col-span-6 border-b py-3"
                                            onChange={handleChange}
                                            value={fields?.zip_postal}
                                            id="zip_postal"
                                            label="Postal Code"
                                            name="zip_postal"
                                            placeholder="90210"
                                            disabled={archieved}
                                            type="text"
                                        />
                                        <div className="col-span-6 grid grid-cols-3">
                                            <div className="px-2 py-3 ml-2 font-sm text-secondary block font-medium">
                                                Rebate Process Notes
                                            </div>
                                            <div className="col-span-2 py-3">
                                                <div className=" flex xl:flex-row gap-5 overflow-hidden">
                                                    <div className="flex flex-col w-full">
                                                        <div
                                                            className="flex px-2 pr-4 flex-col w-full"
                                                            style={{
                                                                minHeight:
                                                                    "200px",
                                                            }}
                                                        >
                                                            <RichText
                                                                initialContent={
                                                                    user.notes
                                                                }
                                                                handleEditorChange={
                                                                    handleNotesEditorChange
                                                                }
                                                                height="220"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-l rounded-lg rounded-l-none col-span-7 lg:col-span-3 overflow-y-auto  2xl:max-h-partial">
                <div className="h-full relative">
                    <div className="inset-0    h-full flex flex-col">
                        <div className="flex flex-col md:flex-row justify-between items-center  border-b-2 border-gray-400">
                            <div className="border-l-1 border-gray-400 font-title py-5 px-4 text-center h2">
                                {"Rebate Contact"}
                            </div>
                        </div>
                        {fillColumns ? (
                            <div className="flex  w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                                <div className="flex flex-col h-full ">
                                    <TextField
                                        flex
                                        parentClass=" border-b py-3"
                                        id="contact_first_name"
                                        label="First Name"
                                        onChange={handleChange}
                                        value={fields?.contact_first_name}
                                        name="contact_first_name"
                                        placeholder="First Name"
                                        type="text"
                                        required
                                        error={errors?.contact_first_name}
                                        errorMessage="First Name is required"
                                        disabled={archieved}
                                    />
                                    <TextField
                                        flex
                                        parentClass=" border-b py-3 pb-4"
                                        id="contact_last_name"
                                        label="Last Name"
                                        onChange={handleChange}
                                        value={fields?.contact_last_name}
                                        name="contact_last_name"
                                        placeholder="Last Name"
                                        type="text"
                                        errorMessage="Last Name is required"
                                        error={errors?.contact_last_name}
                                        disabled={archieved}
                                        required
                                    />
                                    <TextField
                                        flex
                                        parentClass=" border-b py-3"
                                        id="contact_title"
                                        label="Title"
                                        onChange={handleChange}
                                        value={fields?.contact_title}
                                        name="contact_title"
                                        placeholder="Title"
                                        type="text"
                                        disabled={archieved}
                                    />

                                    <TextField
                                        flex
                                        parentClass=" border-b py-3"
                                        id="contact_email"
                                        label="E-mail"
                                        onChange={handleChange}
                                        value={fields?.contact_email}
                                        name="contact_email"
                                        placeholder="E-mail"
                                        errorMessage="A vaild Email is required"
                                        type="email"
                                        required
                                        error={errors?.contact_email}
                                        disabled={archieved}
                                    />

                                    <div className="border-b  px-4   sm:grid sm:grid-cols-3 gap-5 items-start justify-between  sm:items-center w-full">
                                        <TextField
                                            width="w-full"
                                            label="Office Phone"
                                            onChange={handleChange}
                                            parentClass="sm:grid sm:grid-cols-2 items-center col-span-2 py-3 "
                                            id="contact_office_phone"
                                            value={fields?.contact_office_phone}
                                            name="contact_office_phone"
                                            placeholder="Office Phone"
                                            type="tel"
                                            disabled={archieved}
                                        />
                                        <TextField
                                            width="w-full"
                                            onChange={handleChange}
                                            value={
                                                fields?.contact_office_phone_ext
                                            }
                                            parentClass="grid sm:mt-0 grid-cols-1 col-span-1 items-center py-3"
                                            id="contact_office_phone_ext"
                                            name="contact_office_phone_ext"
                                            placeholder="Ext. 1124"
                                            disabled={archieved}
                                            type="text"
                                        />
                                    </div>

                                    <TextField
                                        flex
                                        parentClass=" border-b py-3"
                                        id="contact_mobile_phone"
                                        label="Mobile Phone"
                                        onChange={handleChange}
                                        value={fields?.contact_mobile_phone}
                                        name="contact_mobile_phone"
                                        placeholder="Mobile Phone"
                                        type="text"
                                        disabled={archieved}
                                    />
                                    <div className="col-span-6 py-4 px-4 h-full">
                                        {edit ? (
                                            <SupplierPrograms id={fields.id} />
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        {fillColumns ? (
                            <div className="py-2 pr-5 flex flex-col items-end justify-end border-t">
                                <Button
                                    disabled={finalError}
                                    color="primary"
                                    title={
                                        edit
                                            ? updateLoading
                                                ? "Saving Updates"
                                                : "Save Updates"
                                            : newLoading
                                            ? "Saving"
                                            : "Save"
                                    }
                                    onClick={
                                        edit
                                            ? updateOrganization
                                            : newOrganization
                                    }
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSupplier;
