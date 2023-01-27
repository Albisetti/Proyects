import React, { useState, useRef, useCallback, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Disclosure, Transition } from "@headlessui/react";
import Button from "../../../Buttons";
import Modal from "../../../Modal";
import { toast } from "react-toastify";
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon, PlusCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import TextField from "../../../FormGroups/Input";

import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import Papa from "papaparse";
import {
    CREATE_SUBDIVISION,
    FETCH_SUBDIVISIONS,
    FETCH_HOUSES_PER_SUBDIVISION,
    UPDATE_SUBDIVISION,
    DELETE_SUBDIVISION,
    CREATE_HOUSES_FROM_CSV,
    UPDATE_HOUSE,
    SEARCH_SUBDIVISIONS,
    DELETE_ADDRESS,
} from "../../../../lib/addresses";
import { FETCH_STATES_QUERY } from "../../../../lib/common";
import Accordian from "../../../Accordian";
import CommonSelect from "../../../Select";
import { Helmet } from "react-helmet";
import Loader from "../../../Loader/Loader";
import HelperModal from "../../../Modal/HelperModal";
import { useDebounce, useMandatoryImpersonation } from "../../../../util/hooks";
import { AuthContext } from "../../../../contexts/auth";
import { organizationNode } from "../../../../lib/builders";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { getFormattedDate } from "../../../../util/generic";
import { APP_TITLE } from "../../../../util/constants";
import { sortSubdivisionNames } from "../../../../util/sort";

