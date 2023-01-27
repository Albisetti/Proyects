export const sortSubdivisionNames = (array) => {
    const regex = /[0-9]{4}-Q[1-4]{1}/i;
    let lastItems = [];
    let withoutSingleBuild = [];
    let singleBuild = [];
    lastItems = array?.filter((item) => !regex.test(item?.node?.name) && item?.node?.name !== "Single Build");
    withoutSingleBuild = array?.filter((item) => regex.test(item?.node?.name) && item?.node?.name !== "Single Build");
    singleBuild = array?.filter((item) => item?.node?.name === "Single Build");
    withoutSingleBuild?.sort((a, b) => b?.node?.name?.localeCompare(a?.node?.name));
    if (withoutSingleBuild?.length > 0 && singleBuild?.length > 0 && lastItems?.length > 0) {
        let finalArray = [...withoutSingleBuild, ...singleBuild, ...lastItems];
        return finalArray;
    } else if (withoutSingleBuild?.length > 0 && lastItems?.length > 0 && singleBuild?.length === 0) {
        let finalArray = [...withoutSingleBuild, ...lastItems];
        return finalArray;
    } else if (withoutSingleBuild?.length > 0 && lastItems?.length === 0 && singleBuild?.length > 0) {
        let finalArray = [...withoutSingleBuild, ...singleBuild];
        return finalArray;
    } else if (withoutSingleBuild?.length === 0 && lastItems?.length > 0 && singleBuild?.length > 0) {
        let finalArray = [...lastItems, ...singleBuild];
        return finalArray;
    } else if (withoutSingleBuild?.length > 0 && lastItems?.length === 0 && singleBuild?.length === 0) {
        let finalArray = [...withoutSingleBuild];
        return finalArray;
    } else {
        return array;
    }
};

export const sortSubdivisionPrepareRebates = (array) => {
    const regex = /[0-9]{4}-Q[1-4]{1}/i;
    let lastItems = [];
    let withoutSingleBuild = [];
    let singleBuild = [];
    lastItems = array?.filter((item) => !regex.test(item?.subdivisionName) && item?.subdivisionName !== "Single Build");
    withoutSingleBuild = array?.filter(
        (item) => regex.test(item?.subdivisionName) && item?.subdivisionName !== "Single Build"
    );
    singleBuild = array?.filter((item) => item?.subdivisionName === "Single Build");
    withoutSingleBuild?.sort((a, b) => b?.subdivisionName?.localeCompare(a?.subdivisionName));
    if (withoutSingleBuild?.length > 0 && singleBuild?.length > 0 && lastItems?.length > 0) {
        let finalArray = [...withoutSingleBuild, ...singleBuild, ...lastItems];
        return finalArray;
    } else if (withoutSingleBuild?.length > 0 && lastItems?.length > 0 && singleBuild?.length === 0) {
        let finalArray = [...withoutSingleBuild, ...lastItems];
        return finalArray;
    } else if (withoutSingleBuild?.length > 0 && lastItems?.length === 0 && singleBuild?.length > 0) {
        let finalArray = [...withoutSingleBuild, ...singleBuild];
        return finalArray;
    } else if (withoutSingleBuild?.length === 0 && lastItems?.length > 0 && singleBuild?.length > 0) {
        let finalArray = [...lastItems, ...singleBuild];
        return finalArray;
    } else if (withoutSingleBuild?.length > 0 && lastItems?.length === 0 && singleBuild?.length === 0) {
        let finalArray = [...withoutSingleBuild];
        return finalArray;
    } else {
        return array;
    }
};

export const sortSubcontractorCategories = (object) => {
    let $returnArray = [...object?.subcontractorCategories?.edges];
    let $otherCategoryRecord = $returnArray?.filter((item) => {
        return item?.node?.name === "Other"
    });
    $returnArray.sort((a,b)=>a?.node?.name?.localeCompare(b?.node?.name))

    return {
        subcontractorCategories: {
            edges: [...$returnArray, ...$otherCategoryRecord],
            pageInfo: object?.subcontractorCategories?.pageInfo,
            __typename: object?.subcontractorCategories?.__typename
        }
    };
}