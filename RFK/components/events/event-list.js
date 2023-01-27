import Link from 'next/link'
import { imageBuilder } from '@lib/sanity'

function EventList({ events }) {
  return (
    <section>
      <div className="container-x pt-55">
        {events?.length === 0 && <p>No events to show.</p>}

        {events?.map((event, index) => {
          const assetUrl = imageBuilder.image(event?.featuredImage)?.url()

          return (
            <div className="mt-[40px]" key={index}>
              <p className="uppercase">{event?.category?.title}</p>
              <h2>{event?.title}</h2>
              <p>{new Date(event?.date).toDateString()}</p>
              <p>{event?.excerpt}</p>
              <img
                src={assetUrl}
                className="w-[175px] h-[175px] aspect-square object-cover object-center rounded-full "
              />
              <Link href={`/${event?._type}s/${event?.slug}`}>
                <a className="text-[15.52px] leading-[18.84px] transition-all duration-300 text-deepBlueDark group-hover:text-opacity-70 font-almarose underline">
                  Learn More
                </a>
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default EventList
