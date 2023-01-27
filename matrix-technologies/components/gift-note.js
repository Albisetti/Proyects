import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import cx from 'classnames'

import { useSiteContext, useAddCheckoutNote } from '@lib/context'

import { Gift } from './icons'

const GiftNote = () => {
  const { isUpdating, checkout } = useSiteContext()
  const createNote = useAddCheckoutNote()
  const [formOpen, setFormOpen] = useState(checkout.note?.note || false)

  const [giftNote, setGiftNote] = useState({
    to: checkout.note?.to || '',
    from: checkout.note?.from || '',
    note: checkout.note?.note || '',
  })

  const handleGiftNoteFieldChange = (field) => {
    return (ev) => {
      setGiftNote((prevState) => {
        return { ...prevState, [field]: ev.target.value }
      })
    }
  }

  return (
    <div
      className={cx(
        'bg-yellow flex items-center px-[25px] py-[15px] text-blue transition-[min-height] duration-300 lg:px-[62px]',
        { ['lg:min-h-[108px]']: !formOpen, ['lg:min-h-[280px]']: formOpen }
      )}
    >
      <AnimatePresence>
        {!formOpen ? (
          <motion.button
            key="button"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {
                opacity: 0,
              },
              show: {
                opacity: 1,
                transition: {
                  type: 'spring',
                  bounce: 0.15,
                  duration: 0.5,
                },
              },
            }}
            className="w-full"
            onClick={() => setFormOpen(true)}
            disabled={isUpdating}
          >
            <div
              className={cx(
                'flex cursor-pointer items-center justify-center space-x-[28px]',
                {
                  'cursor-not-allowed': isUpdating,
                }
              )}
            >
              <Gift className="h-auto w-[30px]" />
              <span className="grow-hover font-bold leading-none md:text-[20px]">
                {checkout.note?.note
                  ? 'Edit gift message'
                  : 'Add a gift message'}
              </span>
            </div>
          </motion.button>
        ) : (
          <motion.form
            key="form"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  type: 'spring',
                  bounce: 0.15,
                  duration: 0.5,
                },
              },
            }}
            className="grid w-full grid-cols-2 gap-[15px]"
          >
            <div className="form-control">
              <label className="sr-only" htmlFor="to">
                To:
              </label>
              <input
                type="text"
                name="to"
                placeholder="To"
                value={giftNote.to}
                onChange={handleGiftNoteFieldChange('to')}
              />
            </div>
            <div className="form-control">
              <label className="sr-only" htmlFor="from">
                From:
              </label>
              <input
                type="text"
                name="from"
                placeholder="From"
                value={giftNote.from}
                onChange={handleGiftNoteFieldChange('from')}
              />
            </div>
            <div className="form-control col-span-2 leading-none">
              <label className="sr-only" htmlFor="message">
                Gift Message:
              </label>
              <textarea
                type="text"
                name="message"
                placeholder="Gift Message"
                value={giftNote.note}
                onChange={handleGiftNoteFieldChange('note')}
              />
            </div>
            <div className="form-control col-span-2 flex gap-x-[15px]">
              <input
                type="submit"
                value="Save"
                className="btn !w-[9rem] !px-[1.375rem] !py-[.75rem] !text-[20px]"
                onClick={(e) => {
                  e.preventDefault()

                  createNote(giftNote)
                  setFormOpen(false)
                }}
              />
              <button
                className="btn !w-[9rem] !px-[1.375rem] !py-[.75rem] !text-[20px]"
                onClick={(e) => {
                  e.preventDefault()
                  setFormOpen(false)
                }}
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GiftNote
