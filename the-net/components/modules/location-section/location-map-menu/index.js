import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { Wrapper } from '@googlemaps/react-wrapper'

import styles from './styles.module.scss'

import Gallery from '@components/modules/global/gallery'
import mapStyles from './mapStyle'

const Map = ({ style, className, onClick, onIdle, children, ...options }) => {
  const ref = useRef(null)
  const [map, setMap] = useState()

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}))
    }

    if (map) {
      map.setOptions(options)
    }
  }, [ref, map])

  React.useEffect(() => {
    if (map) {
      ;['click', 'idle'].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      )

      if (onClick) {
        map.addListener('click', onClick)
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map))
      }
    }
  }, [map, onClick, onIdle])

  return (
    <>
      <div ref={ref} style={style} className={className} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map })
        }
      })}
    </>
  )
}

const LocationMapMenu = ({
  open,
  mapSettings,
  waterfrontData,
  isWaterfrontMenu = false,
}) => {
  const [waterfrontMenuOpen, setWaterfrontMenuOpen] = useState(isWaterfrontMenu)
  const [galleryVisible, setGalleryVisible] = useState(isWaterfrontMenu)
  const [galleryTransition, setGalleryTransition] = useState(false)
  const [hasTransition, setHasTransition] = useState(false)

  const [mapCenter, setMapCenter] = useState({
    lat: mapSettings?.centerLat || 40,
    lng: mapSettings?.centerLng || 40,
  })
  const [mapZoom, setMapZoom] = useState(mapSettings?.zoomLevel || 16)

  const waterfrontImg = waterfrontData?.slideImages?.length
    ? waterfrontData.slideImages[0].image
    : null
  const waterfrontImages = waterfrontData?.slideImages?.length
    ? waterfrontData.slideImages.map((img) => ({
        image: { url: img.image },
        title: img.imageTitle,
      }))
    : []

  const mapApiKey = process.env.NEXT_PUBLIC_GMAPS_API_KEY

  if (!mapApiKey) {
    console.error('Missing Google Maps api key')
  }

  useEffect(() => {
    setHasTransition(false)
    if (open) {
      setWaterfrontMenuOpen(isWaterfrontMenu)
      setGalleryVisible(isWaterfrontMenu)
    } else {
      setTimeout(() => {
        setWaterfrontMenuOpen(false)
        setGalleryVisible(false)
      }, 1750)
    }
  }, [isWaterfrontMenu, open])

  const setGalleryVisibleFunc = () => {
    setGalleryVisible(waterfrontMenuOpen)
  }

  useEffect(() => {
    if (waterfrontMenuOpen) {
      setTimeout(setGalleryVisibleFunc, window.innerWidth >= 768 ? 1400 : 1000)
    }
  }, [waterfrontMenuOpen])

  useEffect(() => {
    if (galleryVisible) {
      setTimeout(() => setGalleryTransition(true), 100)
    } else {
      setGalleryTransition(false)
    }
  }, [galleryVisible])

  /* Map functions */
  const renderMap = (status) => {
    return <h1>{status}</h1>
  }

  const mapOnIdle = (m) => {
    setMapZoom(m.getZoom())
    setMapCenter(m.getCenter().toJSON())
  }

  const WaterFrontButton = () => (
    <div
      className={cx(styles.waterfrontButtonDiv, 'duration-300 opacity-100', {
        '!opacity-0': waterfrontMenuOpen,
        'transition-opacity': hasTransition,
      })}
      onClick={() => {
        setWaterfrontMenuOpen(!waterfrontMenuOpen)
        setHasTransition(true)
      }}
    >
      <p>WATERFRONT</p>
      <img src="/icons/slider-gallery-arrow-right.svg" alt="->" />
    </div>
  )

  return (
    <div
      className={cx(
        styles.mainContainer,
        open ? 'opacity-100 visible' : 'opacity-0 invisible'
      )}
    >
      <div
        className={cx(
          styles.centererContainer,
          'transition-transform duration-[1.75s]',
          {
            'translate-y-[40px] pointer-events-none': !open,
            'translate-y-0': open,
          }
        )}
      >
        {waterfrontImg && (
          <div
            className={cx(styles.waterfrontImageContainer, {
              [styles.hasTransition]: hasTransition,
              [styles.transitioned]: waterfrontMenuOpen,
              [styles.bottomLeftBoxSize]: waterfrontMenuOpen,
            })}
          >
            <img
              src={waterfrontImg}
              alt=""
              className={styles.waterfrontImage}
            />
            <WaterFrontButton />
          </div>
        )}
        {!galleryVisible ? (
          <div
            className={cx(
              styles.mapContainer,
              styles.bottomLeftBoxSize,
              'opacity-100 visible',
              {
                '!opacity-0 !invisible': waterfrontMenuOpen,
                'transition-all duration-500': hasTransition,
              }
            )}
          >
            {!!mapApiKey && (
              <Wrapper apiKey={mapApiKey} render={renderMap}>
                <Map
                  className={styles.bottomLeftBoxSize}
                  center={mapCenter}
                  onIdle={mapOnIdle}
                  zoom={mapZoom}
                  styles={mapStyles}
                />
              </Wrapper>
            )}
            <h2 className={styles.mapTitle}>MAP &amp; ACCESS</h2>
            <WaterFrontButton />
          </div>
        ) : (
          <div className={styles.waterfrontGalleryParent}>
            {/* Waterfront gallery display */}
            <p
              className={cx(
                styles.waterfrontDescription,
                galleryTransition
                  ? 'visible opacity-100'
                  : 'invisible opacity-0'
              )}
            >
              {waterfrontData?.description}
            </p>
            <div
              className={cx(
                styles.waterfrontGalleryContainer,
                galleryTransition
                  ? 'visible opacity-100'
                  : 'invisible opacity-0'
              )}
            >
              <Gallery
                data={{ images: waterfrontImages }}
                topSpacing={false}
                hasDescription={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationMapMenu
