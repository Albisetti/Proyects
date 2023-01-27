import React from 'react'
import LinkButton from 'utils/Buttons/LinkButton'

const StyleGuide = () => {
  return (
    <section className="px-combined bg-lightGray py-8 pt-[200px] xxl:container">
      <div className="grid grid-cols-2 gap-8">
        {/* Typography */}
        <div>
          Typography
          <h1 className="h1">Heading 1</h1>
          <h2 className="h2">Heading 2</h2>
          <h3 className="h3">Heading 3</h3>
          <h3 className="h4">Heading 4</h3>
          <h3 className="h5">Heading 5</h3>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-4 bg-gray">
          Buttons
          <LinkButton
            text={'See All Articles'}
            url={'/'}
            target={'_blank'}
            style={'blue'}
          />
          <LinkButton
            text={'See All Articles'}
            url={'/'}
            target={'_blank'}
            style={'white'}
          />
        </div>

        {/* Forms */}
        <div>
          Forms
          <form className="flex w-full flex-col space-y-[14px]">
            <div className="form-control">
              <input type="text" placeholder="Text Input" />
            </div>
            <div className="form-control invalid">
              <input type="text" placeholder="Text Input Invalid" />
              <span>Validation Message</span>
            </div>
            <div className="form-control">
              <select readOnly>
                <option>Select Field</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div className="form-control leading-none">
              <textarea rows={6} placeholder="Text area with 6 rows" />
            </div>
            <div className="form-control">
              <input type="number" className="quantity" initialValue="20" />
            </div>
            <div className="form-control">
              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>

        {/* Forms */}
        <div>
          Form Variants
          <form className="flex w-full flex-col space-y-[14px]">
            <div className="form-control">
              <input type="text" className="search" placeholder="Search" />
            </div>
            <div className="form-control">
              <select className="category" readOnly>
                <option>Category</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div className="form-control">
              <select className="sort" readOnly>
                <option>Sort</option>
                <option>Ascending</option>
                <option>Descending</option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default StyleGuide
