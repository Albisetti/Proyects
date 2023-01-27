import ReactPlayer from 'react-player'

import PlayButton from './play-button'

function Video({ data = {} }) {
  const { url, previewImage, anchor } = data

  return (
    <section id={anchor} className="video">
      <div className="container px-24 py-16">
        <ReactPlayer
          className="aspect-video"
          url={url}
          width="100%"
          height="100%"
          controls={true}
          playsinline
          light={previewImage?.url}
          playIcon={<PlayButton className="h-auto w-1/5" />}
        />
      </div>
    </section>
  )
}

export default Video
