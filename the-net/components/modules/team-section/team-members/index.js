import React, { useEffect, useState } from 'react'
import BlockContent from '@components/block-content'

import styles from './styles.module.scss'

const TeamMembers = ({ data = {} }) => {
  const { slides } = data

  const [changeSlide, setChangeSlide] = useState(slides[0])
  const [activeSlide, setActiveSlide] = useState(slides[0])
  const [changeTimeout, setChangeTimeout] = useState(null)

  useEffect(() => {
    const slideContent = document.getElementById('slideContent')
    slideContent?.style.opacity = 0
    if (window.innerWidth >= 768) slideContent?.style.transform = "translateY(10px)"

    if (changeTimeout) clearTimeout(changeTimeout)
    setChangeTimeout(setTimeout(() => {
      slideContent?.scrollTop = 0
      slideContent?.style.opacity = 100
      slideContent?.style.transform = ""
      setActiveSlide(changeSlide)
    }, 700));
    
  }, [changeSlide])

  return (
    <div className={styles.teamMembersContainer}>
      <div className={styles.tabsContainer}>
        {slides.map((slide, key) => (
          <div
            key={key}
            className={` flex items-center justify-center cursor-pointer transition-all duration-700 ${
              slide === changeSlide ? 'bg-white/30' : 'bg-transparent'
            } ${styles.imageContainer}`}
            onClick={() => setChangeSlide(slide)}
          >
            <img src={slide.tabImage} alt="" />
          </div>
        ))}
      </div>
      <div className={`bg-white/30 ${styles.slideContainer}`}>
        <div id="slideContent" className={styles.slideContent}>
          {activeSlide.member.photo && (
            <div>
              <img
                className={styles.memberPhoto}
                src={activeSlide.member.photo}
                alt=""
              />
              <h3 className={styles.memberName}>{activeSlide.member.name}</h3>
            </div>
          )}
          <div className={styles.slideTextContent}>
            {!activeSlide.member.photo && (
              <h3 className={styles.memberName}>{activeSlide.member.name}</h3>
            )}

            <BlockContent
              blocks={activeSlide.member.description}
              className={styles.blockContent}
            />
            {activeSlide.member.contactInfo && (
              <div className={styles.contactContainer}>
                {activeSlide.member.contactInfo.map((contactItem, key) => (
                  <div key={key} className={styles.contactContent}>
                    <img
                      src={`/icons/${
                        contactItem.contactType === 'email'
                          ? 'mail-navyBlue.svg'
                          : contactItem.contactType === 'phone'
                          ? 'phone-navyBlue.svg'
                          : 'computer-navyBlue.svg'
                      }`}
                    />
                    <a
                      href={`${
                        contactItem.contactType === 'email'
                          ? 'mailto:'
                          : contactItem.contactType === 'phone'
                          ? 'tel:'
                          : ''
                      }${contactItem.contact}`}
                      rel="noopener noreferrer"
                      target='_blank'
                    >
                      {contactItem.contact}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamMembers
