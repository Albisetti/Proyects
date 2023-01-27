import CustomImage from '@components/custom-image'
import React from 'react'
import { useWindowSizeAdjustments } from 'util/window-resize'
import CtaModule from '../cta/cta-module'
import PolaroidImage from '../polaroid-image/polaroid-image'
import styles from './two-col-cta.module.scss'

const TwoColCTA = ({ data = {} }) => {
  const {
    title,
    titleSize,
    subtitle,
    subTitleSize,
    cta,
    collageType,
    assetsAnimal,
    assetsCoffee,
    assetsPeople,
    direction,
  } = data

  const {windowWidth} = useWindowSizeAdjustments()

  const imagesSection = () => {
    switch (collageType) {
      case 'productAnimal':
        return (
          <div className={styles.productAnimalWrapper}>
            <div className={styles.imagesWrapper}>
              <div className={styles.firstImageShadow}>
                <div className={styles.firstImageWrapper}>
                  <CustomImage
                    photo={assetsAnimal.firstImg}
                    alt=""
                    className={styles.productAnimalfirstImage}
                  />
                </div>
              </div>
              <CustomImage
                photo={assetsAnimal.secondImg}
                alt=""
                className={styles.productAnimalsecondImage}
              />
              <CustomImage
                photo={assetsAnimal.thirdImg}
                alt=""
                className={styles.productAnimalthirdImage}
              />
              <CustomImage
                photo={assetsAnimal.fourthImg}
                alt=""
                className={styles.productAnimalfourthImage}
              />
              <p className={styles.annotation}>{assetsAnimal.annotation}</p>
            </div>
          </div>
        )
      case 'productCoffee':
        return (
          <div className={styles.productAnimalWrapper}>
            <PolaroidImage
              image={assetsCoffee.thirdImg}
              wrapperClass={styles.leftImageWrapper}
              imageWrapperClass={styles.leftImage}
              imageClass={styles.leftActualImage}
              textClass={styles.leftImageCaption}
            />
            <div className={styles.productCoffeeImagesWrapper}>
              <CustomImage
                photo={assetsCoffee.secondImg}
                alt=""
                className={styles.productCoffeesecondImage}
              />
              <CustomImage
                photo={assetsCoffee.firstImg}
                alt=""
                className={styles.productCoffeethirdImage}
              />
              <CustomImage
                photo={assetsCoffee.fourthImg}
                alt=""
                className={styles.productCoffeefourthImage}
              />
            </div>
          </div>
        )
      case 'productPeople':
        return (
          <div className={styles.productPeopleWrapper}>
            <PolaroidImage
              image={assetsPeople.firstImg}
              wrapperClass={styles.productPeopleLeftImageWrapper}
              imageWrapperClass={styles.productPeopleLeftImage}
              imageClass={styles.productPeopleLeftActualImage}
              textClass={styles.productPeopleLeftImageCaption}
            />
            <PolaroidImage
              image={assetsPeople.secondImg}
              wrapperClass={styles.productPeopleRightImageWrapper}
              imageWrapperClass={styles.productPeopleRightImage}
              imageClass={styles.productPeopleRightActualImage}
              textClass={styles.productPeopleRightImageCaption}
            />
            <div className={styles.productPeopleImagesWrapper}>
              <CustomImage
                photo={assetsPeople.thirdImg}
                alt=""
                className={styles.productPeopleSecondImage}
              />
            </div>
          </div>
        )
      default:
        break
    }
  }

  return (
    <div
      className={
        direction === 'leftToRight'
          ? styles.twoColWrapper
          : styles.twoColReverseWrapper
      }
    >
      {direction === 'leftToRight' ? (
        <>
          <div className={styles.ctaWrapper}>
            <CtaModule
              title={title}
              className="w-full"
              subtitle={subtitle}
              subTitleSize={subTitleSize}
              cta={cta}
              titleSize={titleSize}
              imageComponent={() => imagesSection()}
            />
          </div>
          {windowWidth >= 1024 ?
          imagesSection()
          : 
          null }
        </>
      ) : (
        <>
          {imagesSection()}
          <div className={styles.ctaWrapper}>
            <CtaModule
              title={title}
              subtitle={subtitle}
              cta={cta}
              subTitleSize={subTitleSize}
              titleSize={titleSize}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default TwoColCTA
