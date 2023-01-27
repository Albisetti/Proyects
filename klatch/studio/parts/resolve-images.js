import {
  Card, Dialog
} from "@sanity/ui";
import { CaretCircleDown } from 'phosphor-react';
import React, { useCallback, useState } from "react";

export default {
  name: 'shopify', // Unique source name
  title: 'Shopify Source', // Title displayed in lists, buttons etc
  component: ShopifyAssetSource, // Selection component
  icon: CaretCircleDown 
}
function ShopifyAssetSource({ onSelect, onClose }) {
  const handleSelect = React.useCallback((imageUrl) => {
    onSelect([
      {
        kind: "url",
        value:
          imageUrl,
        assetDocumentProps: {
          originalFilename: "product-image", // Use this filename when the asset is saved as a file by someone.
          source: {
            // The source this image is from
            name: "github.githubassets.com",
            // A string that uniquely idenitfies it within the source.
            // In this example the URL is the closest thing we have as an actual ID.
            id: imageUrl,
          },
          description: "Product Image",
          creditLine: "By Shopify.com",
        },
      },
    ]);
  }, [onSelect]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
  const [imageUrl, setImage] = useState()
  return (
    <Dialog
      id="github-asset-source"
      header="Select image from Shopify"
      onClose={handleClose}
      width={4}
      open
    >
      <Card>
        <input type='url' value={imageUrl} onChange={ev => setImage(ev.target.value)} />
        {imageUrl 
        ? 
          <>
            <img
              src={imageUrl}
            />
            <button onClick={ev => handleSelect(imageUrl)} >Select Image</button>
          </>
        :<></>}

      </Card>
    </Dialog>
  );
}