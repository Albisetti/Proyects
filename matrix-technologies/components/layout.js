import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import cx from 'classnames'

import HeadSEO from '@components/head-seo'
import CookieBar from '@components/cookie-bar'
import Header from '@components/header'
import Footer from '@components/footer'

const Layout = ({ site = {}, page = {}, schema, children }) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.pageYOffset > 0)

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <HeadSEO site={site} page={page} schema={schema} />

      {site.gtmID && (
        <Script
          id="gtm"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${site.gtmID}');`,
          }}
        />
      )}
      <div className="relative top-0 bg-backgroundPattern bg-top bg-no-repeat">
        <CookieBar data={site.cookieConsent} />
        <Header data={site.header} scrolled={scrolled} />
        <main
          className={cx('transition-all duration-300', {
            ['pt-[82px]']: scrolled,
            ['pt-[82px] lg:pt-[220px]']: !scrolled,
          })}
          id="content"
        >
          {children}
        </main>
        <Footer data={site.footer} />
      </div>
    </>
  )
}

export default Layout
