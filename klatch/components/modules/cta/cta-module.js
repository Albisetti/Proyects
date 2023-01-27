import { useWindowSizeAdjustments } from 'util/window-resize'

import BlockContent from '@components/block-content'
import CustomLink from '@components/common/custom-link'

import styles from './cta-module.module.scss'

const CtaModule = (props) => {
  const { windowWidth } = useWindowSizeAdjustments()

  const titleSizeHandler = () => {
    switch (props.titleSize) {
      case 'h1':
        return styles.mainContentTitleMarginH1 + ' h1'
      case 'h2':
        return styles.mainContentTitleMarginH2 + ' h2'
      default:
        break
    }
  }

  const subTitleSizeWrapper = () => {
    switch (props.subTitleSize) {
      case 'large':
        return 'pAlt'
      case 'regular':
        return 'p'
      default:
        break
    }
  }

  return (
    <>
      <div className={styles.mainContentWrapper}>
        <p className={titleSizeHandler()}>{props.title}</p>
        {windowWidth < 1024
          ? props?.imageComponent
            ? props.imageComponent()
            : null
          : null}
        {props.subtitle ? (
          <div className={`${styles.subtitleWrapper} `}>
            {props.usesRichText ? (
              <BlockContent
                className={styles.subTitleText + ` ${subTitleSizeWrapper()}`}
                blocks={props.subtitle}
              />
            ) : (
              <p className={styles.subTitleText + ` ${subTitleSizeWrapper()}`}>
                {props.subtitle}
              </p>
            )}
          </div>
        ) : null}
        <CustomLink
          title={props.cta.title}
          href={
            props?.cta?.ctaType === 'external'
              ? props?.cta?.hrefExternal
              : props?.cta?.hrefInternal
          }
          color={props.cta.color}
          target={props.cta.target}
        />
      </div>
    </>
  )
}

export default CtaModule
