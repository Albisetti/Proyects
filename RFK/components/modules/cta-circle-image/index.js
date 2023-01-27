import BlockContent from '@components/block-content'
import cx from 'classnames'
import Link from 'next/link'

const ctaCircleImage = ({ data = {} }) => {
  let { title, content, image, link, background, largerMaxWidth } = data
  return (
    <section className={cx('pb-[24px] mt-[20px] md:mt-[33px]')}>
      {background ? (
        <div className="container-x">
          <div className="bg-blueGray rounded-b-[45px] flex flex-col md:flex-row md:justify-between md:items-center relative">
            <div className="mt-[80px] md:mr-0 md:max-w-[600px] md:pb-[50px] sm:mt-[35px] md:mt-[47px] md:ml-[50px] sm:ml-[20px] ml-[20px]">
              <div className="w-[72px] h-[3px] rounded-full bg-lightBlue" />
              <h2 className="font-sentinel text-[31px] text-deepBlueDark leading-100 my-[14px] md:my-[40px]">
                {title}
              </h2>
              <BlockContent
                className="!text-deepBlueLight !font-medium mt-[18px] font-almarose text-[15px] leading-[23px] md:mt-[40px]"
                blocks={content}
              />
            </div>
            <div className="md:min-w-[360px] mt-[35px] md:mt-0 md:ml-[65px] h-full">
              <div className="relative mb-[24px] md:mb-0">
                <div className="relative w-[281px] max-w-[85vw] h-[281px] max-h-[85vw] mx-auto md:mx-0">
                  <img
                    className="ml-auto md:mr-[40px] p-[10px] sm:p-0 w-full h-full
                object-cover object-center rounded-full"
                    src={image?.url}
                  />
                  <Link href={link?.url} passHref>
                    <a className="absolute bottom-[20px] md:bottom-[35px] left-0 md:left-[-50px] xs:p-0 w-[100px] h-[100px] rounded-full bg-emerald flex items-center justify-center transition-transform duration-500 group hover:scale-110">
                      <span
                        className="text-deepBlueLight font-bold text-center max-w-[6ch]
                    text-[14px] sm:text-[16px] md:text-[17px] leading-[20px]"
                      >
                        {link?.title}{' '}
                        <span className="font-wingdings inline-block transition-transform duration-500 translate-x-0 group-hover:translate-x-[5px]">
                          ⭢
                        </span>
                      </span>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={
            image
              ? 'container-x flex flex-col md:flex-row md:justify-between items-center md:items-end md:gap-x-[0px] relative'
              : 'container-x flex md:gap-x-[0px] items-end relative'
          }
        >
          <div
            className={cx({
              'mt-[24px] sm:mt-[50px] md:mt-[100px]': image,
              'mt-[50px]': !image,
            })}
          >
            <div className="w-[72px] h-[3px] rounded-full bg-lightBlue" />
            <h2
              className={
                image
                  ? 'font-sentinel text-[40px] text-deepBlueDark leading-[48px] my-[20px] md:my-[25px]'
                  : 'font-almarose font-bold text-[40px] text-deepBlueDark leading-[48px] my-[20px] md:my-[25px]'
              }
            >
              {title}
            </h2>
            <BlockContent
              className={cx(
                'block-content-cta-circle-image !mt-[20px] font-almarose text-[18.45px] leading-[31px] md:mt-[40px] !text-deepBlueDark !font-medium',
                {
                  '!max-w-[600px]': !largerMaxWidth,
                  '!max-w-[750px]': largerMaxWidth,
                }
              )}
              blocks={content}
            />
          </div>
          {image && (
            <div className="mt-[24px] md:mt-[75px] md:pl-[76px]">
              <div className="relative mb-[24px] md:mb-0">
                <img
                  className="object-cover object-center rounded-full w-[85vw] h-[85vw] xs:min-w-[350px] xs:w-[350px] xs:min-h-[350px] xs:h-[350px]"
                  src={image?.url}
                />
                <Link href={link?.url} passHref>
                  <a
                    className="absolute bottom-0 left-0 sm:ml-[25%] sm:left-[-60px] md:ml-0 w-[29vw] h-[29vw] max-w-[130px] max-h-[130px] md:max-w-[unset] md:max-h-[unset]
                              md:w-[142px] md:h-[142px] rounded-full bg-emerald flex items-center justify-center transition-transform duration-500 group hover:scale-110"
                  >
                    <span
                      className="text-deepBlueLight font-bold text-center max-w-[100px] sm:max-w-[14ch]
                                text-[14px] sm:text-[16px] md:text-[18px] leading-[20px]"
                    >
                      {link?.title}{' '}
                      <span className="font-wingdings inline-block transition-transform duration-500 translate-x-0 group-hover:translate-x-[5px]">
                        ⭢
                      </span>
                    </span>
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default ctaCircleImage
