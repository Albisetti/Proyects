import React, { useState, useEffect } from "react";
import TextField from "../../FormGroups/Input";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CREATE_SUBCONTRACTOR, FETCH_SUBCONTRACTOR_QUERY, UPDATE_SUBCONTRACTOR } from "../../../lib/subcontractor";
import { FETCH_ORGANIZATIONS_QUERY, FETCH_SUBCONTRACTOR_CATEGORY } from "../../../lib/organization";
import Button from "../../Buttons";
import CommonSelect from "../../Select";
import { FETCH_STATES_QUERY } from "../../../lib/common";

import { sortSubcontractorCategories } from "../../../util/sort";

const CreateSubcontractor = ({ archieved, edit, user, fillColumns, searchString, callBack }) => {
    const [fields, setFields] = useState(user);
    const [assignBuilders, setAssignBuilders] = useState([]);
    const [assignCategories, setAssignCategories] = useState([]);
    const [callAction, setCallAction] = useState(false);
    const [nullReactSelect, setNullReactSelect] = useState(false);
    const [stateError, setStateError] = useState(false);
    const [subcontractorCategories, setSubcontractorCategories] = useState(false);
    // const builderObserver = useRef();
    // const first = 20;

    useEffect(() => {
        if (callAction === true) {
            updateSubcontractor();
            setCallAction(false);
        }

        // eslint-disable-next-line
    }, [callAction]);

    useEffect(() => {
        if (!fields?.state?.id) {
            setStateError(true);
        } else {
            setStateError(false);
        }
    }, [fields?.state]);

    useEffect(() => {
        if (edit === false) {
            setFields({
                ...fields,
                company_name: searchString,
            });
        }
        // eslint-disable-next-line
    }, [searchString]);

    useEffect(() => {
        setFields(user);
        if (edit === false) {
            setFields({
                ...fields,
                company_name: searchString?.length > 0 ? searchString : "",
                contact_name: "",
                email: "",
                id: "",
                office_number: "",
                office_number_ext: "",
                address: "",
                address2: "",
                mobile_number: "",
                city: "",
                zip_postal: "",
                state: {
                    id: "",
                    name: "",
                },
                organizations: {
                    edges: [],
                },
            });
            setAssignBuilders(() => []);
        }
        // eslint-disable-next-line
    }, [user, edit]);

    useEffect(() => {
        const prevValues =
            fields &&
            fields.organizations &&
            fields.organizations.edges.map((item) => {
                return parseInt(item.node.id);
            });
        setAssignBuilders(() => prevValues);

        const prevCategoryValues =
            fields &&
            fields.categories &&
            fields.categories.edges.map((item) => {
                return parseInt(item.node.id);
            });
        setAssignCategories(() => prevCategoryValues);
    }, [edit, fields]);

    const { data: builders } = useQuery(FETCH_ORGANIZATIONS_QUERY, {
        variables: {
            organization_type: "BUILDERS",
            first: 200000,
        },
    });

    useQuery(FETCH_SUBCONTRACTOR_CATEGORY, {
        variables: {
            first: 200000,
        },
        onCompleted:(data)=>{
            setSubcontractorCategories(sortSubcontractorCategories(data));
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields({
            ...fields,
            [name]: value,
        });
    };

    const { data: states } = useQuery(FETCH_STATES_QUERY);

    const [newSubcontractor, { loading: newLoading }] = useMutation(CREATE_SUBCONTRACTOR, {
        variables: {
            company_name: fields?.company_name,
            contact_name: fields?.contact_name,
            email: fields?.email,
            office_number: fields?.office_number,
            office_number_ext: fields?.office_number_ext,
            mobile_number: fields?.mobile_number,
            state_id: parseInt(fields?.state?.id),
            city: fields?.city,
            address: fields?.address,
            address2: fields?.address2,
            zip_postal: fields?.zip_postal,
            connect: assignBuilders,
            categoryConnect:assignCategories,
            disconnect: [],
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_SUBCONTRACTOR_QUERY,
            });

            delete Object.assign(result.data, {
                node: result.data["createSubcontractor"],
            })["createSubcontractor"];

            cache.writeQuery({
                query: FETCH_SUBCONTRACTOR_QUERY,
                data: {
                    subcontractors: {
                        edges: [result.data, ...data.subcontractors.edges],
                    },
                },
            });
            callBack(result?.data?.node);
            toast.success("New Subcontractor created.");
            setNullReactSelect(true);
        },
    });

    const [updateSubcontractor, { loading: updateLoading }] = useMutation(UPDATE_SUBCONTRACTOR, {
        variables: {
            id: fields?.id,
            company_name: fields?.company_name,
            contact_name: fields?.contact_name,
            email: fields?.email,
            office_number: fields?.office_number,
            office_number_ext: fields?.office_number_ext,
            mobile_number: fields?.mobile_number,
            state_id: parseInt(fields?.state?.id),
            city: fields?.city,
            address: fields?.address,
            address2: fields?.address2,
            zip_postal: fields?.zip_postal,
            sync: assignBuilders,
            categoriesSync:assignCategories,
            disconnect: [],
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_SUBCONTRACTOR_QUERY,
            });
            delete Object.assign(result.data, {
                node: result.data["updateSubcontractor"],
            })["updateSubcontractor"];

            // cache.writeQuery({
            //   query: FETCH_SUBCONTRACTOR_QUERY,
            //   data: {
            //     subcontractors: {
            //       edges: [result.data, ...data.subcontractors.edges],
            //     },
            //   },
            // });
            cache.writeQuery({
                query: FETCH_SUBCONTRACTOR_QUERY,
                data: {
                    subcontractors: {
                        edges: [
                            result.data,
                            ...data.subcontractors.edges.filter((u) => u.node.id !== result.data.node.id),
                        ],
                    },
                },
            });
            //[...data.subcontractors.edges.filter(u => u.node.id != result.data.node.id), result.data ]
            //[...data.subcontractors.edges.map(u => u.node.id != result.data.node.id ? u : result.data) ]
            setNullReactSelect(true);
            setFields(result.data.node);
            toast.info(fields.company_name + " updated.");
        },
    });

    const unAssignSubContractors = (id) => {
        let array = assignBuilders.filter((item) => item !== id);
        setAssignBuilders(array);
        setCallAction(true);
    };

    const unAssignCategories = (id) => {
        let array = assignCategories.filter((item) => item !== id);
        setAssignCategories(array);
        setCallAction(true);
    }

    const builderAssignment = (e) => {
        const prevValues = fields.organizations.edges.map((item) => {
            return parseInt(item.node.id);
        });
        const values = e.map((item) => parseInt(item.value));
        setAssignBuilders(() => values.concat(prevValues));
    };

    const categoryAssignment = (e) => {
        const prevValues = fields.categories.edges.map((item) => {
            return parseInt(item.node.id);
        });
        const values = e.map((item) => parseInt(item.value));
        setAssignCategories(() => values.concat(prevValues));
    };

    return (
        <div className="grid grid-cols-6 bg-white  rounded-lg  overflow-hidden h-full">
            <div className="col-span-9 lg:col-span-4 ">
                <div className="h-full relative   lg:pr-0  2xl:pr-0">
                    <div className="inset-0     h-full flex flex-col">
                        <div className="flex flex-col border-r-2  md:flex-row justify-between items-center  border-b-2 border-gray-400">
                            <div className=" font-title py-5 px-4 text-center h2">
                                {edit
                                    ? fields?.company_name
                                    : "Create Subcontractor/Distributor/Provider"}
                            </div>
                        </div>
                        <div className="flex  w-full h-full lg:min-h-smallMin  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                            {fillColumns ? (
                                <div className="w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                    <div className="grid grid-cols-6 col-span-6 2xl:col-span-4 h-full ">
                                        <TextField
                                            flex
                                            parentClass="col-span-6 sm:col-span-6 border-b py-3 xl:py-0"
                                            id="company_name"
                                            label="Company Name"
                                            onChange={handleChange}
                                            value={fields?.company_name}
                                            name="company_name"
                                            placeholder="Company Name"
                                            type="text"
                                            inputClass={"col-span-2"}
                                            disabled={archieved}
                                        />
                                        <TextField
                                            flex
                                            parentClass="col-span-6 sm:col-span-6 border-b py-3 xl:py-0"
                                            id="contact_name"
                                            label="Contact Name"
                                            onChange={handleChange}
                                            inputClass={"col-span-2"}
                                            value={fields?.contact_name}
                                            name="contact_name"
                                            placeholder="Contact Name"
                                            type="text"
                                            disabled={archieved}
                                        />
                                        <div className="flex flex-col col-span-6 border-b sm:grid sm:grid-cols-3 items-start justify-between px-4 xl:px-4 sm:items-center w-full py-3 xl:py-0">
                                            <label
                                                htmlFor="email"
                                                className="hover:block  text-md col-span-1  font-medium text-secondary"
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                onChange={handleChange}
                                                value={fields?.email}
                                                placeholder="xyz@gmail.com"
                                                id="email"
                                                className="mt-1 block input-no-error w-full  col-span-2 focus:outline-none shadow-sm sm:text-sm rounded-md"
                                            ></input>
                                        </div>

                                        <div className="border-b col-span-6 px-4   grid grid-col-2 grid-cols-3 items-start justify-between py-3 sm:items-center w-full xl:py-0">
                                            <TextField
                                                width="w-32"
                                                label="Office Phone"
                                                onChange={handleChange}
                                                parentClass="grid grid-cols-2 items-center col-span-2 py-3 xl:py-0"
                                                id="office_number"
                                                value={fields && fields.office_number}
                                                name="office_number"
                                                placeholder="123-456-7890"
                                                type="tel"
                                                disabled={archieved}
                                            />

                                            <TextField
                                                width="w-16"
                                                label="Extenstion"
                                                onChange={handleChange}
                                                value={fields?.office_number_ext}
                                                parentClass="grid grid-cols-2 col-span-1 items-center py-3 xl:py-0"
                                                id="office_number_ext"
                                                name="office_number_ext"
                                                placeholder="1124"
                                                disabled={archieved}
                                                type="tel"
                                            />
                                        </div>

                                        <TextField
                                            flex
                                            width="w-32"
                                            label="Cell"
                                            parentClass="col-span-6 sm:col-span-6 border-b py-3 xl:py-0"
                                            id="mobile_number"
                                            onChange={handleChange}
                                            value={fields?.mobile_number}
                                            name="mobile_number"
                                            placeholder="123-456-7890"
                                            type="tel"
                                            disabled={archieved}
                                        />
                                        <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-3 gap-5 items-start justify-between py-3 sm:items-center w-full xl:py-0">
                                            <TextField
                                                width="w-full"
                                                label="Address"
                                                onChange={handleChange}
                                                inputClass="ml-1"
                                                parentClass="sm:grid sm:grid-cols-2 items-center col-span-2 py-3 xl:py-0"
                                                id="address"
                                                value={fields?.address}
                                                name="address"
                                                placeholder="Address Line 1"
                                                type="text"
                                                disabled={archieved}
                                            />
                                            <TextField
                                                width="w-full"
                                                onChange={handleChange}
                                                value={fields?.address2}
                                                parentClass="grid mt-2 sm:mt-0 grid-cols-1 col-span-1 items-center py-3 xl:py-0"
                                                id="address2"
                                                name="address2"
                                                placeholder="Unit 123"
                                                disabled={archieved}
                                                type="text"
                                            />
                                        </div>
                                        <TextField
                                            flex
                                            width="w-full"
                                            label="City"
                                            onChange={handleChange}
                                            parentClass="col-span-6 sm:col-span-6 border-b py-3 xl:py-0"
                                            id="city"
                                            inputClass={"col-span-2"}
                                            value={fields?.city}
                                            name="city"
                                            placeholder="City"
                                            type="text"
                                            disabled={archieved}
                                        />
                                        <div className="border-b col-span-6 px-4   sm:grid sm:grid-cols-3 items-start justify-between py-3 sm:items-center w-full xl:py-0">
                                            <div className="sm:grid sm:grid-cols-3 col-span-3 items-center">
                                                <label className="block text-md font-medium text-secondary">
                                                    State/Province
                                                </label>
                                                <div className="flex items-center col-span-2">
                                                    <CommonSelect
                                                        error={stateError}
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
                                                    {stateError ? (
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
                                            parentClass="col-span-4 sm:col-span-6 py-3 xl:py-0"
                                            onChange={handleChange}
                                            value={fields?.zip_postal}
                                            id="zip_postal"
                                            label="Postal Code"
                                            name="zip_postal"
                                            placeholder="90210"
                                            disabled={archieved}
                                            type="text"
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        {fillColumns ? (
                            <div className="py-2 pr-5 flex flex-col items-end justify-end border-t">
                                <Button
                                    disabled={stateError}
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
                                    onClick={edit ? updateSubcontractor : newSubcontractor}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="bg-white border-l rounded-lg rounded-l-none col-span-9 lg:col-span-2  2xl:max-h-partial">
                <div className="h-full relative">
                    <div className="inset-0    h-full flex flex-col">
                        <div className="flex flex-col md:flex-row justify-between items-center  border-b-2 border-gray-400">
                            <div className="border-l-1 border-gray-400 font-title py-5 px-4 text-center h2">
                                Assign Builders
                            </div>
                        </div>
                        <div className="flex  w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 ">
                            {fillColumns ? (
                                <div className="w-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                    <div className=" col-span-6   sm:grid sm:grid-cols-2 items-start justify-between py-3 sm:items-center w-full xl:py-0">
                                        <div className="sm:grid sm:grid-cols-2 col-span-2 items-center px-4">
                                            <CommonSelect
                                                options={builders && builders.organizations}
                                                optionsToRemove={assignBuilders}
                                                className="pt-3 col-span-2 lg:w-full"
                                                clean={nullReactSelect}
                                                placeHolder="Builders"
                                                isMulti
                                                menuPlacement={"bottom"}
                                                onChange={(e) => {
                                                    builderAssignment(e);
                                                    setNullReactSelect(false);
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-1 pl-2">
                                            <Button
                                                disabled={stateError}
                                                title={
                                                    updateLoading
                                                        ? "Assigning"
                                                        : "Assign"
                                                }
                                                color="primary"
                                                onClick={edit ? updateSubcontractor : newSubcontractor}
                                            />
                                        </div>
                                    </div>

                                    <ul className=" flex-0 w-full  overflow-auto border-b border-gray-400">
                                        {fields &&
                                            fields.organizations &&
                                            fields.organizations.edges
                                                .length !== 0 &&
                                            fields.organizations.edges.map(
                                                (eachData, index) => {
                                                    return (
                                                        <li
                                                            className="py-3 pl-3 border-b  hover:bg-gray-100"
                                                            onClick={() =>
                                                                unAssignSubContractors(
                                                                    parseInt(
                                                                        eachData
                                                                            .node
                                                                            .id
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            <div className="relative  flex justify-between">
                                                                <p className="text-sm font-semibold text-gray-800">
                                                                    <Link
                                                                        to="#"
                                                                        className="  focus:outline-none"
                                                                    >
                                                                        <span
                                                                            className="absolute inset-0"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                        {
                                                                            eachData
                                                                                .node
                                                                                .name
                                                                        }
                                                                    </Link>
                                                                </p>
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center mr-5"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-6 w-6 text-red-500 hover:text-red-700"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                2
                                                                            }
                                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </li>
                                                    );
                                                }
                                            )
                                        }
                                    </ul>

                                    <div className=" pt-5">
                                        <div className="border-l-1 border-gray-400 font-title px-4 h2">
                                            Subcontractor Categories
                                        </div>
                                        <div className="sm:grid sm:grid-cols-2 col-span-2 items-center px-4">
                                            <CommonSelect
                                                options={
                                                    subcontractorCategories &&
                                                    (subcontractorCategories.subcontractorCategories)
                                                }
                                                optionsToRemove={assignCategories}
                                                className="pt-2 col-span-2 lg:w-full"
                                                clean={nullReactSelect}
                                                placeHolder="Subcontractor Categories"
                                                isMulti
                                                noOptionsMessage={"No Categories found"}
                                                menuPlacement={"bottom"}
                                                onChange={(e) => {
                                                    categoryAssignment(e);
                                                    setNullReactSelect(false);
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-1 pl-2">
                                            <Button
                                                disabled={stateError}
                                                title={updateLoading ? "Assigning" : "Assign"}
                                                color="primary"
                                                onClick={edit ? updateSubcontractor : newSubcontractor}
                                            />
                                        </div>
                                        <ul className=" flex-0 w-full  overflow-auto border-b border-gray-400">
                                            {fields &&
                                                fields.categories &&
                                                fields.categories.edges.length !== 0 &&
                                                fields.categories.edges.map((eachData, index) => {
                                                    return (
                                                        <li
                                                            className="py-3 pl-3 border-b  hover:bg-gray-100 cursor-pointer"
                                                            onClick={() =>
                                                                unAssignCategories(parseInt(eachData.node.id))
                                                            }
                                                            key={index}
                                                        >
                                                            <div className="relative  flex justify-between">
                                                                <p className="text-sm font-semibold text-gray-800">
                                                                        <span
                                                                            className="absolute inset-0"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                        {eachData.node.name}
                                                                </p>
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center mr-5"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-6 w-6 text-red-500 hover:text-red-700"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSubcontractor;
