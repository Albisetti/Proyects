import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'

const totalAnimationSteps = 25
const lineRevealStep = 20
const firstTitleStep = 5
const secondTitleStep = 9
const thirdTitleStep = 13

const GridTitle = (bgCol, title, animStep, animTrigger) => (
  <div
    className={cx(
      'relative w-full py-[27px] flex justify-center items-center mb-[50px]',
      'transition-all duration-1000 translate-y-[120px] opacity-0',
      { '!opacity-100 !translate-y-0': animStep >= animTrigger }
    )}
    style={{ backgroundColor: bgCol }}
  >
    <div
      className="absolute min-w-[24px] min-h-[24px] w-[1.7vw] h-[1.7vw] left-[50%] translate-x-[-50%] rotate-45 bottom-[-5px] z-0"
      style={{ backgroundColor: bgCol }}
    />
    <p className="font-almarose font-bold text-[24px] sm:text-[22.26px] leading-[15.77px] text-white z-[1]">
      {title}
    </p>
  </div>
)

const GridNode = (key, bgCol, icon, title, shorterMaxWidth, animStep) => (
  <div
    key={key}
    className={cx(
      'rounded-full min-w-[265px] sm:min-w-[unset] w-[50vw] sm:w-[208px] min-h-[265px] sm:min-h-[unset] h-[50vw] sm:h-[208px] flex flex-col justify-center items-center',
      'transition-opacity duration-[1.5s] opacity-0',
      { '!opacity-100': animStep >= 17 }
    )}
    style={{ backgroundColor: bgCol }}
  >
    <div className="w-[60px] h-[60px] flex justify-center items-center mb-[24px] sm:mb-[14px]">
      <img src={icon} className="max-w-full max-h-full object-contain" />
    </div>
    <p
      className={cx(
        'font-almarose text-white font-bold text-[18px] sm:text-[15.88px] leading-[20px] max-w-[160px] text-center',
        { '!max-w-[80px]': shorterMaxWidth }
      )}
    >
      {title}
    </p>
  </div>
)

const ConnectorLine = ({ className, lineClassName, animStep, slower }) => (
  <div
    className={cx(
      'absolute overflow-hidden transition-all duration-1000 ease-linear rounded-[5px]',
      className,
      {
        '!h-0 !w-0': animStep < lineRevealStep,
        '!duration-[2s]': slower,
      }
    )}
  >
    <div
      className={cx(lineClassName, 'relative border-lightBlue border-dotted', {
        'border-r-[4px]': lineClassName.includes('w-0'),
        'border-t-[4px]': lineClassName.includes('h-0'),
      })}
    />
  </div>
)

