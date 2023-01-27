export const tagsSliderQuery = `_type == 'tagsSlider' => {
    _type,
    _key,
    tags[]{
      reviewerName,
      rating,
      reviewTitle,
      previewText,
      reviewText
    }
  }`