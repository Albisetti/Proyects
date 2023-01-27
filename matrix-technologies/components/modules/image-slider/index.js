import Slider from '@components/slider'

function ImageSlider({ data = {} }) {
  let { title, slides, anchor } = data

  return (
    <section id={anchor} className="container">
      {title && (
        <h2 className="h1 mt-8 text-center uppercase md:mt-20">{title}</h2>
      )}
      <Slider
        className="mt-8 max-h-[900px] lg:mt-12"
        slideClassName="max-h-[900px]"
        hideNavigation={true}
        slides={slides?.map((slide) => {
          return {
            image: slide?.image,
            content: null,
          }
        })}
      />
    </section>
  )
}

export default ImageSlider
