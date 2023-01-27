import React from "react";

/* WordPress Core Gutenberg blocks */
import CoreColumn from "../components/Portal/core/column";
import CoreColumns from "../components/Portal/core/columns";
import CoreGroup from "../components/Portal/core/group";
import CoreImage from "../components/Portal/core/image";
import CoreParagraph from "../components/Portal/core/paragraph";
import CoreHeading from "../components/Portal/core/heading";
import CoreSpacer from "../components/Portal/core/spacer";
import CoreHtml from "../components/Portal/core/html";
import CoreLists from "../components/Portal/core/list";
import CoreTable from "../components/Portal/core/table";
import CoreQuote from "../components/Portal/core/quote";
import CoreEmbed from '../components/Portal/core/embed';

/* ACF Blocks */

export const blockNameToComponent = {
    "core/column": CoreColumn,
    "core/columns": CoreColumns,
    "core/group": CoreGroup,
    "core/image": CoreImage,
    "core/paragraph": CoreParagraph,
    "core/spacer": CoreSpacer,
    "core/heading": CoreHeading,
    "core/html": CoreHtml,
    "core/list": CoreLists,
    "core/table": CoreTable,
    "core/quote": CoreQuote,
    'core/embed': CoreEmbed
};

export function renderGutenbergBlocks(blocks, pageProps = {}) {
    return blocks.map((block, index) => {
        const blockAttributes = JSON.parse(block.attributesJSON);
        
        const BlockComponent = blockNameToComponent[block.name];

        if (!BlockComponent) {
            /* Tried to render a block without a local equivalent */
            return null;
        }


        return (
            <BlockComponent
                key={index}
                data={{}} /* Set a default on ACF data objects */
                {...blockAttributes}
                pageProps={pageProps}
            >
                {renderGutenbergBlocks(block.innerBlocks, pageProps)}
            </BlockComponent>
        );
    });
}

/* Utility function to reconstruct repeater fields' array client-side */
export function extractRepeaterField(data, fieldName) {
    // eslint-disable-next-line
    if (!fieldName in data) {
        return null;
    }

    const topItem = data[fieldName];
    const dataKeys = Object.keys(data);
    const results = [];

    for (let i = 0; i < topItem; i++) {
        const re = new RegExp(`^${fieldName}_${i}_(.*)$`);
        const fields = {};

        for (const dataKey of dataKeys) {
            const matches = re.exec(dataKey);

            if (matches) {
                const [unmodifiedKey, fieldKey] = matches;

                fields[fieldKey] = data[unmodifiedKey];
            }
        }

        results.push(fields);
    }

    return results;
}
