import Link from 'next/link'
import { imageBuilder } from '@lib/sanity'

function EventGrid({ data = {} }) {
  const { title, layout = 'three-column', events } = data

  return (
    <section>
      <div className="container-x pt-55">
        {title && <h2>{title}</h2>}

        {layout == 'three-column' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3">
              {events?.map((event, index) => {
                const assetUrl = imageBuilder.image(event?.featuredImage)?.url()

                return (
                  <div className="flex flex-col" key={index}>
                    <img
                      src={assetUrl}
                      className="w-full h-full aspect-video md:aspect-auto object-cover"
                    />
                    <p className="uppercase">
                      {new Date(event?.date).toDateString()}
                    </p>
                    <h3 className="text-[15.52px] leading-[18.84px]">
                      {event?.title}
                    </h3>
                    {event?.registrationLink && (
                      <Link
                        className="mb-auto"
                        href={event?.registrationLink?.url}
                      >
                        <a
                          className="transition-all duration-300 w-max group"
                          target={event?.registrationLink?.target}
                        >
                          <div className="mt-[14.78px] flex items-center space-x-5">
                            <span className="text-[15.52px] leading-[18.84px] transition-all duration-300 text-deepBlueDark group-hover:text-opacity-70 font-almarose underline">
                              {event?.registrationLink?.title}
                            </span>
                            <span className="text-[15.52px] leading-[18.84px] font-almarose transition-all duration-300 group-hover:text-opacity-70 text-deepBlueDark ">
                              &gt;
                            </span>
                          </div>
                        </a>
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-end">
              <Link className="mb-auto" href="/events">
                <a className="transition-all duration-300 w-max group">
                  <div className="mt-[14.78px] flex items-center space-x-5">
                    <span className="text-[15.52px] leading-[18.84px] transition-all duration-300 text-deepBlueDark group-hover:text-opacity-70 font-almarose underline">
                      More Events
                    </span>
                    <span className="text-[15.52px] leading-[18.84px] font-almarose transition-all duration-300 group-hover:text-opacity-70 text-deepBlueDark ">
                      &gt;
                    </span>
                  </div>
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default EventGrid
