import Link from 'next/link'

import BlockContent from '@components/block-content'
import { imageBuilder } from '@lib/sanity'

function Event({ event }) {
  const {
    title,
    date,
    location,
    registrationLink,
    speaker,
    category,
    featuredImage,
    content,
    updatedAt,
    createdAt,
  } = event

  const assetUrl = imageBuilder.image(featuredImage)?.url()

  return (
    <section>
      <div className="container-x pt-55">
        <p className="uppercase">{category?.title}</p>
        <h2>{title}</h2>
        <p>{new Date(updatedAt).toDateString()}</p>
        <hr />
        <p>Date: {new Date(date).toDateString()}</p>
        {location && <p>Location: {location}</p>}
        {speaker && <p>Speaker: {speaker}</p>}
        <hr />
        <img src={assetUrl} className="w-[400px] h-auto" />
        <BlockContent blocks={content} />
        {!!registrationLink?.url && (
          <Link href={registrationLink?.url}>
            <a
              target={registrationLink?.target}
              className="text-[15.52px] leading-[18.84px] transition-all duration-300 text-deepBlueDark group-hover:text-opacity-70 font-almarose underline"
            >
              {registrationLink?.title}
            </a>
          </Link>
        )}
      </div>
    </section>
  )
}

export default Event
