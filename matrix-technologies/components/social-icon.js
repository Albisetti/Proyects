import React from 'react'

import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YouTubeIcon,
  LinkedinIcon,
  EmailIcon,
} from '@components/icons'

const SocialIcon = ({ name, className }) => {
  switch (name) {
    case 'Facebook':
      return <FacebookIcon className={className} />
    case 'Instagram':
      return <InstagramIcon className={className} />
    case 'Twitter':
      return <TwitterIcon className={className} />
    case 'YouTube':
      return <YouTubeIcon className={className} />
    case 'Linkedin':
      return <LinkedinIcon className={className} />
    case 'Email':
      return <EmailIcon className={className} />
    default:
      return null
  }
}

export default SocialIcon
