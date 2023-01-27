import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/Button";
import Member from "../../models/Member";
import { nonValidDentalStates, nonValidVisionStates } from "../../utils";
import Agent from "../../models/Agent";

type HomePageProps = {
  member: Member;
  agent: Agent;
  setValidDentalInState: React.Dispatch<React.SetStateAction<boolean>>;
  setValidVisionInState: React.Dispatch<React.SetStateAction<boolean>>;
  setZipCodeState: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const HomePage: FC<HomePageProps> = ({
  member,
  agent,
  setValidDentalInState,
  setValidVisionInState,
  setZipCodeState,
  setStep,
}: HomePageProps) => {
  const [zipCode, setZipCode] = useState<string>();
  const [error, setError] = useState("");

  useEffect(() => {}, [zipCode]);
  return (
    <div
      className="relative font-inter"
      onSubmit={(e) => {
        e.preventDefault();
        member.zipCode = zipCode;
        axios
          .get(
            "https://us-zipcode.api.smartystreets.com/lookup?key=96942227415750359&city=&state=",
            {
              params: { zipcode: zipCode },
            }
          )
          .then((response) => {
            if (response?.data[0]?.status === "invalid_zipcode") {
              setError("Invalid zip code");
            } else {
              if (
                nonValidDentalStates.includes(
                  response?.data[0]?.city_states[0]?.state_abbreviation
                )
              ) {
                setValidDentalInState(false);
              }
              if (
                nonValidVisionStates.includes(
                  response?.data[0]?.city_states[0]?.state_abbreviation
                )
              )
                setValidVisionInState(false);
              setZipCodeState(
                response?.data[0]?.city_states[0]?.state_abbreviation
              );
              setStep((current) => current + 1);
            }
          });
      }}
    >
      <form>
        <div className="flex flex-col items-center justify-center gap-4 px-2 py-[33px] lg:container">
          <div className="flex max-w-[760px] flex-col gap-[27px]">
            <div className="sticky top-2 rounded-[32px] border-4 border-solid border-celadonBlue bg-backgroundSolidGrey px-[20px] py-[45px] text-center md:top-20">
              <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
                <div className="text-[20px] font-bold text-black">
                  Please enter your zip code to begin
                </div>
                <div className="flex flex-col items-center justify-center gap-5 text-[20px] text-navyBlue sm:flex-row">
                  <div className="flex flex-col">
                    <input
                      className="max-h-[29px] max-w-[232px] appearance-none rounded-full border border-solid border-celadonBlue text-center text-black outline-none focus:outline-none"
                      placeholder="Enter zip code"
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onKeyDown={(event) => {
                        if (
                          event.code === "Slash" ||
                          event.code === "Comma" ||
                          event.code === "Period" ||
                          event.code === "NumpadAdd" ||
                          event.code === "NumpadSubtract"
                        ) {
                          event.preventDefault();
                        }
                      }}
                      onChange={(event) => {
                        if (event?.target?.value.length > 5) return;
                        if (event?.target?.value) {
                          setZipCode(event?.target?.value);
                        }

                        setError("");
                      }}
                    />
                  </div>
                  <div className="h-[29px] w-[145px] text-[20px] md:h-[29px] md:w-[88px]">
                    <Button text={"Quote"} submit mainPath />
                  </div>
                </div>
              </div>
              {error && (
                <p className="text-base font-normal" style={{ color: "red" }}>
                  {error}
                </p>
              )}
            </div>
            {agent?.id !== 660555 ? (
              <div className="flex flex-col justify-start overflow-y-auto rounded-[32px] border-4 border-solid border-celadonBlue bg-backgroundSolidGrey py-6 px-6 pb-3 text-black">
                <div className="mb-5 self-start text-[24px] font-semibold">
                  NCD: Insurance, Reimagined{" "}
                </div>
                <p className="my-4 text-[20px]">
                  When it comes to quality care, it isn’t just about your eyes,
                  or your teeth. It’s about you — all of you.
                </p>{" "}
                <p className="my-4 text-[20px]">
                  At NCD, we’re here to empower all of our members to make their
                  best healthcare decisions, to reach their goals, and to enjoy
                  a well-lived, healthy, and smile-worthy life. We want to
                  change lives and Spread the Smile, and that’s what drives us
                  to do better, and offer incredible, industry-first products.{" "}
                </p>
                <p className="mt-4 text-[20px]">
                  Why pick and choose, when you could have so much more than
                  insurance?
                </p>
              </div>
            ) : (
              <div className="flex flex-col justify-start overflow-y-auto rounded-[32px] border-4 border-solid border-celadonBlue bg-backgroundSolidGrey py-6 px-6 pb-3 text-black">
                <div className="mb-5 self-start text-[24px] font-semibold">
                  NCD: Insurance, Reimagined Member Care ID{" "}
                </div>
                <p className="my-4 text-[20px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                  condimentum libero tortor, sed ornare arcu tempor eget. Cras
                  tincidunt id justo et iaculis. Praesent iaculis euismod nibh.
                  Orci varius natoque penatibus et magnis dis parturient montes
                </p>{" "}
                <p className="my-4 text-[20px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                  condimentum libero tortor, sed ornare arcu tempor eget. Cras
                  tincidunt id justo et iaculis. Praesent iaculis euismod nibh.
                  Orci varius natoque penatibus et magnis dis parturient montes,
                  nascetur ridiculus mus. Sed efficitur magna sed nisi gravida
                  accumsan. Suspendisse at tempor enim. Nulla massa quam,
                  volutpat id nunc a, pharetra sodales lacus. Ut malesuada felis
                  efficitur, dapibus lacus at, condimentum nunc. Donec et
                  pellentesque augue. Phasellus sit amet lacinia tellus.{" "}
                </p>
                <p className="mt-4 text-[20px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                  condimentum libero tortor, sed ornare arcu tempor eget. Cras
                  tincidunt id justo et iaculis. Praesent iaculis euismod nibh.
                  Orci varius natoque penatibus et magnis dis parturient montes
                </p>
              </div>
            )}
            <div className="flex flex-col justify-start overflow-y-auto rounded-[32px] border-4 border-solid border-celadonBlue bg-backgroundSolidGrey py-6 px-6 pb-3 text-black">
              <div className="elfsight-app-a4711b9a-6add-4fc7-9f4d-c1092a299c74"></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HomePage;
