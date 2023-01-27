import React, { FC, useEffect, useState } from "react";
import Agent from "../../models/Agent";
import { formatPhoneNumber } from "../../utils";

type HeaderProps = {
  agentState?: Agent;
};

export const Header: FC<HeaderProps> = ({ agentState }) => {
  const [findADocOpen, setFindADocOpen] = useState(false);
  const [copyState, setCopyState] = useState("Share");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setFindADocOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function copy(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    var dummy = document.createElement("input"),
      text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    setCopyState("Copied!");
    setTimeout(() => {
      setCopyState("Share Link");
    }, 2000);
  }

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return (
    <>
      <div className="top-0 left-0 w-full  bg-white pb-2 md:pb-0 lg:h-20">
        <div className="flex flex-col justify-center gap-[0.35rem] px-[5px] sm:flex-row sm:justify-between sm:gap-5 sm:px-2 lg:container lg:h-20">
          <div className="flex flex-row items-end justify-between sm:justify-end">
            <img src="/ncd_logo.svg" className="h-20" alt="NCD Logo" />
            <div className="ml-[9px] whitespace-nowrap pb-[10px] text-sm font-medium leading-[17px] text-celadonBlue">
              Powered by
            </div>
            <div className="flex flex-col items-center pt-[18px] sm:pr-0 sm:pt-0 md:flex-row">
              <img
                src="/metlife-new-logo.svg"
                className="h-[28px] w-[90px] sm:ml-[12px] sm:h-auto sm:w-auto sm:self-end sm:pb-[9px]"
                alt="Metlife Logo"
              />
              <div className="text-sm font-medium text-celadonBlue sm:ml-[13px] sm:self-end sm:pb-[10px]">
                &
              </div>
              <img
                src="/vsp-new-logo.svg"
                className="h-[28px] w-[50px] sm:ml-[9px] sm:h-auto sm:w-auto sm:self-end sm:pb-[4px]"
                alt="Metlife Logo"
              />
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 px-[5px] text-xs sm:self-center sm:px-0 sm:text-base">
            <div
              className={`flex flex-row sm:flex-col sm:pr-[20px] ${
                !agentState && "hidden"
              }`}
            >
              <div className="font-bold text-navyBlue sm:text-end">
                {agentState?.firstName} {agentState?.lastName}
              </div>
              <div className="px-1 sm:hidden">|</div>
              <div className="font-semibold text-navyBlue sm:text-end">
                {formatPhoneNumber(agentState?.phoneNumber?.toString())}
              </div>
              <div className="px-1 sm:hidden">|</div>
              <div className="font-semibold text-navyBlue">
                {agentState?.email}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="top-0 z-50 w-full bg-orange pb-1 md:sticky">
        <div className="w-full bg-navyBlue">
          <div className="flex items-center justify-center gap-2 py-[22px] px-2 font-inter text-white md:items-start md:justify-start lg:container">
            <div className="flex flex-col gap-2 lg:flex-row">
              <div className="group relative w-[165px] text-center text-base  font-normal">
                <a
                  className="flex h-[29px] w-[165px] cursor-pointer items-center justify-center rounded-full bg-celadonBlue text-center text-base font-normal text-white"
                  href="https://providers.online.metlife.com/findDentist?searchType=findDentistRetail&planType=DPPO"
                  target="_blank"
                  rel="noreferrer"
                >
                  Dental Doc Search
                </a>
              </div>
              <div className="group relative w-[165px] text-center text-base  font-normal">
                <a
                  className="flex h-[29px] w-[165px] cursor-pointer items-center justify-center rounded-full bg-celadonBlue text-center text-base font-normal text-white"
                  href="https://www.vsp.com/eye-doctor"
                  target="_blank"
                  rel="noreferrer"
                >
                  Vision Doc Search
                </a>
              </div>
            </div>
            <div className="group relative hidden w-[145px] text-center text-base font-normal  md:block">
              <div
                className="flex h-[29px] w-[145px] cursor-pointer items-center justify-center rounded-full bg-celadonBlue text-center text-base font-normal text-white"
                onClick={(event) => copy(event)}
              >
                {copyState && copyState}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
