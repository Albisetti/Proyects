import BlockContent from '@components/block-content'
import { imageBuilder } from '@lib/sanity'

function Post({ post }) {
  const { title, author, category, featuredImage, content, publishedAt } = post

  const assetUrl = imageBuilder.image(featuredImage)?.url()

  return (
    <section>
      <div className="container-x pt-55">
        <p className="uppercase">{category?.title}</p>
        <h2>{title}</h2>
        {author && <p>Author: {author}</p>}
        <p>{new Date(publishedAt).toDateString()}</p>
        <img src={assetUrl} className="w-[400px] h-auto" />
        <BlockContent blocks={content} />
      </div>
    </section>
  )
}

export default Post