const ConnectedNodesGrid = ({ data = {} }) => {
  const { bgColor, contentGrid, title } = data
  const { firstColumn, secondColumn, thirdColumn } = contentGrid

  const containerRef = useRef(null)

  const [scrollPos, setScrollPos] = useState(0)
  const [animationStep, setAnimationStep] = useState(0)
  const [animationStarted, setAnimationStarted] = useState(false)

  const updateScroll = () => setScrollPos(window.scrollY)

  useEffect(() => {
    window.addEventListener('scroll', updateScroll)
    return () => {
      window.removeEventListener('scroll', updateScroll)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    if (
      scrollPos + window.innerHeight / 2 >= containerRef.current.offsetTop &&
      !animationStarted
    ) {
      setAnimationStarted(true)

      let step = 0
      const animationFunc = setInterval(() => {
        setAnimationStep(step++)
        if (step >= totalAnimationSteps) clearInterval(animationFunc)
      }, 200)
    }
  }, [containerRef.current, scrollPos, animationStarted])

  return (
    <div
      className="relative w-full pt-[55px] sm:pb-[75px]"
      style={{
        background: `linear-gradient(180deg, ${bgColor.hex} 0%, white 100%)`,
      }}
      ref={containerRef}
    >
      <div
        className="absolute w-[22px] h-[22px] left-[50%] translate-x-[-50%] top-[-11px] bg-white rotate-45"
        style={{
          background: 'linear-gradient(315deg, white 50%, transparent 50%)',
        }}
      />

      <div className="container-x">
        <h2
          className={cx(
            'w-full text-center font-sentinel font-medium text-[31.75px] leading-[38.1px] text-deepBlueDark !mb-[55px]',
            'transition-all duration-1000 translate-y-[-35px] opacity-0',
            { '!opacity-100 !translate-y-0': animationStep >= 2 }
          )}
        >
          {title} <span className="text-lightBlue">=</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-[18px] md:w-[850px] lg:w-[936px] mx-auto">
          {/* First column */}
          <div className="relative col-span-1 flex flex-col items-center pb-[40px] sm:pb-0">
            {GridTitle(
              firstColumn.color?.hex,
              firstColumn.title,
              animationStep,
              firstTitleStep
            )}

            <div className="relative flex flex-col justify-center items-center sm:min-h-[737px] gap-x-[40px] gap-y-[30px] sm:gap-y-[92px] z-[1]">
              {firstColumn.nodes.map((node, idx) =>
                GridNode(
                  idx,
                  firstColumn.color?.hex,
                  node.icon,
                  node.title,
                  false,
                  animationStep
                )
              )}
            </div>

            {/* Connectors */}
            <div className="absolute w-full h-[calc(100%-137px)] top-[137px] z-0 hidden sm:block">
              <ConnectorLine
                key="conn_line1"
                className="h-[220px] top-[-52px] left-[50%] translate-x-[-50%]"
                lineClassName="w-0 h-[220px]"
                slower
                animStep={animationStep}
              />

              <ConnectorLine
                key="conn_line2"
                className="w-[165px] top-[50%] left-[50%] translate-x-[-50%] rotate-90"
                lineClassName="h-0 w-[165px]"
                animStep={animationStep}
              />

              <ConnectorLine
                key="conn_line3"
                className="w-[200px] top-[19%] right-0 translate-x-[50%] rotate-[-26deg]"
                lineClassName="h-0 w-[200px]"
                animStep={animationStep}
              />

              <ConnectorLine
                key="conn_line4"
                className="w-[200px] top-[38%] right-0 translate-x-[50%] rotate-[26deg]"
                lineClassName="h-0 w-[200px]"
                animStep={animationStep}
              />

              <ConnectorLine
                key="conn_line5"
                className="w-[200px] top-[60%] right-0 translate-x-[50%] rotate-[-26deg]"
                lineClassName="h-0 w-[200px]"
                animStep={animationStep}
              />
              <ConnectorLine
                key="conn_line6"
                className="w-[200px] top-[79%] right-0 translate-x-[50%] rotate-[26deg]"
                lineClassName="h-0 w-[200px]"
                animStep={animationStep}
              />
            </div>
          </div>

          {/* Second column */}
          <div className="relative col-span-1 flex flex-col items-center pb-[40px] sm:pb-0">
            {GridTitle(
              secondColumn.color?.hex,
              secondColumn.title,
              animationStep,
              secondTitleStep
            )}

            <div className="flex flex-col justify-center items-center sm:min-h-[737px] gap-x-[40px] gap-y-[30px] sm:gap-y-[55px] z-[1]">
              {secondColumn.nodes.map((node, idx) =>
                GridNode(
                  idx,
                  secondColumn.color?.hex,
                  node.icon,
                  node.title,
                  false,
                  animationStep
                )
              )}
            </div>

            {/* Connectors */}
            <div className="absolute w-full h-[calc(100%-137px)] top-[137px] z-0 hidden sm:block">
              <ConnectorLine
                key="conn_line7"
                className="h-[50px] top-[-52px] left-[50%] translate-x-[-50%]"
                lineClassName="h-[50px] w-0"
                slower
                animStep={animationStep}
              />

              <ConnectorLine
                key="conn_line8"
                className="w-[90px] top-[30.5%] left-[50%] translate-x-[-50%] rotate-90"
                lineClassName="h-0 w-[200px]"
                animStep={animationStep}
              />
              <ConnectorLine
                key="conn_line9"
                className="w-[90px] top-[66%] left-[50%] translate-x-[-50%] rotate-90"
                lineClassName="h-0 w-[200px]"
                animStep={animationStep}
              />

              <ConnectorLine
                key="conn_line10"
                className="w-[200px] top-[18%] right-0 translate-x-[50%] rotate-[26deg]"
                lineClassName="h-0 w-[200px]"
                animStep={animationStep}
              />

              <ConnectorLine
                key="conn_line11"
                className="w-[200px] top-[39%] right-0 translate-x-[50%] rotate-[-26deg]"
                lineClassName="h-0 w-[200px]"
                animStep={animationStep}
              />
              <ConnectorLine
                key="conn_line12"
                className="w-[200px] top-[59%] right-0 translate-x-[50%] rotate-[26deg]"
                lineClassName="h-0 w-[200px]"
                animStep={animationStep}
              />

              <ConnectorLine
                key="conn_line13"
                className="w-[200px] top-[80%] right-0 translate-x-[50%] rotate-[-26deg]"
                lineClassName="h-0 w-[200px]"
                animStep={animationStep}
              />
            </div>
          </div>

          {/* Third column */}
          <div className="relative col-span-1 flex flex-col items-center pb-[40px] sm:pb-0">
            {GridTitle(
              thirdColumn.color?.hex,
              thirdColumn.title,
              animationStep,
              thirdTitleStep
            )}

            <div className="flex flex-col justify-center items-center sm:min-h-[737px] gap-x-[40px] gap-y-[30px] sm:gap-y-[92px] z-[1]">
              {thirdColumn.nodes.map((node, idx) =>
                GridNode(
                  idx,
                  thirdColumn.color?.hex,
                  node.icon,
                  node.title,
                  true,
                  animationStep
                )
              )}
            </div>

            {/* Connectors */}
            <div className="absolute w-full h-[calc(100%-137px)] top-[137px] z-0 hidden sm:block">
              <ConnectorLine
                key="conn_line14"
                className="h-[220px] top-[-52px] left-[50%] translate-x-[-50%]"
                lineClassName="h-[220px] w-0"
                slower
                animStep={animationStep}
              />

              <ConnectorLine
                key="conn_line15"
                className="w-[165px] top-[50%] left-[50%] translate-x-[-50%] rotate-90"
                lineClassName="h-0 w-[200px]"
                animStep={animationStep}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectedNodesGrid
