import React from "react";
import PropTypes from "prop-types";

const TwoColumn = ({
  contentLeft,
  contentRight,
  contentLeftAlignment,
  contentRightAlignment,
  flip,
}) => {
  return (
    <section className="container grid gap-y-[32px] grid-cols-1 lg:gap-y-0 lg:gap-x-[42px] lg:grid-cols-2 py-[42px] lg:py-[42px]">
      {flip ? (
        <>
          {contentRight && (
            <div className="flex items-center">
              <div
                className={`lg:text-[20px] lg:leading-[30px] ${contentRightAlignment}`}
              >
                {contentRight}
              </div>
            </div>
          )}
          {contentLeft && (
            <div className="flex items-center">
              <div
                className={`lg:text-[20px] lg:leading-[30px] ${contentLeftAlignment}`}
              >
                {contentLeft}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {contentLeft && (
            <div className="flex items-center">
              <div
                className={`lg:text-[20px] lg:leading-[30px] ${contentLeftAlignment}`}
              >
                {contentLeft}
              </div>
            </div>
          )}

          {contentRight && (
            <div className="flex items-center">
              <div
                className={`lg:text-[20px] lg:leading-[30px] ${contentRightAlignment}`}
              >
                {contentRight}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

TwoColumn.propTypes = {
  contentLeft: PropTypes.any,
  contentRight: PropTypes.any,
  contentLeftAlignment: PropTypes.oneOf([
    "text-left",
    "text-center",
    "text-right",
  ]),
  contentRightAlignment: PropTypes.oneOf([
    "text-left",
    "text-center",
    "text-right",
  ]),
  flip: PropTypes.bool,
};

TwoColumn.defaultProps = {
  contentLeftAlignment: "text-left",
  contentRightAlignment: "text-left",
  flip: false,
};

export default TwoColumn;
