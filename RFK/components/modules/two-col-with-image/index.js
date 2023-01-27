import BlockContent from '@components/block-content'
import Link from 'next/link'

const twoColWithImage = ({ data = {} }) => {
  let { title, textLeft, textRight, image, link } = data

  return (
    <section className="bg-deepBlueDark sm:mt-[40px] pb-[24px] sm:pb-[50px] md:pb-[75px]">
      <div className="container-x grid grid-cols-1 md:grid-cols-2 md:gap-x-[80px] items-end relative">
        <div className="mt-[50px]">
          <div className="w-[72px] h-[3px] rounded-full bg-lightBlue" />
          <h2 className="font-almarose text-[31.74px] leading-100 font-bold text-white my-[24px] md:my-[40px]">
            {title}
          </h2>
          <BlockContent
            className="text-white-with-blue-bold mt-[24px] md:mt-[40px]"
            blocks={textLeft}
          />
        </div>
        <div className="mt-[24px] md:mt-[75px]">
          <div className="md:absolute md:top-[50px] lg:top-[30px] right-[50px] md:mt-[-241px]">
            <div className="relative flex justify-center mb-[60px] md:mb-0">
              <div className="relative w-[85vw] h-[85vw] xs:w-[480px] xs:h-[480px] md:w-[400px] md:h-[400px] sm:mx-auto md:mx-0">
                <img
                  className="ml-auto w-full h-full object-cover object-center rounded-full"
                  src={image?.url}
                />
                <Link href={link?.url} passHref>
                  <a className="absolute bottom-0 left-0 w-[100px] xxs:w-[140px] md:w-[160px] h-[100px] xxs:h-[140px] md:h-[160px] rounded-full bg-emerald flex items-center justify-center transition-transform duration-500 group hover:scale-110">
                    <span className="text-deepBlueLight font-bold text-center max-w-[14ch] text-[14px] xxs:text-[20px] leading-[18px] xxs:leading-[25px]">
                      {link?.title}{' '}
                      <span className="inline-block font-wingdings transition-transform duration-500 translate-x-0 group-hover:translate-x-[5px]">
                        ⭢
                      </span>
                    </span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <BlockContent
            className="text-white-with-blue-bold"
            blocks={textRight}
          />
        </div>
      </div>
    </section>
  )
}

export default twoColWithImage
