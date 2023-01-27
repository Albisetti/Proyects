import SimpleLink from '@components/simple-link'
import React from 'react'
import cx from 'classnames'

import styles from './styles.module.scss'

const LinksList = ({ data = {} }) => {
  const { links, linksAlignment, amenitiesStyle } = data
  return (
    <div
      className={cx(
        `flex flex-col`,
        { 'items-end': linksAlignment === 'items-end' },
        { 'items-center': linksAlignment === 'items-center' },
        { 'items-start': linksAlignment === 'items-start' },
        amenitiesStyle && styles.linkItemsContainer
      )}
    >
      {links.map((link, key) => {
        const { url, target, title, arrowLink, menuSlug } = link
        return (
          <div
            key={key}
            className={
              amenitiesStyle ? styles.linkItemAmenities : styles.linkItem
            }
          >
            <SimpleLink
              title={title}
              url={url}
              target={target}
              arrowLink={arrowLink}
              amenitiesStyle={amenitiesStyle}
              menuSlug={menuSlug}
              className={
                'font-tenorSans text-sm text-navyBlue uppercase tracking-[1.6px]'
              }
            />
          </div>
        )
      })}
    </div>
  )
}

export default LinksList