const Addresses = () => {
    const [showModal, setShowModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    //eslint-disable-next-line
    const [accordianDataClickData, setAccordianDataClickData] = useState([]);
    const [active, setActive] = useState();
    const [show, setShow] = useState(false);
    const [completed, setCompleted] = useState([]);
    const [subdivision, setSubdivision] = useState("createNew");
    const [file, setFile] = useState();
    const [upload, setUpload] = useState();
    const [fields, setFields] = useState();
    const [csvPreview, setCsvPreview] = useState();
    const [accordianData, setAccordianData] = useState([]);
    const [subdivisionName, setSubdivisionName] = useState();
    const [subdivisionNode, setSubdivisionNode] = useState();
    const [tableAddresses, setTableAddresses] = useState();
    const [tableRows, setTableRows] = useState(1);
    const [addAddress, setAddAddress] = useState(false);
    const [CODate, setCODate] = useState(new Date());
    const [manualCODate, setManualCODate] = useState(new Date());
    const [editHouseFields, setEditHouseFields] = useState();
    const [editHouse, setEditHouse] = useState(false);
    const [closeAccordian, setCloseAccordian] = useState(true);
    const [activeDetail, setActiveDetail] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [searchString, setSearchedString] = useState();
    const [searched, setSearched] = useState();
    const [deleteId, setDeleteId] = useState();
    const [subDivisionDeleteId, setSubdivisionDeleteId] = useState();

    const programObserver = useRef();
    const first = 20;

    const activeHandler = (item) => {
        if (item !== active) {
            setActive(item);
            setShow(true);
        } else {
            setShow(!show);
        }
    };

    const { organizationId, type } = useContext(AuthContext);

    const { impersonator } = useMandatoryImpersonation({
        allowedUserTypes: ["BUILDERS"],
    });

    const handlePropertyTypeChange = (event) => {
        setPropertyType(event.target.value);
    };

    const handleSubdivisionsBoolChange = (event) => {
        setSubdivision(event.target.value);
    };

    const handleUploadBoolChange = (event) => {
        setUpload(event.target.value);
    };

    const { data: states } = useQuery(FETCH_STATES_QUERY);

    const [propertyType, setPropertyType] = useState("RESIDENTIAL");

    const programValidityOptions = [
        { name: "RESIDENTIAL", label: "Residential" },
        { name: "MULTIUNIT", label: "Multi-Unit" },
        { name: "COMMERCIAL", label: "Commercial" },
    ];

    const subdivisionOptions = [
        { name: "createNew", label: "Create New Subdivision (Recommended)" },
        { name: "single Build", label: "Use 'Single Build' as Subdivision" },
    ];

    const uploadOptions = [
        { name: "csvFile", label: "Upload a CSV file" },
        { name: "manual", label: "Manually Enter Addresses" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields({
            ...fields,
            [name]: value,
        });
    };

    const handleSearchChange = (e) => {
        setSearchedString(e.target.value);
        if (searchString?.length > 1) {
            setSearched(true);
        }
    };

    const handleRowChange = (id, e) => {
        const { name, value } = e.target;
        if (tableAddresses) {
            setTableAddresses({
                ...tableAddresses,
                [id]: {
                    property_type: propertyType,
                    organization_id: parseInt(organizationId),
                    ...tableAddresses[id],
                    [name]: value,
                },
            });
        } else {
            setTableAddresses({
                ...tableAddresses,
                [id]: {
                    [name]: value,
                },
            });
        }
    };

    const toDateAdd = (date) => {
        const date1 = new Date(date);
        let a = date1.getTimezoneOffset() * 60000;
        let b = new Date(date1.getTime() + a);
        return b;
    };

    useEffect(() => {
        // sets the start data and end date fields
        if (editHouseFields && editHouseFields.confirmed_occupancy) {
            setCODate(toDateAdd(editHouseFields && editHouseFields.confirmed_occupancy));
        } else {
            setCODate(new Date());
        }
        //eslint-disable-next-line
    }, [editHouseFields && editHouseFields.confirmed_occupancy]);

    const handleEditHouseChange = (e) => {
        setEditHouse(true);
        const { name, value } = e.target;
        setEditHouseFields({
            ...editHouseFields,
            [name]: value,
        });
    };

    const accordianDataClick = (data) => {
        setAccordianDataClickData(data);
        setCloseAccordian(true);
        setEditHouseFields(data);
    };

    const handleTabsChange = (id) => {
        setShow(true);
        setCompleted((completed) => [...completed, id]);
        setActive("step3");
    };

    const handleFileChange = ({ target }) => {
        setFile(() => target.files[0]);
    };

    const modifiers = {
        selected: manualCODate[0],
    };

    const modifiersStyles = {
        selected: {
            color: "white",
            backgroundColor: "#003166",
        },
        selectedclockStart: {
            color: "white",
            backgroundColor: "#003166",
        },
    };

    const CustomOverlay = ({ classNames, selectedDay, children, ...props }) => {
        return (
            <div className={classNames.overlayWrapper} {...props}>
                <div className={classNames.overlay + "relative"}>{children}</div>
            </div>
        );
    };

    const manualTableData = () => {
        let items = [];
        for (let i = 0; i < tableRows; i++) {
            items.push(
                <tr className="">
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                            style={{ maxWidth: "5rem" }}
                            type="text"
                            name="lot_number"
                            id="lot_number"
                            onChange={(e) => handleRowChange(i, e)}
                            className="focus:outline-none input-no-error w-16 sm:text-sm  rounded-md"
                            placeholder="Lot #"
                        />
                    </td>
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                            type="text"
                            name="address"
                            id="address"
                            onChange={(e) => handleRowChange(i, e)}
                            className="focus:outline-none  input-no-error   sm:text-sm  rounded-md"
                            placeholder="123 Fake Street"
                        />
                    </td>
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                            style={{ maxWidth: "6rem" }}
                            type="text"
                            name="address2"
                            id="address2"
                            onChange={(e) => handleRowChange(i, e)}
                            className="focus:outline-none input-no-error w-20   sm:text-sm  rounded-md"
                            placeholder="Unit 123"
                        />
                    </td>
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                            style={{ maxWidth: "11rem" }}
                            type="text"
                            name="city"
                            id="city"
                            onChange={(e) => handleRowChange(i, e)}
                            className="focus:outline-none input-no-error w-20  sm:text-sm  rounded-md"
                            placeholder="Windsor"
                        />
                    </td>
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex">
                            <div className="">
                                <CommonSelect
                                    name="state_id"
                                    options={states && states.states}
                                    className="w-32"
                                    placeHolder="State"
                                    menuPlacement={"bottom"}
                                    onChange={(e) => {
                                        if (tableAddresses) {
                                            setTableAddresses({
                                                ...tableAddresses,
                                                [i]: {
                                                    ...tableAddresses[i],
                                                    state_id: parseInt(e.value),
                                                },
                                            });
                                        } else {
                                            setTableAddresses({
                                                ...tableAddresses,
                                                [i]: {
                                                    state_id: parseInt(e.value),
                                                },
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </td>

                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                            type="text"
                            name="zip_postal"
                            id="zip_postal"
                            onChange={(e) => handleRowChange(i, e)}
                            className="focus:outline-none input-no-error w-20 sm:text-sm  rounded-md"
                            placeholder="90210"
                        />
                    </td>
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <DayPickerInput
                            value={manualCODate[i] ? manualCODate[i] : new Date()}
                            inputProps={{
                                style: {
                                    border: "1px solid rgba(212, 212, 216,1)",
                                    borderRadius: "0.375rem",
                                    padding: "0.5rem 0.75rem",
                                    width: "130px",
                                    fontSize: ".875rem",
                                    cursor: "pointer",
                                },
                            }}
                            overlayComponent={CustomOverlay}
                            dayPickerProps={{
                                modifiers: modifiers,
                                modifiersStyles: modifiersStyles,
                            }}
                            onDayChange={(date) => {
                                setManualCODate({ [i]: date });
                                if (tableAddresses) {
                                    setTableAddresses({
                                        ...tableAddresses,
                                        [i]: {
                                            ...tableAddresses[i],
                                            confirmed_occupancy: date.toISOString().substr(0, 10),
                                        },
                                    });
                                } else {
                                    setTableAddresses({
                                        ...tableAddresses,
                                        [i]: {
                                            confirmed_occupancy: date.toISOString().substr(0, 10),
                                        },
                                    });
                                }
                            }}
                        />
                    </td>
                    <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                            type="text"
                            name="model"
                            id="model"
                            onChange={(e) => handleRowChange(i, e)}
                            className="focus:outline-none input-no-error w-20  sm:text-sm  rounded-md"
                            placeholder="Modern"
                        />
                    </td>
                    <td className="pl-4 pr-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                            type="text"
                            name="project_number"
                            id="project_number"
                            onChange={(e) => handleRowChange(i, e)}
                            className="focus:outline-none input-no-error w-24  sm:text-sm  rounded-md"
                            placeholder={APP_TITLE + "-123"}
                        />
                    </td>
                </tr>
            );
        }
        return items;
    };

    const tableData = () => {
        return (
            <div className="flex flex-col">
                <div className=" overflow-hidden sm:-mx-6 lg:-mx-8">
                    <div className="align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr className="">
                                        <th
                                            scope="col"
                                            className={`${
                                                upload === "csvFile" ? "pl-6" : "pl-5"
                                            } py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            Lot #
                                        </th>
                                        <th
                                            scope="col"
                                            className={` ${
                                                upload === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-2/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            Address
                                        </th>
                                        <th
                                            scope="col"
                                            className={` ${
                                                upload === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-1/12 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider`}
                                        >
                                            Unit
                                        </th>
                                        <th
                                            scope="col"
                                            className={`${
                                                upload === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-2/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            City
                                        </th>
                                        <th
                                            scope="col"
                                            className={`${
                                                upload === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            State/Province
                                        </th>
                                        <th
                                            scope="col"
                                            className={`${
                                                upload === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            Zip/Postal
                                        </th>
                                        <th
                                            scope="col"
                                            className={`${
                                                upload === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-2/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            Confirm Occupancy
                                        </th>
                                        <th
                                            scope="col"
                                            className={`${
                                                upload === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            Build Model
                                        </th>
                                        <th
                                            scope="col"
                                            className={`${
                                                upload === "csvFile" ? "pl-6" : "pl-4"
                                            } py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                        >
                                            Project Number
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upload === "manual" ? (
                                        <>{manualTableData()}</>
                                    ) : (
                                        csvPreview &&
                                        csvPreview.length > 0 &&
                                        csvPreview.slice(1, -1).map((item, key) => (
                                            <tr key={key}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item[5]}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item[0]}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item[1]}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item[2]}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item[3]}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item[4]}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {getFormattedDate(toDateAdd(item[6]))}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item[7]}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item[8]}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleThirdStep = () => {
        if (upload === "manual") {
            setCompleted((completed) => [...completed, "3"]);
            setActive("step4");
        }
        if (upload === "csvFile" && file) {
            importCSV();
        }
    };

    const importCSV = () => {
        Papa.parse(file, {
            delimiter: ",",
            chunkSize: 3,
            header: false,
            complete: function (responses) {
                setCsvPreview(responses.data);
                setCompleted((completed) => [...completed, "3"]);
                setActive("step4");
            },
        });
    };

    // const pad = (n, length) => {
    //     var len = length - ("" + n).length;
    //     return (len > 0 ? new Array(++len).join("0") : "") + n;
    // };

    //eslint-disable-next-line
    const lastSubdivisionElement = useCallback((node) => {
        if (programObserver.current) programObserver.current.disconnect();
        programObserver.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && subdivisions.subdivisions.pageInfo.hasNextPage) {
                fetchMoreSubdivisions({
                    variables: {
                        first,
                        after: subdivisions.subdivisions.pageInfo.endCursor,
                    },
                });
            }
        });
        if (node) programObserver.current.observe(node);
    });

    const [
        getSubdivisions,
        { data: subdivisions, loading: subdivisionLoading, fetchMore: fetchMoreSubdivisions },
    ] = useLazyQuery(FETCH_SUBDIVISIONS, {
        notifyOnNetworkStatusChange: false,
        nextFetchPolicy: "network-only",
    });

    const debouncedValue1 = useDebounce(searchString, 160);

    useEffect(() => {
        if (searched === true && searchString?.length > 1) {
            searchSubdivisions();
        }
        if (searchString?.length === 0) {
            setSearched(false);
        }
        // eslint-disable-next-line
    }, [debouncedValue1]);

    const [searchSubdivisions, { data: searchedSubdivisions, loading: searchSubdivisionsLoading }] = useLazyQuery(
        SEARCH_SUBDIVISIONS,
        {
            variables: {
                search: searchString,
            },
            fetchPolicy: "network-only",
            notifyOnNetworkStatusChange: false,
        }
    );

    const [getHouses, { data: addresses, loading: addressesLoading }] = useLazyQuery(FETCH_HOUSES_PER_SUBDIVISION, {
        variables: {
            id: parseInt(subdivisionName && subdivisionName.id),
        },
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: false,
        onCompleted: () => {
            setAccordianData(addresses.subdivisionWithData.subdivision.houses.edges);
            setActiveDetail(true);
        },
    });

    useEffect(() => {
        if (impersonator || type === "BUILDERS") getSubdivisions();
        // eslint-disable-next-line
    }, [impersonator]);

    const handleSubdivision = (node) => {
        setSubdivisionName(node);
        setSubdivisionNode();
        setActive("step1");
        setCloseAccordian(false);
        setEditHouse(false);
        setCompleted([]);
        setSearched(false);
        setSearchedString("");
        getHouses();
    };

    const [createSubdivision] = useMutation(CREATE_SUBDIVISION, {
        variables: {
            name: subdivision === "singleBuild" ? "singleBuild" : fields?.name,
            organization_id: organizationId,
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_SUBDIVISIONS,
            });

            delete Object.assign(result.data, {
                node: result.data["createSubdivision"],
            })["createSubdivision"];

            cache.writeQuery({
                query: FETCH_SUBDIVISIONS,
                data: {
                    subdivisions: {
                        edges: [result.data, ...data.subdivisions.edges],
                    },
                },
            });
            setSubdivisionNode(result.data.node);
            setCompleted((completed) => [...completed, "1"]);
            setActive("step2");
            toast.success(subdivision === "singleBuild" ? "singleBuild" : fields?.name + " Created.");
        },
    });

    const [deleteSubdivision] = useMutation(DELETE_SUBDIVISION, {
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_SUBDIVISIONS,
            });
            if (result?.data?.DeleteSubdivision === "enqueued") {
                const filteredEdges = data.subdivisions.edges.filter(
                    (subdivision) => subdivision?.node?.id !== subDivisionDeleteId
                );
                cache.writeQuery({
                    query: FETCH_SUBDIVISIONS,
                    data: {
                        subdivisions: {
                            edges: filteredEdges,
                        },
                    },
                });
                toast.info("Subdivision has been queued for deletion, an email will be sent with more information");
            }
        },
    });

    const [createHouseFromCSV, { loading: createHouseFromCSVLoading }] = useMutation(CREATE_HOUSES_FROM_CSV, {
        variables: {
            file: file,
            subdivisionId: parseInt(subdivisionNode?.id),
            propertyType: propertyType,
            organizationId: organizationId,
        },
        update(cache, result) {
            setFile();
            getHouses();
            setShowModal(false);
            getSubdivisions();
            setCompleted(["1"]);
            let count = csvPreview?.slice(1, -1)?.length;
            setCsvPreview();
            toast.success(count > 1 ? count + ` Address created.` : count + ` Addresses created.`);
        },
    });

    const [updateSubdivision] = useMutation(UPDATE_SUBDIVISION, {
        variables: {
            name: subdivisionNode?.name,
            id: subdivisionNode?.id,
            houses: tableAddresses && Object.values(tableAddresses),
        },
        update(cache, result) {
            setShowModal(false);
            setFile();
            getHouses();
            toast.success(subdivisionNode?.name + " updated.");
        },
    });

    const [updateHouse, { loading: updateHouseLoading }] = useMutation(UPDATE_HOUSE, {
        variables: {
            id: parseInt(editHouseFields?.id),
            state_id: parseInt(editHouseFields?.state?.id),
            address: editHouseFields?.address,
            address2: editHouseFields?.address2,
            lot_number: editHouseFields?.lot_number,
            zip_postal: editHouseFields?.zip_postal,
            model: editHouseFields?.model,
            project_number: editHouseFields?.project_number,
            confirmed_occupancy: CODate?.toISOString()?.substr(0, 10),
            city: editHouseFields?.city,
            organization: organizationNode?.id,
        },
        update(cache, result) {
            getHouses();
            toast.success("Address updated.");
        },
    });

    const modalDeleteContent = () => {
        return (
            <div className="text-gray-500 text-lg font-medium px-4 ">
                Please click Remove to delete the address {editHouseFields?.address} {editHouseFields?.city},{" "}
                {editHouseFields?.state?.name}. <br /> Click the X to continue making updates.
            </div>
        );
    };

    const modalDelete = () => {
        return (
            <>
                <Modal
                    title="Confirm Delete"
                    submitLabel="Remove"
                    submitLabelColor="brickRed"
                    onClose={() => setShowModalDelete(false)}
                    Content={modalDeleteContent()}
                    onSubmit={() => setDeleteId(editHouseFields?.id)}
                    show={showModalDelete}
                />
            </>
        );
    };

    useEffect(() => {
        if (deleteId) {
            deleteAddress();
        }
        // eslint-disable-next-line
    }, [deleteId]);

    const [deleteAddress] = useMutation(DELETE_ADDRESS, {
        variables: {
            id: [deleteId],
        },
        update(cache, result) {
            getHouses();
            setDeleteId("");
            setShowModalDelete(false);
            toast.success("Address deleted!");
        },
    });

    const AccordianComponent = () => {
        return (
            <div className="w-full max-h-partial xl:max-h-smallMin sm:max-h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                {modalDelete()}
                <div className=" flex-0 w-full  overflow-auto border-l border-r border-white ">
                    <div className="flex flex-col py-2">
                        <div className="flex flex-col lg:flex-row w-full flex-wrap  gap-5 py-3 pb-2 px-4">
                            <div className="flex flex-col whitespace-nowrap text-sm text-gray-500">
                                <label className="text-md mb-1  font-medium text-secondary" htmlFor="lot_number">
                                    Lot #
                                </label>
                                <input
                                    type="text"
                                    name="lot_number"
                                    id="lot_number"
                                    onChange={(e) => handleEditHouseChange(e)}
                                    value={editHouse ? editHouseFields?.lot_number : accordianDataClickData?.lot_number}
                                    className="focus:outline-none input-no-error w-16   sm:text-sm  rounded-md"
                                    placeholder="Lot #"
                                />
                            </div>
                            <div className="flex flex-col whitespace-nowrap text-sm text-gray-500">
                                <label className="text-md mb-1  font-medium text-secondary" htmlFor="address">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    onChange={handleEditHouseChange}
                                    value={editHouse ? editHouseFields?.address : accordianDataClickData?.address}
                                    className="focus:outline-none w-60 2xl:w-72  input-no-error   sm:text-sm  rounded-md"
                                    placeholder="Street"
                                />
                            </div>
                            <div className="flex flex-col whitespace-nowrap text-sm text-gray-500">
                                <label className="text-md mb-1 font-medium text-secondary" htmlFor="address2">
                                    Unit
                                </label>
                                <input
                                    type="text"
                                    name="address2"
                                    id="address2"
                                    onChange={handleEditHouseChange}
                                    value={editHouse ? editHouseFields?.address2 : accordianDataClickData?.address2}
                                    className="focus:outline-none input-no-error w-24 sm:text-sm  rounded-md"
                                    placeholder="Unit 123"
                                />
                            </div>
                            <div className="flex flex-col whitespace-nowrap text-sm text-gray-500">
                                <label className="text-md mb-1  font-medium text-secondary" htmlFor="lot_number">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    onChange={handleEditHouseChange}
                                    value={editHouse ? editHouseFields?.city : accordianDataClickData?.city}
                                    className="focus:outline-none input-no-error   sm:text-sm  rounded-md"
                                    placeholder="Windsor"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm mb-1  font-medium text-secondary">State / Province</label>
                                <div className="flex flex-col">
                                    <CommonSelect
                                        value={{
                                            label: editHouseFields?.state?.name,
                                            value: editHouseFields?.state?.id,
                                        }}
                                        options={states && states.states}
                                        className="w-44"
                                        placeHolder="State"
                                        menuPlacement={"bottom"}
                                        onChange={(e) => {
                                            setEditHouseFields({
                                                ...editHouseFields,
                                                state: {
                                                    id: e.value,
                                                    name: e.label,
                                                },
                                            });
                                            setEditHouse(true);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className=" whitespace-nowrap text-sm text-gray-500">
                                <div className="flex flex-col">
                                    <label className="text-sm mb-1  font-medium text-secondary">Zip / Postal</label>
                                    <input
                                        type="text"
                                        name="zip_postal"
                                        id="zip_postal"
                                        onChange={handleEditHouseChange}
                                        value={
                                            editHouse ? editHouseFields?.zip_postal : accordianDataClickData?.zip_postal
                                        }
                                        className="focus:outline-none input-no-error w-24 sm:text-sm  rounded-md"
                                        placeholder="90210"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col whitespace-nowrap text-sm text-gray-500">
                                <label className="text-md mb-1  font-medium text-secondary" htmlFor="address">
                                    Build Model
                                </label>
                                <input
                                    type="text"
                                    name="model"
                                    id="model"
                                    onChange={handleEditHouseChange}
                                    value={editHouse ? editHouseFields?.model : accordianDataClickData?.model}
                                    className="focus:outline-none  input-no-error   sm:text-sm  rounded-md"
                                    placeholder="modern"
                                />
                            </div>
                            <div className="flex flex-col whitespace-nowrap text-sm text-gray-500">
                                <label className="text-md mb-1  font-medium text-secondary" htmlFor="lot_number">
                                    Confirmed Occupancy
                                </label>
                                <DayPickerInput
                                    value={CODate}
                                    inputProps={{
                                        style: {
                                            border: "1px solid rgba(212, 212, 216,1)",
                                            borderRadius: "0.375rem",
                                            padding: "0.5rem 0.75rem",
                                            width: "130px",
                                            fontSize: ".875rem",
                                            cursor: "pointer",
                                        },
                                    }}
                                    format="MM/dd/yyyy"
                                    overlayComponent={CustomOverlay}
                                    dayPickerProps={{
                                        modifiers: modifiers,
                                        modifiersStyles: modifiersStyles,
                                    }}
                                    onDayChange={(date) => {
                                        setCODate(date);
                                        setEditHouse(true);
                                    }}
                                />
                            </div>

                            <div className="flex flex-col whitespace-nowrap text-sm text-gray-500">
                                <label className="text-md mb-1 font-medium text-secondary" htmlFor="address2">
                                    Project Number
                                </label>
                                <input
                                    type="text"
                                    name="project_number"
                                    id="project_number"
                                    onChange={handleEditHouseChange}
                                    value={
                                        editHouse
                                            ? editHouseFields?.project_number
                                            : accordianDataClickData?.project_number
                                    }
                                    className="focus:outline-none input-no-error w-24 sm:text-sm  rounded-md"
                                    placeholder={APP_TITLE + "-123"}
                                />
                            </div>
                        </div>
                        <div className="pb-2 pr-5 flex justify-center self-end">
                            {editHouse ? (
                                <Button
                                    color="primary"
                                    title={updateHouseLoading ? "Updating Address" : "Update Address"}
                                    onClick={() => updateHouse()}
                                />
                            ) : null}
                            <Button color="brickRed" title="Delete Address" onClick={() => setShowModalDelete(true)} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleSingleBuild = () => {
        setCompleted((completed) => [...completed, "1"]);
        setActive("step2");
        setSubdivisionNode({
            id: 1,
        });
    };

    function listSubdivisions(index, subdivisionName, eachData, handleSubdivision, deleteSubdivision) {
        if (eachData.node.deleted_at) {
            return null;
        }
        return (
            <li
                key={index}
                className={`  border-b transition-all  border-l-4    hover:border-l-6  ${
                    subdivisionName && subdivisionName.id === eachData.node.id
                        ? "bg-gray-100 border-l-6 border-l-gold text-darkgray75 "
                        : "text-darkgray75 border-l-primary"
                }`}
                onClick={() => handleSubdivision(eachData.node)}
            >
                <div className="flex flex-row justify-between">
                    <p className="text-sm py-3 px-2 font-semibold  ">{eachData.node.name}</p>
                    {
                        <XCircleIcon
                            className="w-7 h-7 mr-3 cursor-pointer self-center text-brickRed"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onClickDeleteSubdivision(deleteSubdivision, eachData);
                            }}
                        />
                    }
                </div>
            </li>
        );
    }

    function onClickDeleteSubdivision(deleteSubdivision, eachData) {
        if (window.confirm(`Are you sure you want to delete ${eachData?.node?.name}?`)) {
            setSubdivisionDeleteId(eachData?.node?.id);
        }
    }

    useEffect(() => {
        if (!subDivisionDeleteId) return;
        deleteSubdivision({
            variables: {
                id: subDivisionDeleteId,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subDivisionDeleteId]);

    const newProductContent = () => {
        return (
            <div className="grid grid-cols-1 w-full text-rose-200 py-5">
                <Disclosure as="div" className="">
                    <Disclosure.Button
                        className={`bg-white w-full px-4 focus:outline-none ${
                            active === "step1" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                        }`}
                    >
                        <div
                            style={{ maxHeight: "68px" }}
                            className={`flex flex-col md:flex-row py-2 rounded-lg justify-between items-center ${
                                active === "step1" && show
                                    ? "border-2 border-gray-400 rounded-b-none border-b-0 "
                                    : "border-2 border-gray-400"
                            } ${addAddress ? "bg-gray-100 cursor-not-allowed" : ""} `}
                            onClick={() => (addAddress ? {} : activeHandler("step1"))}
                        >
                            <div className=" font-title  text-center px-4 h2">
                                Step 1 :{" "}
                                {subdivisionNode && subdivisionNode.name ? subdivisionNode.name : "Subdivisions"}
                            </div>
                            {!completed.includes("1") ? (
                                active === "step1" && show ? (
                                    <ChevronUpIcon className="h-10 w-10 text-secondary mx-4" />
                                ) : (
                                    <ChevronDownIcon className="h-10 w-10 text-secondary mx-4" />
                                )
                            ) : (
                                <CheckCircleIcon className="h-10 w-10 text-brickGreen mx-4" />
                            )}
                        </div>
                    </Disclosure.Button>
                    <Transition
                        show={active === "step1" && show}
                        enter="transition duration-75 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Disclosure.Panel static>
                            <div className="px-4">
                                <div className="border-2 border-t-0 border-gray-400 rounded-lg rounded-t-none">
                                    <div className="px-4 grid grid-cols-6 col-span-6 2xl:col-span-4">
                                        <div className=" border-gray-400 col-span-6  items-start justify-between sm:items-center w-full">
                                            <div className="flex flex-row justify-between w-full">
                                                <div className=" flex flex-col px-4 pb-5 sm:col-span-2 w-full">
                                                    {subdivisionOptions.map((item, index) => {
                                                        return (
                                                            <>
                                                                <div className="mt-2" key={index}>
                                                                    <label className="inline-flex items-center ">
                                                                        <input
                                                                            type="radio"
                                                                            name={item.name}
                                                                            value={item.name}
                                                                            className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                            checked={subdivision === item.name}
                                                                            onChange={handleSubdivisionsBoolChange}
                                                                        ></input>
                                                                        <span className="ml-2 text-sm  text-secondary">
                                                                            {item.label}
                                                                        </span>
                                                                    </label>
                                                                </div>

                                                                {item.name === "createNew" &&
                                                                subdivision === "createNew" ? (
                                                                    <TextField
                                                                        autoFocus={true}
                                                                        labelClass
                                                                        parentClass="flex items-center space-x-10"
                                                                        id="name"
                                                                        label="Name Your Subdivision"
                                                                        name="name"
                                                                        value={fields?.name}
                                                                        onChange={handleChange}
                                                                        placeholder="Subdivision Name"
                                                                        type="text"
                                                                    />
                                                                ) : null}
                                                            </>
                                                        );
                                                    })}
                                                </div>
                                                <div className="py-2 pr-5 flex justify-end self-end w-full max-w-300">
                                                    <Button
                                                        color="primary"
                                                        title={
                                                            subdivision !== "createNew" ? "Next" : "Create Subdivision"
                                                        }
                                                        onClick={() =>
                                                            subdivision !== "createNew"
                                                                ? handleSingleBuild()
                                                                : createSubdivision()
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </Transition>
                </Disclosure>

                {completed.includes("1") ? (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full px-4  focus:outline-none ${
                                active === "step2" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                            }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col md:flex-row py-2 rounded-lg justify-between items-center ${
                                    active === "step2" && show
                                        ? "border-2 border-gray-400 rounded-b-none border-b-0 "
                                        : "border-2 border-gray-400"
                                }`}
                                onClick={() => {
                                    activeHandler("step2");
                                }}
                            >
                                <div className=" font-title  text-center px-4 h2">
                                    Step 2 : Choose The Type of Properties
                                </div>
                                {!completed.includes("2") ? (
                                    active === "step2" && show ? (
                                        <ChevronUpIcon className="h-10 w-10 text-secondary mx-4" />
                                    ) : (
                                        <ChevronDownIcon className="h-10 w-10 text-secondary mx-4" />
                                    )
                                ) : (
                                    <CheckCircleIcon className="h-10 w-10 text-brickGreen mx-4" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "step2" && show}
                            enter="transition duration-75 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="px-4">
                                    <div className="border-2 border-t-0 border-gray-400 rounded-lg rounded-t-none">
                                        <div className="px-4 grid grid-cols-6 col-span-6 2xl:col-span-4">
                                            <div className=" border-gray-400 col-span-6  items-start justify-between sm:items-center w-full">
                                                <div className="flex flex-row w-full justify-between">
                                                    <div className="flex flex-col px-4">
                                                        <div className=" flex flex-col pb-5">
                                                            {programValidityOptions.map((item, index) => {
                                                                return (
                                                                    <div className="mt-2" key={index}>
                                                                        <label className="inline-flex items-center ">
                                                                            <input
                                                                                type="radio"
                                                                                name={item.name}
                                                                                value={item.name}
                                                                                className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                                checked={propertyType === item.name}
                                                                                onChange={handlePropertyTypeChange}
                                                                            ></input>
                                                                            <span className="ml-2 text-sm  text-secondary">
                                                                                {item.label}
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="py-2 pr-5 flex justify-end self-end">
                                                        <Button
                                                            color="primary"
                                                            title={"Next"}
                                                            onClick={() => handleTabsChange("2")}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                ) : null}
                {completed.includes("2") ? (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full px-4  focus:outline-none ${
                                active === "step3" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                            }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col md:flex-row py-2 rounded-lg justify-between items-center ${
                                    active === "step3" && show
                                        ? "border-2 border-gray-400 rounded-b-none border-b-0 "
                                        : "border-2 border-gray-400"
                                }`}
                                onClick={() => activeHandler("step3")}
                            >
                                <div className=" font-title  text-center px-4 h2">
                                    Step 3 : Create Addresses in{" "}
                                    {completed.includes("2") && subdivisionNode && subdivisionNode.name
                                        ? subdivisionNode.name
                                        : "Subdivision Name"}
                                </div>
                                {!completed.includes("3") ? (
                                    active === "step3" && show ? (
                                        <ChevronUpIcon className="h-10 w-10 text-secondary mx-4" />
                                    ) : (
                                        <ChevronDownIcon className="h-10 w-10 text-secondary mx-4" />
                                    )
                                ) : (
                                    <CheckCircleIcon className="h-10 w-10 text-brickGreen mx-4" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "step3" && show}
                            enter="transition duration-75 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="px-4">
                                    <div className="border-2 border-t-0 border-gray-400 rounded-lg rounded-t-none">
                                        <div className="px-4 grid grid-cols-6 col-span-6 2xl:col-span-4">
                                            <div className=" border-gray-400 col-span-6  items-start justify-between sm:items-center w-full">
                                                <div className="flex flex-row justify-between w-full">
                                                    <div className=" flex flex-col px-4 pb-5 sm:col-span-2">
                                                        {uploadOptions.map((item, index) => {
                                                            return (
                                                                <>
                                                                    <div className="mt-2" key={index}>
                                                                        <label className="inline-flex items-center ">
                                                                            <input
                                                                                type="radio"
                                                                                name={item.name}
                                                                                value={item.name}
                                                                                className="form-radio h-5 w-5 text-secondary focus:ring-secondary"
                                                                                checked={upload === item.name}
                                                                                onChange={handleUploadBoolChange}
                                                                            ></input>
                                                                            <span className="ml-2 text-sm  text-secondary">
                                                                                {item.label}
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                    {item.name === "csvFile" && upload === "csvFile" ? (
                                                                        <>
                                                                            <span className="text-secondary">
                                                                                To get started{" "}
                                                                                <a
                                                                                    href={
                                                                                        process?.env
                                                                                            ?.REACT_APP_CSV_DOWNLOAD_URL
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    download
                                                                                    className="underline  text-secondary font-bold"
                                                                                >
                                                                                    {" "}
                                                                                    Download From Template
                                                                                </a>
                                                                            </span>
                                                                            <div className="flex">
                                                                                <label className="px-4 py-2 mt-2 border rounded-lg border-gray-400 text-center">
                                                                                    <div className="flex items-center space-x-4">
                                                                                        <span className=" text-secondary">
                                                                                            {file && file.name
                                                                                                ? file.name
                                                                                                : "Upload a completed CSV"}
                                                                                        </span>
                                                                                        {file && file.name ? (
                                                                                            <svg
                                                                                                onClick={() => setFile}
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                className="h-6 w-6 text-brickRed"
                                                                                                fill="none"
                                                                                                viewBox="0 0 24 24"
                                                                                                stroke="currentColor"
                                                                                            >
                                                                                                <path
                                                                                                    stroke-linecap="round"
                                                                                                    stroke-linejoin="round"
                                                                                                    stroke-width="2"
                                                                                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                                                />
                                                                                            </svg>
                                                                                        ) : null}
                                                                                    </div>

                                                                                    <input
                                                                                        type="file"
                                                                                        className="hidden"
                                                                                        onChange={handleFileChange}
                                                                                    />
                                                                                </label>
                                                                            </div>
                                                                        </>
                                                                    ) : null}
                                                                </>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="py-2 pr-5 flex justify-end self-end">
                                                        <Button
                                                            color="primary"
                                                            title={"Next"}
                                                            onClick={() => handleThirdStep()}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                ) : null}

                {completed.includes("3") ? (
                    <Disclosure as="div" className="mt-5">
                        <Disclosure.Button
                            className={`bg-white w-full px-4  focus:outline-none ${
                                active === "step4" && show ? "rounded-lg rounded-b-none" : "rounded-lg"
                            }`}
                        >
                            <div
                                style={{ maxHeight: "68px" }}
                                className={`flex flex-col md:flex-row py-2 rounded-lg justify-between items-center ${
                                    active === "step4" && show
                                        ? "border-2 border-gray-400 rounded-b-none border-b-0 "
                                        : "border-2 border-gray-400"
                                }`}
                                onClick={() => activeHandler("step4")}
                            >
                                <div className=" font-title  text-center px-4 h2">
                                    Step 4 : Confirm & Complete Address Creation
                                </div>
                                {!completed.includes("4") ? (
                                    active === "step4" && show ? (
                                        <ChevronUpIcon className="h-10 w-10 text-secondary mx-4" />
                                    ) : (
                                        <ChevronDownIcon className="h-10 w-10 text-secondary mx-4" />
                                    )
                                ) : (
                                    <CheckCircleIcon className="h-10 w-10 text-brickGreen mx-4" />
                                )}
                            </div>
                        </Disclosure.Button>
                        <Transition
                            show={active === "step4" && show}
                            enter="transition duration-75 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel static>
                                <div className="px-4">
                                    <div className="border-2 border-t-0 border-gray-400 rounded-lg rounded-t-none">
                                        <div className="px-4 grid grid-cols-6 col-span-6 2xl:col-span-4">
                                            <div className=" border-gray-400 col-span-6  items-start justify-between sm:items-center w-full overflow-y-auto ">
                                                <div className="flex flex-col justify-between w-full max-h-96 overflow-x-hidden scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                    {tableData()}
                                                </div>
                                                {upload === "manual" ? (
                                                    <div className="flex my-2 text-secondary space-x-4 items-center">
                                                        <div className="">Add Row(s)</div>
                                                        <button
                                                            className="border border-secondary px-2 rounded-lg hover:bg-secondary hover:text-white focus:outline-none"
                                                            onClick={() => setTableRows(tableRows + 1)}
                                                        >
                                                            1
                                                        </button>
                                                        <button
                                                            className="border border-secondary px-2 rounded-lg hover:bg-secondary hover:text-white focus:outline-none"
                                                            onClick={() => setTableRows(tableRows + 2)}
                                                        >
                                                            2
                                                        </button>
                                                        <button
                                                            className="border border-secondary px-2 rounded-lg hover:bg-secondary hover:text-white focus:outline-none"
                                                            onClick={() => setTableRows(tableRows + 5)}
                                                        >
                                                            5
                                                        </button>
                                                        <button
                                                            className="border border-secondary px-2 rounded-lg hover:bg-secondary hover:text-white focus:outline-none"
                                                            onClick={() => setTableRows(tableRows + 10)}
                                                        >
                                                            10
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </Disclosure>
                ) : null}
            </div>
        );
    };

    useEffect(() => {
        const escFunction = (event) => {
            if (event.keyCode === 27 && completed.includes("1")) {
                setModalConfirmation(true);
            } else if (event.keyCode === 27 && !completed.includes("1")) {
                setShowModal(false);
            }
        };
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [completed]);

    const confirmModalContent = () => {
        return (
            <div className="flex flex-col px-6">
                <p className="text-xl font-body text-darkGray">You have unsaved changes.</p>
                <p className="text-xl font-body text-darkGray">
                    Click Discard to proceed without saving, or Back to continue editing.
                </p>
            </div>
        );
    };

    const modal = () => {
        return (
            <>
                <Modal
                    Cancel={modalConfirmation}
                    title={modalConfirmation ? "Discard Changes?" : "Add Addresses"}
                    width={modalConfirmation ? "2xl" : "6xl"}
                    onSubmit={
                        modalConfirmation
                            ? () => {
                                  setShowModal(false);
                                  setModalConfirmation(false);
                              }
                            : active === "step4" && upload === "manual"
                            ? updateSubdivision
                            : createHouseFromCSV
                    }
                    minHeight={modalConfirmation ? "" : "min-h-smallMin"}
                    Content={modalConfirmation ? confirmModalContent() : newProductContent()}
                    submitLabelColor={modalConfirmation ? "brickRed" : "primary"}
                    disabled={createHouseFromCSVLoading}
                    submitLabel={modalConfirmation ? "Discard" : createHouseFromCSVLoading ? "Creating" : "Confirm"}
                    showSubmit={modalConfirmation ? true : active === "step4" && upload}
                    onClose={() =>
                        modalConfirmation
                            ? setModalConfirmation(false)
                            : completed.includes("1")
                            ? setModalConfirmation(true)
                            : setShowModal(false)
                    }
                    IconJSX={modalConfirmation ? null : <PlusCircleIcon className="w-10 h-10 text-brickGreen" />}
                    show={showModal}
                />
            </>
        );
    };

    return (
        <div className="min-h-smallMin  max-w-8xl flex flex-col gap-5 h-full w-8xl mx-auto px-4 sm:px-6 lg:px-32">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE} - Manage Addresses</title>
            </Helmet>

            <div className=" bg-white rounded-lg py-4  px-4 h1 flex w-full justify-between items-center">
                <div className="flex items-center">
                    <p>Manage Addresses</p>

                    <HelperModal type={"addresses"} title="Addresses Information" />
                </div>
                <Link
                    className="text-md"
                    to={{
                        pathname: "/reporting/assignment",
                        state: { tab: "assignment" },
                    }}
                >
                    Go to: <span>Product Assignment</span>
                </Link>
            </div>
            <div className="flex space-x-5   overflow-hidden" style={{ minHeight: "79vh", maxHeight: "79vh" }}>
                <div className="bg-white border w-full max-w-xs rounded-lg  ">
                    <div className="inset-0    h-full flex flex-col">
                        <div className="flex justify-between w-full px-4 border-b  items-center">
                            <div className="font-title  py-4 text-center h2">Subdivisions</div>
                            <div className="my-1 ml-5 flex rounded-md ">
                                <div className="relative flex sm:w-100 ">
                                    <input
                                        onChange={(e) => handleSearchChange(e)}
                                        type="text"
                                        name="searchString"
                                        id="searchString"
                                        className="focus:ring-secondary focus:border-secondary block rounded-md  w-full sm:text-sm border-gray-300"
                                        placeholder="Find or Add"
                                        value={searchString}
                                    ></input>
                                </div>
                                {searched === true ? (
                                    <button
                                        type="button"
                                        className="text-lg  pl-2  font-medium  rounded-md text-secondary focus:outline-none"
                                        onClick={() => {
                                            setActiveDetail(false);
                                            setShowModal(true);
                                            setSubdivisionNode();
                                            setSubdivisionName();
                                            setCompleted([]);
                                            setFields({
                                                ...fields,
                                                name: searchString,
                                            });
                                            setSearchedString("");
                                            setSearched(false);
                                            setShow(true);
                                            setActive("step1");
                                            setAddAddress(false);
                                        }}
                                    >
                                        <svg
                                            className="w-8 h-8"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400 w-full h-full">
                            <div className="w-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                <ul className=" flex-0 w-full h-full scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400  overflow-auto">
                                    {searched === true ? (
                                        searchSubdivisionsLoading ? (
                                            <Loader />
                                        ) : searchedSubdivisions?.searchSubdivisions?.edges?.length === 0 ? (
                                            <div className="border-b py-2 px-2 text-secondary font-title font-semibold flex items-center justify-between">
                                                <p> No Results Found </p>
                                                <span
                                                    className="underline cursor-pointer text-brickRed"
                                                    onClick={() => {
                                                        setSearchedString("");
                                                        setSearched(false);
                                                    }}
                                                >
                                                    {" "}
                                                    Reset{" "}
                                                </span>
                                            </div>
                                        ) : (
                                            sortSubdivisionNames(searchedSubdivisions?.searchSubdivisions?.edges)?.map(
                                                (eachData, index) => {
                                                    if (
                                                        index === searchedSubdivisions &&
                                                        searchedSubdivisions.searchSubdivisions.edges.length - 1
                                                    ) {
                                                        return listSubdivisions(
                                                            index,
                                                            subdivisionName,
                                                            eachData,
                                                            handleSubdivision,
                                                            deleteSubdivision
                                                        );
                                                    }
                                                    return listSubdivisions(
                                                        index,
                                                        subdivisionName,
                                                        eachData,
                                                        handleSubdivision,
                                                        deleteSubdivision
                                                    );
                                                }
                                            )
                                        )
                                    ) : subdivisionLoading ? (
                                        <Loader />
                                    ) : (
                                        sortSubdivisionNames(subdivisions?.subdivisions?.edges)?.map(
                                            (eachData, index) => {
                                                if (
                                                    index === subdivisions &&
                                                    subdivisions.subdivisions.edges.length - 1
                                                ) {
                                                    return listSubdivisions(
                                                        index,
                                                        subdivisionName,
                                                        eachData,
                                                        handleSubdivision,
                                                        deleteSubdivision
                                                    );
                                                }
                                                return listSubdivisions(
                                                    index,
                                                    subdivisionName,
                                                    eachData,
                                                    handleSubdivision,
                                                    deleteSubdivision
                                                );
                                            }
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border w-full  2xl:max-w-xs  rounded-lg  ">
                    <div className="h-full relative   lg:pr-0 xl:pr-3 2xl:pr-0">
                        <div className="    h-full flex flex-col">
                            <div className="flex px-4 flex-col md:flex-row justify-between items-center border-b">
                                <p className="font-title  py-4 text-center h2">
                                    {subdivisionName && subdivisionName.name ? subdivisionName.name : "Details"}
                                </p>
                            </div>
                            {activeDetail ? (
                                addressesLoading ? (
                                    <Loader />
                                ) : (
                                    <div className="flex flex-col flex-1 overflow-auto w-full">
                                        <div className="flex flex-col h-full overflow-auto w-full">
                                            <div className="w-full flex flex-col  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                                <p className="px-4 pt-4 pb-1  font-title text-secondary text-lg font-bold">
                                                    About{" "}
                                                    {subdivisionName && subdivisionName.name
                                                        ? subdivisionName.name
                                                        : "These Addresses"}
                                                </p>
                                                <ul className="mt-1 mb-1 flex flex-col space-y-5 px-4">
                                                    <li className="col-span-1 flex shadow-sm border rounded-md">
                                                        <div
                                                            className={`flex-shrink-0 flex items-center justify-center w-16 text-secondary85 text-white text-lg font-medium rounded-l-md`}
                                                        >
                                                            {addresses?.subdivisionWithData?.data?.residential_number?.toLocaleString()}
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-between border-l border-gray-200 bg-white rounded-r-md truncate">
                                                            <div className="flex-1 px-4 py-4 text-sm">
                                                                <div
                                                                    to="#"
                                                                    className="text-gray-900 font-medium hover:text-gray-600"
                                                                >
                                                                    Residential
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="col-span-1 flex shadow-sm rounded-md border">
                                                        <div
                                                            className={`flex-shrink-0 flex items-center justify-center w-16 text-secondary85 text-white text-xl font-medium rounded-l-md`}
                                                        >
                                                            {addresses &&
                                                                addresses.subdivisionWithData &&
                                                                addresses.subdivisionWithData.data.commercial_number?.toLocaleString()}
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-between border-l border-gray-200 bg-white rounded-r-md truncate">
                                                            <div className="flex-1 px-4 py-4 text-sm">
                                                                <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                    Commercial
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="col-span-1 flex shadow-sm rounded-md border">
                                                        <div
                                                            className={`flex-shrink-0 flex items-center justify-center w-16 text-secondary85 text-white text-xl font-medium rounded-l-md`}
                                                        >
                                                            {addresses?.subdivisionWithData?.data?.multiUnit_number?.toLocaleString()}
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-between border-l border-gray-200 bg-white rounded-r-md truncate">
                                                            <div className="flex-1 px-4 py-4 text-sm">
                                                                <div className="text-gray-900 font-medium hover:text-gray-600">
                                                                    Multi-unit
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <p className="px-4 pt-4 pb-1 font-title text-secondary text-lg font-bold">
                                                    Rebate Reporting Status
                                                </p>
                                                <ul className="mt-1 pb-4 flex flex-col  px-4 space-y-5  w-full">
                                                    <li className="col-span-1 flex shadow-sm rounded-md border">
                                                        <div
                                                            className={`flex-shrink-0 flex items-center justify-center w-16 text-secondary85 text-white text-xl font-medium rounded-l-md`}
                                                        >
                                                            {addresses &&
                                                                addresses.subdivisionWithData &&
                                                                addresses.subdivisionWithData.data.rebate_inProgress_number?.toLocaleString()}
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-between border-l border-gray-200 bg-white rounded-r-md truncate">
                                                            <div className="flex-1 px-4 py-4 text-sm">
                                                                <Link
                                                                    to={{ pathname: "/reporting/prepare", active: "1" }}
                                                                    className="text-gray-900 font-medium hover:text-gray-600"
                                                                >
                                                                    Total in Progress
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="col-span-1 flex shadow-sm border rounded-md">
                                                        <div
                                                            className={`flex-shrink-0 flex items-center justify-center w-16 text-secondary85 text-white text-xl font-medium rounded-l-md`}
                                                        >
                                                            {addresses &&
                                                                addresses.subdivisionWithData &&
                                                                addresses.subdivisionWithData.data.rebate_rebated_number?.toLocaleString()}
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-between border-l border-gray-200 bg-white rounded-r-md truncate">
                                                            <div className="flex-1 px-4 py-4 text-sm">
                                                                <Link
                                                                    to={{ pathname: "/reporting/prepare", active: "2" }}
                                                                    className="text-gray-900 font-medium hover:text-gray-600"
                                                                >
                                                                    Total Rebated
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="bg-white border  w-full rounded-lg">
                    <div className="h-full relative   lg:pr-0 xl:pr-3 2xl:pr-0">
                        {modal()}
                        <div className="inset-0    h-full flex flex-col">
                            <div className="flex px-4 flex-col md:flex-row justify-between items-center">
                                <div className=" font-title  py-4 text-center h2">
                                    {subdivisionName && subdivisionName.name
                                        ? subdivisionName.name + " Addresses"
                                        : "Subdivision Name"}
                                </div>
                                {subdivisionName ? (
                                    <div className="">
                                        <button
                                            type="button"
                                            className="text-lg py-3 mr-3 border-transparent   font-medium rounded-md text-secondary focus:outline-none"
                                            onClick={() => {
                                                setShowModal(true);
                                                setAddAddress(true);
                                                setCompleted((completed) => [...completed, "1", "2"]);
                                                setActive("step3");
                                                setSubdivisionNode(subdivisionName);
                                            }}
                                        >
                                            <svg
                                                className="w-8 h-8"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex flex-col flex-1 overflow-auto w-full">
                                <div className="flex flex-col h-full  w-full">
                                    <div className="w-full h-full  scrollbar-thin scrollbar-thumb-lightPrimary scrollbar-track-gray-400">
                                        <div className="grid h-full  grid-cols-1 gap-6 border-t border-b">
                                            {subdivisionName && subdivisionName.id ? (
                                                addressesLoading ? (
                                                    <Loader />
                                                ) : (
                                                    <Accordian
                                                        onClick={(data) => {
                                                            accordianDataClick(data.node);
                                                            setEditHouse(false);
                                                        }}
                                                        closeAccordian={closeAccordian}
                                                        fromAddress
                                                        component={AccordianComponent()}
                                                        Data={
                                                            accordianData && accordianData.length > 0
                                                                ? accordianData
                                                                : null
                                                        }
                                                    />
                                                )
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Addresses;
