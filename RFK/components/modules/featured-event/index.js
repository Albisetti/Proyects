import Link from 'next/link'
import { imageBuilder } from '@lib/sanity'

const FeaturedEvent = ({ data = {} }) => {
  const { event } = data
  const assetUrl = imageBuilder.image(event?.featuredImage)?.url()

  return (
    <section>
      <div className="relative container-x pt-55 ">
        <div className="w-full flex bg-slateGray">
          <div>
            {event?.category && <h2>{event?.category}</h2>}
            <p>{new Date(event?.date).toDateString()}</p>
            {event?.speaker && <p>{event?.speaker}</p>}
            {event?.link && (
              <Link href={event?.link?.url}>
                <a target={event?.link?.target}>
                  <span className="text-[15.52px] leading-[18.84px] transition-all duration-300 text-deepBlueDark group-hover:text-opacity-70 font-almarose underline">
                    {event?.link?.title}
                  </span>
                  <span className="text-[15.52px] leading-[18.84px] font-almarose transition-all duration-300 group-hover:text-opacity-70 text-deepBlueDark ">
                    &gt;
                  </span>
                </a>
              </Link>
            )}
          </div>

          <div>
            <img
              src={assetUrl}
              className="w-[175px] h-[175px] aspect-square object-cover object-center rounded-full "
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedEvent
