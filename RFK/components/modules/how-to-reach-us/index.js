import BlockContent from '@components/block-content'
import Icon from '@components/icon'

const HowToReachUs = ({ data = {} }) => {
  let { mainTitle, content, social, addressTitle, street, city, phoneNumber } =
    data

  return (
    <section className="pb-[24px] mt-[30px] sm:mt-[70px] sm:pb-[50px] md:pb-[75px]">
      <div className="md:grid-cols-2 container-x grid grid-cols-1 items-center">
        <div className="mt-[24px] sm:mt-[50px] md:mt-[0px] md:max-w-[545px]">
          <div className="w-[72px] h-[3px] rounded-full bg-lightBlue" />
          <h2 className="font-almarose font-bold text-[31.75px] text-deepBlueDark leading-[22.49px] my-[20px] md:my-[25px]">
            {mainTitle}
          </h2>
          <BlockContent
            className="mt-[24px] font-almarose text-[18.52px] leading-[31.75px] md:mt-[40px]"
            blocks={content}
          />
          <div className="text-deepBlueLight grid grid-flow-col auto-cols-auto gap-x-[0px] font-almarose text-[11.91px] xs:max-w-[210px] sm:max-w-[210px] md:max-w-[210px]">
            {social?.map((link, key) => {
              return (
                <a
                  key={key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon
                    className="text-deepBlueLight text-[20px] mr-[0px] mt-[28px] max-h-[25px]"
                    name={link.icon}
                  />
                </a>
              )
            })}
          </div>
        </div>
        <div className="md:ml-[75px]">
          <div class="font-almarose mt-[24px] sm:mt-[50px] md:mt-[60px] ">
            <p className="text-[15.88px] leading-[34.66px] text-poolBlue font-bold">
              {addressTitle}
            </p>
            <p className="text-[23.81px] leading-[34.66px] font-normal">
              {street}
              <br />
              {city} <br />
            </p>
            <p className="text-[23.81px] leading-[34.66px] font-normal mt-[15px]">
              {phoneNumber}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowToReachUs
