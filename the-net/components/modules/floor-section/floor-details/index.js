import { MenuContext } from '@context/menuContext'
import React, { Fragment, useContext, useEffect, useState } from 'react'

import styles from './styles.module.scss'

import cx from 'classnames'

const getFloorPositionY = (pos) => ((pos / 530) * 100).toFixed(2)

const FloorDetails = ({ data = {} }) => {
  const [selectedFloor, setSelectedFloor] = useState({
    index: 0,
    data: data.floorsList[0],
  })

  const [floorChange, setFloorChange] = useState({
    index: 0,
    data: data.floorsList[0],
  })

  useEffect(() => {
    const buildingRightSection = document.getElementById('buildingRightSection')
    if (buildingRightSection) {
      buildingRightSection.style.opacity = 0
      setTimeout(() => (buildingRightSection.style.opacity = 100), 1000)
      setTimeout(() => setSelectedFloor(floorChange), 1000)
    }
  }, [floorChange])

  const [buildingFloorList, setBuildingFloorList] = useState(undefined)

  useEffect(() => {
    setBuildingFloorList(data.floorsList.reverse())
  }, [])

  const { menuOpen } = useContext(MenuContext)
  useEffect(() => {
    if (menuOpen?.includes('floor-menu')) {
      const floorIndex = data.floorsList.findIndex(
        (floor) => floor.floorName === menuOpen.split('/')[1]
      )
      setSelectedFloor({ index: floorIndex, data: data.floorsList[floorIndex] })
    }
  }, [menuOpen])

  const nextFloor = () => {
    if (selectedFloor.index - 1 < 0) {
      setFloorChange({
        index: data.floorsList.length - 1,
        data: data.floorsList[data.floorsList.length - 1],
      })
    } else {
      setFloorChange({
        index: selectedFloor.index - 1,
        data: data.floorsList[selectedFloor.index - 1],
      })
    }
  }

  const goToFloor = (floor, index) => {
    setFloorChange({
      index: index,
      data: floor,
    })
  }
  return (
    <div
      className={cx(
        'fixed top-0 transition-all overflow-x-hidden duration-[1.75s] opacity-0 invisible pointer-events-none',
        {
          '!opacity-100 !visible !pointer-events-auto':
            menuOpen?.includes('floor-menu'),
        }
      )}
    >
      <div className="h-[100vh] w-[100vw] bg-white flex items-center">
        <div className={styles.leftSection}>
          <div
            className={cx(
              styles.content,
              'transition-transform duration-[1.75s] translate-y-[40px]',
              { '!translate-y-0': menuOpen?.includes('floor-menu') }
            )}
          >
            <img src="/images/floors-building.png" />
            <div className={styles.buildingFloors}>
              {buildingFloorList?.map((floor, key) => (
                <span key={key} onClick={() => goToFloor(floor, key)}>
                  <div
                    className={cx(
                      styles.line,
                      selectedFloor.index === key ? 'bg-gold' : 'bg-copy'
                    )}
                    style={{
                      bottom: `${getFloorPositionY(floor.lowestFloorHeight)}%`,
                    }}
                  />
                  <p
                    className={
                      selectedFloor.index === key ? 'text-gold' : 'text-copy'
                    }
                    style={{
                      bottom: `${
                        floor?.highestFloorHeight
                          ? getFloorPositionY(
                              (floor.highestFloorHeight -
                                floor.lowestFloorHeight) /
                                2 +
                                floor.lowestFloorHeight
                            )
                          : getFloorPositionY(floor.lowestFloorHeight)
                      }%`,
                    }}
                  >
                    {floor.floorName}
                  </p>
                  {floor?.highestFloorHeight && (
                    <div
                      className={cx(
                        styles.line,
                        selectedFloor.index === key ? 'bg-gold' : 'bg-copy'
                      )}
                      style={{
                        bottom: `${getFloorPositionY(
                          floor.highestFloorHeight
                        )}%`,
                      }}
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div id="buildingRightSection" className={styles.rightSection}>
          <div
            className={cx(
              styles.content,
              'transition-transform duration-[1.75s] translate-y-[40px]',
              { '!translate-y-0': menuOpen?.includes('floor-menu') }
            )}
          >
            <img
              className={styles.floorPlans}
              src={selectedFloor.data.floorPlansImage}
            />
            <div className={styles.bottomDescription}>
              <h2>{selectedFloor.data.floorName}</h2>
              <ul>
                {selectedFloor.data.floorProperties.map((property, key) => (
                  <li key={key}>
                    <p>{property}</p>
                  </li>
                ))}
              </ul>
              <div className={styles.bottomSelections}>
                <div className={styles.leftSelections}>
                  <button className={styles.panoramicButton}>
                    <svg
                      width="45"
                      height="31"
                      viewBox="0 0 45 31"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.0591 21.7524L18.0308 21.6998H17.971H17H16.8324L16.912 21.8473C17.828 23.5453 19.0652 25.0561 20.5571 26.2993C19.0666 27.5405 17.8338 29.0526 16.9268 30.7527L16.8483 30.8998H17.015H17.971H18.0302L18.0586 30.848C19.0294 29.0812 20.3968 27.5538 22.0577 26.381L22.1745 26.2985L22.0569 26.2171C20.384 25.0586 19.0142 23.5287 18.0591 21.7524Z"
                        fill="#DFC087"
                        stroke="#4B546D"
                        strokeWidth="0.2"
                      />
                      <path
                        d="M11.328 10.944C12.848 10.944 13.504 12.208 13.504 13.344C13.504 14.432 12.896 15.472 11.568 15.472C10.544 15.472 9.456 14.848 8.848 13.456V15.152C9.52 15.792 10.64 16.16 11.664 16.16C13.408 16.16 15.024 15.264 15.024 13.36C15.024 11.904 14.08 10.912 12.688 10.656V10.624C13.968 10.352 14.816 9.36 14.816 7.984C14.816 6.16 13.36 5.28 11.728 5.28C10.752 5.28 9.712 5.616 8.896 6.304V8C9.504 6.784 10.416 5.968 11.536 5.968C12.768 5.968 13.36 6.96 13.36 8.048C13.36 9.104 12.768 10.352 11.296 10.352H10.768V10.944H11.328ZM22.5169 5.968C23.1249 5.968 23.7009 6.128 24.4849 6.944V5.584C23.8129 5.376 23.2689 5.28 22.6289 5.28C19.8449 5.28 18.0849 7.408 18.0849 10.784C18.0849 14.112 19.5569 16.16 22.0689 16.16C24.0369 16.16 25.4609 14.704 25.4609 12.688C25.4609 10.768 24.1329 9.328 22.3089 9.328C21.1409 9.328 20.1169 9.936 19.6209 10.88H19.6049C19.6049 7.952 20.7729 5.968 22.5169 5.968ZM19.9729 12.752C19.9729 11.232 20.8369 10.128 22.0529 10.128C23.2689 10.128 24.1009 11.216 24.1009 12.688C24.1009 14.272 23.2369 15.456 22.0209 15.456C20.8209 15.456 19.9729 14.32 19.9729 12.752ZM31.7343 5.28C29.4943 5.28 28.2783 7.36 28.2783 10.72C28.2783 14.08 29.4943 16.16 31.7343 16.16C33.9903 16.16 35.1903 14.08 35.1903 10.72C35.1903 7.36 33.9903 5.28 31.7343 5.28ZM31.7343 5.968C33.0783 5.968 33.6703 7.792 33.6703 10.72C33.6703 13.536 33.0783 15.456 31.7343 15.456C30.4063 15.456 29.8143 13.536 29.8143 10.72C29.8143 7.792 30.4063 5.968 31.7343 5.968ZM38.1602 7.328C38.1602 8.48 39.0562 9.36 40.2722 9.36C41.4882 9.36 42.4002 8.48 42.4002 7.328C42.4002 6.16 41.4882 5.28 40.2722 5.28C39.0562 5.28 38.1602 6.144 38.1602 7.328ZM39.1362 7.296C39.1362 6.624 39.6322 6.128 40.2882 6.128C40.9442 6.128 41.4402 6.624 41.4402 7.296C41.4402 7.968 40.9442 8.48 40.2882 8.48C39.6322 8.48 39.1362 7.968 39.1362 7.296Z"
                        fill="#DFC087"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M37.5709 13.0646C37.7106 12.7157 37.8339 12.3607 37.9402 12C42.287 13.5852 45 15.8321 45 18.3239C45 22.6695 36.7487 26.2704 25.9696 26.9151C25.9896 26.7956 26 26.6731 26 26.5484C26 26.294 25.9569 26.0491 25.8771 25.8197C30.5693 25.5389 34.7268 24.6842 37.8561 23.4751C41.8282 21.9403 43.6829 20.0405 43.6829 18.3239C43.6829 16.6073 41.8282 14.7075 37.8561 13.1727C37.762 13.1364 37.6669 13.1003 37.5709 13.0646ZM21.0959 25.9026C15.5984 25.7682 10.7053 24.8512 7.14388 23.4751C3.17184 21.9403 1.31707 20.0405 1.31707 18.3239C1.31707 16.7047 2.96729 14.9226 6.48802 13.4375C6.33583 13.0911 6.19991 12.7383 6.08101 12.3795C2.30952 13.9342 0 16.0248 0 18.3239C0 22.9367 9.29735 26.7105 21.0463 27C21.0159 26.8539 21 26.7029 21 26.5484C21 26.3244 21.0334 26.1077 21.0959 25.9026Z"
                        fill="#DFC087"
                      />
                    </svg>
                    <p>View Space</p>
                  </button>
                  {selectedFloor.data.floorPlansPDF && (
                    <a
                      className={styles.downloadButton}
                      href={selectedFloor.data.floorPlansPDF}
                      download
                      target="blank"
                    >
                      <img src="/icons/document-navyBlue.svg" alt="" />
                      <p>Floor Plans PDF</p>
                    </a>
                  )}
                </div>
                <div className={styles.simpleLinkContainer}>
                  <span onClick={() => nextFloor()}>
                    <div className="flex flex-col">
                      <a className={styles.simpleLinkText}>
                        <p>
                          {selectedFloor.index - 1 < 0
                            ? data.floorsList[data.floorsList.length - 1]
                                .floorName
                            : data.floorsList[selectedFloor.index - 1]
                                ?.floorName}
                        </p>
                      </a>

                      <img
                        src="/icons/long-arrow-navyBlue.svg"
                        alt=""
                        className={styles.simpleLinkArrow}
                      />
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FloorDetails
