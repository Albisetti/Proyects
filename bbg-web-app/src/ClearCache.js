import React, { useState, useEffect } from "react";
import packageJson from "../package.json";

const buildDateGreaterThan = (latestDate, currentDate) => {
  const momLatestDateTime = latestDate;
  const momCurrentDateTime = currentDate;
  if (momLatestDateTime > momCurrentDateTime) {
    return true;
  } else {
    return false;
  }
};

const WithClearCache = (Component) => {

 


  function ClearCacheComponent(props) {
    const [isLatestBuildDate, setIsLatestBuildDate] = useState(false);
    


    useEffect(() => {
      fetch("/meta.json", {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((meta) => {
          const latestVersionDate = meta.buildDate;
          const currentVersionDate = packageJson.buildDate;

          const shouldForceRefresh = buildDateGreaterThan(
            latestVersionDate,
            currentVersionDate
          );
          if (shouldForceRefresh) {
            setIsLatestBuildDate(false);
            refreshCacheAndReload();
          } else {
            setIsLatestBuildDate(true);
          }
        });
    });


    const refreshCacheAndReload = () => {
      if (caches) {
        // Service worker cache should be cleared with caches.delete()
        caches.keys().then(async function (names) {
          await Promise.all(names.map(name => caches.delete(name)));
        });
        // });
      }
      window.location.reload(true);
    };

    return (
      <React.Fragment>
        {isLatestBuildDate ? <Component {...props} /> : null}
      </React.Fragment>
    );
  }

  return ClearCacheComponent;
}

export default WithClearCache;