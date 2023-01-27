export default {
  title: 'Footer Settings',
  name: 'footerSettings',
  type: 'document',
  fieldsets: [
    {
      title: 'How to Reach Us',
      name: 'howToReachUsBlock',
      description: 'Settings for the How to Reach Us block',
      options: { collapsible: true }
    },
    {
      title: 'RFK Community Alliance Address',
      name: 'rfkCommunityAllianceAddressBlock',
      description: 'Settings for the RFK Community Alliance Address block',
      options: { collapsible: true }
    },
    {
      title: 'Newsletter',
      name: 'newsLetterBlock',
      description: 'Settings for the newsletter block',
      options: { collapsible: true }
    },
    {
      title: 'Terms of Use and Privacy Policy',
      name: 'termsOfUseAndPrivacyPolicyBlock',
      description: 'Settings for the Terms of Use and Privacy Policy block',
      options: { collapsible: true }
    },
    {
      title: 'Nav Menus',
      name: 'navMenusBlock',
      description: 'Settings for the Nav Menus block',
      options: { collapsible: true }
    }
  ],
  fields: [
    {
      title: 'Title',
      name: 'howToReachUsTitle',
      type: 'string',
      fieldset: 'howToReachUsBlock'
    },
    {
      title: 'Description',
      name: 'howToReachUsDescription',
      type: 'text',
      fieldset: 'howToReachUsBlock'
    },
    {
      title: 'Social Links',
      name: 'social',
      type: 'array',
      of: [{ type: 'socialLink' }],
      fieldset: 'howToReachUsBlock'
    },
    {
      title: 'Title',
      name: 'rfkCommunityAllianceAddressTitle',
      type: 'string',
      fieldset: 'rfkCommunityAllianceAddressBlock'
    },
    {
      title: 'Street',
      name: 'street',
      type: 'string',
      fieldset: 'rfkCommunityAllianceAddressBlock'
    },
    {
      title: 'City',
      name: 'city',
      type: 'string',
      fieldset: 'rfkCommunityAllianceAddressBlock'
    },
    {
      title: 'Phone Number',
      name: 'phoneNumber',
      type: 'string',
      fieldset: 'rfkCommunityAllianceAddressBlock'
    },
    {
      title: 'Title',
      name: 'newsLetterTitle',
      type: 'string',
      fieldset: 'newsLetterBlock'
    },
    {
      title: 'Description',
      name: 'newsLetterDescription',
      type: 'text',
      fieldset: 'newsLetterBlock'
    },
    {
      title: 'Copyright Title',
      name: 'copyrightTitle',
      type: 'string',
      fieldset: 'termsOfUseAndPrivacyPolicyBlock'
    },
    {
      title: 'Tax ID',
      name: 'taxID',
      type: 'string',
      fieldset: 'termsOfUseAndPrivacyPolicyBlock'
    },
    {
      title: 'Terms of Use URL',
      name: 'termOfUseUrl',
      type: 'url',
      fieldset: 'termsOfUseAndPrivacyPolicyBlock'
    },
    {
      title: 'Privacy Policy URL',
      name: 'privacyPolicyUrl',
      type: 'url',
      fieldset: 'termsOfUseAndPrivacyPolicyBlock'
    },
    {
      title: 'Find Support Menu',
      name: 'findSupportMenu',
      type: 'reference',
      to: [{ type: 'menu' }],
      fieldset: 'navMenusBlock'
    },
    {
      title: 'Our Services Menu',
      name: 'ourServicesMenu',
      type: 'reference',
      to: [{ type: 'menu' }],
      fieldset: 'navMenusBlock'
    },
    {
      title: 'Our Approach Menu',
      name: 'ourApproachMenu',
      type: 'reference',
      to: [{ type: 'menu' }],
      fieldset: 'navMenusBlock'
    },
    {
      title: 'About Us Menu',
      name: 'aboutUsMenu',
      type: 'reference',
      to: [{ type: 'menu' }],
      fieldset: 'navMenusBlock'
    },
    {
      title: 'News & Events Menu',
      name: 'newsEventsMenu',
      type: 'reference',
      to: [{ type: 'menu' }],
      fieldset: 'navMenusBlock'
    },
    {
      title: 'Careers Menu',
      name: 'careersMenu',
      type: 'reference',
      to: [{ type: 'menu' }],
      fieldset: 'navMenusBlock'
    },
    {
      title: 'Get Involved Page',
      name: 'getInvolvedPage',
      type: 'reference',
      to: [{ type: 'page' }],
      fieldset: 'navMenusBlock'
    },
    {
      title: 'Contact Us Page',
      name: 'contactUsPage',
      type: 'reference',
      to: [{ type: 'page' }],
      fieldset: 'navMenusBlock'
    },
    {
      title: 'Donation Callout Title',
      name: 'donationCOTitle',
      type: 'string'
    },
    {
      title: 'Donation Callout Description',
      name: 'donationCODescription',
      type: 'text'
    },
    {
      title: 'Donation Callout Link',
      name: 'donationCOLink',
      type: 'cta'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer Settings'
      }
    }
  }
}
