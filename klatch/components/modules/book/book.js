import StickyNotes from '@components/book/sticky-note'
import CustomImage from '@components/custom-image'
import { imageBuilder } from '@lib/sanity'
import { getFile } from '@sanity/asset-utils'
import { useState } from 'react'
import { client } from 'util/sanity'
import { useWindowSizeAdjustments } from 'util/window-resize'
import PolaroidImage from '../polaroid-image/polaroid-image'
import styles from './book.module.scss'
import QuizCheckBox from './quiz/quiz-checkbox'
import { QuizPages } from './quiz/static'

const Book = ({ data }) => {
  const { windowWidth } = useWindowSizeAdjustments()
  const { pages, template } = data
  const [activePage, setActivePage] = useState(0)
  const MAX_PAGE = template?.type === 'quiz' ? 3 : pages?.length
  const { leftImg, rightImg } = template || {}
  const [quizResponse, setQuizResponse] = useState({})
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizPath, setQuizPath] = useState()
  const [renderingLeft, setRenderingLeft] = useState(true)

  const handleCheckBox = (option, number, isMulti) => {
    if (quizResponse?.[number]?.includes(option.value)) {
      let copy = { ...quizResponse }
      let final = {
        ...copy,
        [number]: [...copy?.[number]?.filter((ele) => ele !== option.value)],
      }
      setQuizResponse(final)
    } else if (isMulti) {
      if (quizResponse?.[number]) {
        let copy = { ...quizResponse }
        setQuizResponse({
          ...copy,
          [number]: [...copy?.[number], option.value],
        })
      } else {
        setQuizResponse({ ...quizResponse, [number]: [option.value] })
      }
    } else {
      if (quizResponse?.[number]) {
        let copy = { ...quizResponse }
        setQuizResponse({ ...copy, [number]: [option.value] })
      } else {
        setQuizResponse({ ...quizResponse, [number]: [option.value] })
      }
    }
  }

  const handlePageUp = (type, page) => {
    if (windowWidth > 1024) {
      if (type === 'question' && page?.number !== 5) {
        if (quizIndex === 0) {
          setQuizPath(quizResponse[quizIndex + 1]?.[0])
          setQuizResponse({ 1: quizResponse[1] })
          setQuizIndex(quizIndex + 1)
        } else {
          setQuizIndex(quizIndex + 1)
        }
      } else if (type === 'question' && page?.number === 5) {
        console.log(quizResponse)
      } else {
        setActivePage(activePage + 1)
      }
    } else {
      if (renderingLeft) {
        setRenderingLeft(false)
      } else {
        if (type === 'question' && page?.number !== 5) {
          if (quizIndex === 0) {
            setQuizPath(quizResponse[quizIndex + 1]?.[0])
            setQuizResponse({ 1: quizResponse[1] })
            setQuizIndex(quizIndex + 1)
          } else {
            setQuizIndex(quizIndex + 1)
          }
          setRenderingLeft(true)
        } else if (type === 'question' && page?.number === 5) {
          console.log(quizResponse)
        } else {
          setActivePage(activePage + 1)
          setRenderingLeft(true)
        }
      }
    }
  }

  const handlePageDown = (type) => {
    if (windowWidth > 1024) {
      if (type === 'question') {
        setQuizIndex(quizIndex - 1)
      } else {
        setActivePage(activePage - 1)
      }
    } else {
      if (renderingLeft) {
        if (type === 'question') {
          setQuizIndex(quizIndex - 1)
        } else {
          setActivePage(activePage - 1)
        }
        setRenderingLeft(false)
      } else {
        setRenderingLeft(true)
      }
    }
  }

  const displayShowMoreOrLess = (showMore, showLess, type, page) => {
    return (
      <>
        {showMore || (page?.number === 5 && quizResponse?.[5]?.length > 0) ? (
          <div
            className={styles.showMore}
            onClick={() => handlePageUp(type, page)}
          >
            <p className={styles.moreText}>
              {' '}
              {page?.number === 5 ? 'Submit' : 'More'}
            </p>
            <img
              className={styles.arrow}
              src="/images/no-to-delete/sticky-notes/arrow.svg"
            />
          </div>
        ) : null}
        {showLess ? (
          <div
            className={styles.showLess}
            onClick={() => handlePageDown(type, page)}
          >
            <img
              className={styles.arrow}
              src="/images/no-to-delete/sticky-notes/arrow.svg"
            />
            <p className={styles.moreText}>Back</p>
          </div>
        ) : null}
      </>
    )
  }

  const renderPageComponents = (page, showMore, showLess) => {
    switch (page?.pageType) {
      case 'sticky':
        return (
          <div className={styles.stickyWrapper} >
            <StickyNotes notes={page?.notes} />
            {displayShowMoreOrLess(showMore, showLess)}
          </div>
        )

      case 'general':
        return (
          <div className={styles.generalBlock} >
            {page?.title ? <p className={styles.title}>{page?.title}</p> : null}
            <p className={styles.content}>{page?.contentBlock}</p>
            {page?.subtitle || page?.contentBlockTwo ? (
              <div className={styles.contentBlockTwoWrapper}>
                <p className={styles.title}>{page?.subtitle}</p>
                <p className={styles.content}>{page?.contentBlockTwo}</p>
              </div>
            ) : null}

            {displayShowMoreOrLess(showMore, showLess)}
          </div>
        )
      case 'polaroid':
        let fileUrl
        if (page?.videoType === 'upload') {
          fileUrl = getFile(page?.polaroidVideo, client)?.asset?.url
        }

        let imageAsset =
          page?.polaroidType === 'video'
            ? page?.videoBackground
            : page?.polaroid
        const assetUrl = imageBuilder.image(imageAsset).url()
        return (
          <div className={styles.generalBlock} >
            {windowWidth > 1024 || page?.title ? (
              <p className={styles.title}>{page?.title}</p>
            ) : null}
            <p className={styles.content}>{page?.contentBlock}</p>
            <PolaroidImage
              isVideo={page?.polaroidType === 'video'}
              videoUrl={page?.videoType === 'upload' ? fileUrl : page?.videoUrl}
              image={assetUrl}
              wrapperClass={styles.leftImageWrapper}
              imageWrapperClass={styles.leftImage}
              imageClass={styles.leftActualImage}
              textClass={styles.leftImageCaption}
            />
            {displayShowMoreOrLess(showMore, showLess)}
          </div>
        )
      case 'title':
        let image = `/images/no-to-delete/book/quiz/coffeeMug.png`
        return (
          <div className={styles.titleBlock} >
            <p className={styles.title}>{page?.title}</p>
            {displayShowMoreOrLess(showMore, showLess)}
            <img src={image} className={styles.coffeeImageLeft} />
            <img src={image} className={styles.coffeeImageRight} />
          </div>
        )
      case 'question':
        let imagePath =
          quizIndex === 0
            ? `/images/no-to-delete/book/quiz/question1.svg`
            : `/images/no-to-delete/book/quiz/path${quizPath}Question${page?.number}.svg`
        return (
          <div className={styles.questionBlock} >
            <img src={imagePath} className={styles.questionImage} />
            <div className={styles.questionWrapper}>
              <p className={styles.question}>Question {page?.number}</p>
              <p className={styles.questionTitle}>{page?.question}</p>
              <div
                className={
                  page?.options?.length > 4
                    ? styles.questionsSmall
                    : styles.questions
                }
              >
                {page?.options?.map((option, index) => {
                  return (
                    <QuizCheckBox
                      key={index}
                      type={option?.value}
                      checked={
                        quizResponse?.[page.number] &&
                        quizResponse?.[page.number]?.includes(option?.value)
                      }
                      index={index}
                      onChange={() =>
                        handleCheckBox(option, page?.number, page?.isMulti)
                      }
                      name={option?.text}
                    />
                  )
                })}
              </div>
            </div>
            {displayShowMoreOrLess(showMore, showLess, 'question', page)}
          </div>
        )
      default:
        return (
          <div className={styles.generalBlock}>
            <p className={styles.title}>Nothing</p>
          </div>
        )
    }
  }

  const renderPages = () => {
    let currentPage
    if (template?.type === 'quiz') {
      currentPage =
        quizIndex === 0
          ? QuizPages?.[0]?.sheets
          : QuizPages?.find(
              (element) =>
                element?.sheets?.index === quizIndex &&
                element.sheets.path === quizPath
            )?.sheets
    } else {
      currentPage = pages?.[activePage]?.sheets
    }
    const mobilePage = renderingLeft
      ? currentPage?.leftPage
      : currentPage?.rightPage

    let leftPage = currentPage?.leftPage
    let rightPage = currentPage?.rightPage
    return windowWidth > 1024 ? (
      <div className={styles.pagesWrapper}>
        {renderPageComponents(
          leftPage,
          false,
          template?.type === 'quiz'
            ? MAX_PAGE > 1 && quizIndex !== 0
            : MAX_PAGE > 1 && activePage !== 0,
        )}
        {renderPageComponents(
          rightPage,
          template?.type === 'quiz'
            ? MAX_PAGE > 1 &&
                quizIndex + 1 !== MAX_PAGE &&
                quizResponse?.[rightPage?.number]?.length > 0
            : MAX_PAGE > 1 && activePage + 1 !== MAX_PAGE,
          false
        )}
      </div>
    ) : template?.type === 'quiz' ? (
      <div className={styles.pagesWrapper}>
        {renderPageComponents(
          mobilePage,
          renderingLeft
            ? rightPage !== undefined
            : template?.type === 'quiz'
            ? MAX_PAGE > 1 &&
              quizIndex + 1 !== MAX_PAGE &&
              quizResponse?.[rightPage?.number]?.length > 0
            : MAX_PAGE > 1 && activePage + 1 !== MAX_PAGE,
          !renderingLeft ||
            (template?.type === 'quiz'
              ? MAX_PAGE > 1 && quizIndex !== 0
              : MAX_PAGE > 1 && activePage !== 0)
        )}
      </div>
    ) : (
      <div className={styles.pagesWrapper}>
        {pages?.map((sheet, index) => {
          console.log(sheet)
          return (
            <div className='flex flex-col' key={index}>
              {renderPageComponents(sheet?.sheets?.leftPage, false, false)}
              {renderPageComponents(sheet?.sheets?.rightPage, false, false)}
            </div>
          )
        })}
      </div>
    )
  }

  const renderImages = () => {
    switch (template?.type) {
      case 'quiz':
        return (
          <>
            <CustomImage
              photo={leftImg?.firstImage}
              className={styles.leftFirstImage}
            />
            <CustomImage
              photo={leftImg?.secondImage}
              className={styles.leftSecondImage}
            />
            <CustomImage
              photo={rightImg?.firstImage}
              className={styles.rightFirstImage}
            />
            <CustomImage
              photo={rightImg?.secondImage}
              className={styles.rightSecondImage}
            />
          </>
        )
      case 'espresso':
        return (
          <>
            <CustomImage
              photo={leftImg?.firstImage}
              className={styles.leftFirstEspressoImage}
            />
            <CustomImage
              photo={leftImg?.secondImage}
              className={styles.leftSecondImage}
            />
            <CustomImage
              photo={rightImg?.firstImage}
              className={styles.rightFirstEspressoImage}
            />
            <CustomImage
              photo={rightImg?.secondImage}
              className={styles.rightSecondImage}
            />
          </>
        )
      case 'singleBeans':
        return (
          <>
            <CustomImage
              photo={leftImg?.firstImage}
              className={styles.leftFirstSingleImage}
            />
            <CustomImage
              photo={leftImg?.secondImage}
              className={styles.leftSecondSingleImage}
            />
            <CustomImage
              photo={rightImg?.firstImage}
              className={styles.rightFirstSingleImage}
            />
            <CustomImage
              photo={rightImg?.secondImage}
              className={styles.rightSecondSingleImage}
            />
          </>
        )
      case 'beansBlend':
        return (
          <>
            <CustomImage
              photo={leftImg?.firstImage}
              className={styles.leftFirstBlendImage}
            />
            <CustomImage
              photo={leftImg?.secondImage}
              className={styles.leftSecondBlendImage}
            />
            <CustomImage
              photo={rightImg?.firstImage}
              className={styles.rightFirstBlendImage}
            />
            <CustomImage
              photo={rightImg?.secondImage}
              className={styles.rightSecondBlendImage}
            />
          </>
        )
      default:
        return (
          <>
            <CustomImage
              photo={leftImg?.firstImage}
              className={styles.leftFirstImage}
            />
            <CustomImage
              photo={leftImg?.secondImage}
              className={styles.leftSecondImage}
            />
            <CustomImage
              photo={rightImg?.firstImage}
              className={styles.rightFirstImage}
            />
            <CustomImage
              photo={rightImg?.secondImage}
              className={styles.rightSecondImage}
            />
          </>
        )
    }
  }

  return (
    <div className={styles.componentWrapper}>
      <div className={styles.bookWrapper}>{renderPages()}</div>
      {renderImages()}
    </div>
  )
}

export default Book
