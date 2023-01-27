export const videoProjectorModuleQuery = `_type == 'videoProjector' => {
    _type,
    _key,
    title,
    videoType,
    "videoURL": videoUpload.asset->url,
    videoEmbedURL,
    videoPreviewImage
  }`
