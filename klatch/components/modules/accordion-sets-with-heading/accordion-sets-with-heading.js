import cx from 'classnames'

import BlockContent from '@components/block-content'

import styles from './accordion-sets-with-heading.module.scss'

function AccordionSetsWithHeading({ data = {} }) {
  const { heading, accordionSet } = data

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        {heading && <h2 className={cx('h1', styles.heading)}>{heading}</h2>}
        <div className={styles.accordionListWrapper}>
          {accordionSet?.map((list, index) => (
            <div key={index}>
              {list?.title && (
                <h3 className={styles.listTitle}>{list?.title}</h3>
              )}
              {list?.accordions?.map((accordion, index) => (
                <details className={styles.accordionWrapper} key={index}>
                  <summary className={styles.accordionTitle}>
                    {accordion.title}
                  </summary>
                  <BlockContent
                    className={styles.accordionContent}
                    blocks={accordion.content}
                  />
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
      <img
        src="/images/no-to-delete/tasting-and-training/coffee-beans-group.png"
        className={styles.coffeeBeans}
      />
    </section>
  )
}

export default AccordionSetsWithHeading
