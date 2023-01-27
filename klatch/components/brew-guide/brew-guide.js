import BlockContent from '@components/block-content'
import CustomLink from '@components/common/custom-link'
import PolaroidImage from '@components/modules/polaroid-image/polaroid-image'

import styles from './brew-guide.module.scss'
import ProjectorVideo from '@components/modules/projector-video/projector-video'

function BrewGuide({ brewGuide }) {
  const {
    name,
    image,
    imageCaption,
    pdfText,
    pdfURL,
    videoURL,
    videoPreviewImage,
    details,
    steps,
  } = brewGuide

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.heroWrapper}>
          <div>
            <h1 className={styles.ctaTitle}>{`Brew Guides: ${name}`}</h1>
            {pdfText && pdfURL && (
              <CustomLink
                buttonWrapper={styles.ctaButton}
                title={pdfText}
                href={pdfURL}
                color="orange"
                target="_blank"
              />
            )}
          </div>
          <div className={styles.polaroidWrapper}>
            <PolaroidImage
              image={image}
              text={imageCaption}
              wrapperClass={styles.imageWrapper}
              imageWrapperClass={styles.image}
              imageClass={styles.actualImage}
              textClass={styles.imageCaption}
            />
          </div>
          {pdfText && pdfURL && (
            <div className={styles.ctaButtonMobileWrapper}>
              <CustomLink
                buttonWrapper={styles.ctaButtonMobile}
                title={pdfText}
                href={pdfURL}
                color="orange"
                target="_blank"
              />
            </div>
          )}
        </div>
        <img
          className={styles.coffeeGrounds}
          src="/images/no-to-delete/brew-guides/coffee-grounds.jpg"
        />
      </section>

      {videoURL && (
        <section className={styles.wrapper}>
          <div className={styles.projectorWrapper}>
            <ProjectorVideo data={{ videoURL, videoPreviewImage }} />
          </div>
        </section>
      )}

      <section className={styles.wrapper}>
        <div className={styles.summaryWrapper}>
          <div className={styles.detailsWrapper}>
            <ul className="list-none pl-0">
              {details?.map((pair, index) => (
                <li key={index}>
                  {pair.key && <span>{`${pair?.key}:`}</span>}{' '}
                  {pair.value && <span>{pair?.value}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.stepsWrapper}>
            {steps && <BlockContent blocks={steps} />}
          </div>
        </div>
        <img
          className={styles.cherriesOne}
          src="/images/no-to-delete/brew-guides/cherries-1.png"
        />
        <img
          className={styles.cherriesTwo}
          src="/images/no-to-delete/brew-guides/cherries-2.png"
        />
      </section>
    </>
  )
}

export default BrewGuide
