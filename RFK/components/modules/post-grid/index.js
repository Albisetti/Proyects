import NewsLayout from './layout/news'
import NewsletterLayout from './layout/newsletter'
import CommunityAllianceLayout from './layout/community-alliance'

const Layout = ({ name, posts, category }) => {
  switch (name) {
    case 'news':
      return <NewsLayout posts={posts} category={category} />
    case 'newsletter':
      return <NewsletterLayout posts={posts} />
    case 'community-alliance':
      return <CommunityAllianceLayout posts={posts} />
    default:
      return <NewsLayout posts={posts} />
  }
}

function PostGrid({ data = {} }) {
  const { title, layout, posts, category } = data

  return (
    <section>
      <div className="container-x pt-55">
        {title && <h2>{title}</h2>}
        <Layout name={layout} posts={posts} category={category} />
      </div>
    </section>
  )
}

export default PostGrid
