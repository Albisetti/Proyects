import React from "react";
import { useQuery } from "@apollo/client";
import Loader from '../../Loader/Loader';

import { FETCH_ORGANIZATION_PROGRAMS } from "../../../lib/organization";

const SupplierPrograms = ({ id }) => {
    const { data, loading: supplierProgramsLoading } = useQuery(
        FETCH_ORGANIZATION_PROGRAMS,
        {
            notifyOnNetworkStatusChange: false,
            variables: { id },
        }
    );

    return (
        <>
            {supplierProgramsLoading ? (
                <Loader />
            ) : (
                data?.organization?.programs?.edges.map((program) => (
                    <li>{program.name}</li>
                ))
            )}
        </>
    );
};

export default SupplierPrograms;
