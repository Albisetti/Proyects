import React from 'react'
import CtaModule from '../cta/cta-module'
import styles from './wholesale-two-col-with-cta-and-clipboard.module.scss'
import BlockContent from '@components/block-content'
import Clipboard from '../clipboard/clipboard';


const WholesaleTwoColWithCtaAndClipboard = ({ data = {} }) => {
    const { clipboard, textLeft, subtitle, ctaButton } = data
    return (
        <div className={styles.wrapper}>
            <div className={styles.textCtaWrapper}>
                <BlockContent className={styles.textLeft} blocks={textLeft} />
                <BlockContent className={styles.subtitle} blocks={subtitle} />
                <div className={styles.ctaModuleWrapper}>
                    <CtaModule cta={ctaButton} />
                </div>
            </div>
            <div className={styles.clipboard}>
                <Clipboard data={clipboard} />
            </div>
        </div>
    )
}

export default WholesaleTwoColWithCtaAndClipboard