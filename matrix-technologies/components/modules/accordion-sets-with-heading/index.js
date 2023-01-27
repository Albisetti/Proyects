import BlockContent from '@components/block-content'

function AccordionSetsWithHeading({ data = {} }) {
  const { heading, accordionSet, anchor } = data

  return (
    <section id={anchor}>
      <div className="container">
        {heading && <h2>{heading}</h2>}
        <div>
          {accordionSet?.map((list, index) => (
            <div key={index}>
              {list?.title && <h3>{list?.title}</h3>}
              {list?.accordions?.map((accordion, index) => (
                <details key={index}>
                  <summary>{accordion.title}</summary>
                  <BlockContent blocks={accordion.content} />
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AccordionSetsWithHeading
