import gql from "graphql-tag";
import {APP_TITLE} from "../../util/constants";

export const FETCH_HELPER_DATA = gql`
    query posts {
        posts(where: { categoryName: "help" }) {
            pageInfo {
                hasNextPage
            }
            nodes {
                id
                title
                content
                slug
            }
        }
    }
`;

export const FETCH_BUILDER_AD_POST = gql`
    query posts {
        posts(where: { categoryName: "builderAdminPromotion" }) {
            edges {
                node {
                    title
                    content
                    featuredImage {
                        node {
                            sourceUrl
                        }
                    }
                }
            }
        }
    }
`;

export const FETCH_BUILDER_EARN_MORE_POST = gql`
    query {
        acfOptions {
            earnMore {
                image {
                    sourceUrl
                }
                description
            }
        }
    }
`;

export const FETCH_TM_AD_POST = gql`
    query posts {
        posts(where: { categoryName: "tmPromotion" }) {
            edges {
                node {
                    title
                    content
                    featuredImage {
                        node {
                            sourceUrl
                        }
                    }
                }
            }
        }
    }
`;

export const FETCH_DEADLINE = gql`
    query {
        acfOptions {
            deadlineAlert {
                date
                message
            }
        }
    }
`;

export const RECENTLY_ADOPTED_PROGRAMS = gql`
    query {
        recentlyAdoptedPrograms {
            organization {
                id
                name
            }
            program {
                id
                name
                type
            }
        }
    }
`;

export const FETCH_PORTAL_ADS = gql`
    query posts {
        posts(where: { categoryName: "${APP_TITLE} Ads - Wide" }) {
            edges {
                node {
                    title
                    content
                    tags {
                        edges {
                            node {
                                name
                            }
                        }
                    }
                    featuredImage {
                        node {
                            sourceUrl
                        }
                    }
                }
            }
        }
    }
`;

export const FETCH_PORTAL_ADS_SQUARE = gql`
    query posts {
        posts(where: { categoryName: "${APP_TITLE} Ads - Square" }) {
            edges {
                node {
                    title
                    content
                    tags {
                        edges {
                            node {
                                name
                            }
                        }
                    }
                    featuredImage {
                        node {
                            sourceUrl
                        }
                    }
                }
            }
        }
    }
`;

export const FETCH_TRAINING_DATA = gql`
    query posts {
        posts(where: { categoryIn: ["17", "19"] }) {
            edges {
                node {
                    title
                    content
                    excerpt
                    slug
                    tags {
                        edges {
                            node {
                                name
                            }
                        }
                    }
                    categories {
                        edges {
                            node {
                                databaseId
                            }
                        }
                    }
                    blocks {
                        attributesJSON
                        name
                        innerBlocks {
                            attributesJSON
                            name
                            innerBlocks {
                                attributesJSON
                                name
                                innerBlocks {
                                    attributesJSON
                                    name
                                    innerBlocks {
                                        attributesJSON
                                        name
                                    }
                                }
                            }
                        }
                    }
                    featuredImage {
                        node {
                            sourceUrl
                        }
                    }
                }
            }
        }
    }
`;
