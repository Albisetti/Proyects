import { useWindowSizeAdjustments } from 'util/window-resize'

import CtaModule from '../cta/cta-module'
import PolaroidImage from '../polaroid-image/polaroid-image'

import styles from './two-col-cta-with-rich-text.module.scss'

const TwoColCtaWithRichText = ({ data = {} }) => {
  const { title, titleSize, subtitle, subTitleSize, cta, direction, image } =
    data

  const { windowWidth } = useWindowSizeAdjustments()

  const imagesSection = () => {
    return (
      <div className={styles.polaroidWrapper}>
        <PolaroidImage
          image={image}
          wrapperClass={styles.leftImageWrapper}
          imageWrapperClass={styles.leftImage}
          imageClass={styles.leftActualImage}
          textClass={styles.leftImageCaption}
        />
      </div>
    )
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
              usesRichText
            />
          </div>
          {windowWidth >= 1024 ? imagesSection() : null}
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
              usesRichText
            />
          </div>
        </>
      )}
    </div>
  )
}

export default TwoColCtaWithRichText
