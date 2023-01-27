const post = `
  title,
  "author": author->name,
  "slug": slug.current,
  featuredImage,
  alternateImage,
  excerpt,
  publishedAt
`

export const postGridQuery = `_type == 'postGrid' => {
  _type,
  _key,
  title,
  layout,
  "category": categoryFilter->{
    title,
    "slug": slug.current
  },
  layout == "news" => {
    defined(categoryFilter) => {
      "posts": *[_type == "post" && visibility == "visible" && category->title == ^.categoryFilter->title] | order(publishedAt desc) [0..3]{
        ${post}
      }
    },
    !defined(categoryFilter) => {
      "posts": *[_type == "post" && visibility == "visible"] | order(publishedAt desc) [0..4]{
        ${post}
      }
    }
  },
  layout == "newsletter" => {
    defined(categoryFilter) => {
      "posts": *[_type == "post" && visibility == "visible" && category->title == ^.categoryFilter->title] | order(publishedAt desc) [0..2]{
        ${post}
      }
    },
    !defined(categoryFilter) => {
      "posts": *[_type == "post" && visibility == "visible"] | order(publishedAt desc) [0..4]{
        ${post}
      }
    }
  },
  layout == "community-alliance" => {
    defined(categoryFilter) => {
      "posts": *[_type == "post" && visibility == "visible" && category->title == ^.categoryFilter->title] | order(publishedAt desc) [0..3]{
        ${post}
      }
    },
    !defined(categoryFilter) => {
      "posts": *[_type == "post" && visibility == "visible"] | order(publishedAt desc) [0..4]{
        ${post}
      }
    }
  }
}`
