import React, { useState } from 'react'
import cx from 'classnames'

import CustomImage from '@components/custom-image'
import styles from './our-story-more-info.module.scss'
import CustomLink from '@components/common/custom-link'

const OurStoryMoreInfo = ({ data = {} }) => {
  const { title, links, rightBGImage } = data

  const [selectedLink, setSelectedLink] = useState(0)

  return (
    <div className={styles.sectionContainer}>
      {!!rightBGImage?.url && (
        <CustomImage photo={rightBGImage} className={styles.rightBGImage} />
      )}

      <h1 className={styles.mainTitle}>{title}</h1>

      <div className={styles.subSection}>
        <div className={styles.linksContainer}>
          {links.map((link, idx) => (
            <div
              key={idx}
              className={cx(styles.linkBlock, {
                [styles.active]: idx === selectedLink,
              })}
              onClick={() => setSelectedLink(idx)}
            >
              <p className={styles.title}>{link.buttonTitle}</p>
            </div>
          ))}
        </div>
        {links.length >= selectedLink && !!links[selectedLink] && (
          <div className={styles.linkContentContainer}>
            <p className={styles.description}>
              {links[selectedLink].linkDescription}
            </p>
            {!!links[selectedLink].linkTarget && (
              <CustomLink
                title="Read More"
                href={links[selectedLink].linkTarget}
              />
            )}
          </div>
        )}
      </div>

      <div className={styles.subSectionMobile}>
        {links
          .filter((l) => !!l.linkTarget)
          .map((link, idx) => (
            <CustomLink
              key={link}
              title={link.buttonTitle}
              href={link.linkTarget}
            />
          ))}
      </div>
    </div>
  )
}

export default OurStoryMoreInfo
