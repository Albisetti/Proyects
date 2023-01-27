import React, { useEffect, useState } from 'react'
import { DashboardWidget } from '@sanity/dashboard'
import { Button, Flex } from '@sanity/ui'

const InformationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{ height: '1.25rem' }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const BuildIcon = () => (
  <svg
    style={{ height: '1.25rem' }}
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
)

function AmplifyDeploy({ webhookURL }) {
  const [buildTriggered, setBuildTriggered] = useState(false)
  const triggerAmplifyWebhook = async () => {
    try {
      await fetch(webhookURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'no-cors'
      })
    } catch (err) {
      console.error(err)
      return
    }

    setBuildTriggered(true)
  }

  return (
    <DashboardWidget header="Deploy Content Updates">
      <Flex style={{ padding: '1rem' }} direction="column">
        <p>
          If you have made content changes in the studio and wish to deploy them
          to the live website, press the "Build Website" button.
        </p>
        <p style={{ marginTop: 0 }}>
          <InformationIcon /> This process may take up to 15 minutes to build
          and propagate changes.
        </p>
        {buildTriggered ? (
          <Button
            flex={1}
            paddingX={2}
            paddingY={4}
            tone="primary"
            text="Build triggered!"
            onClick={() => false}
          />
        ) : (
          <Button
            flex={1}
            paddingX={2}
            paddingY={4}
            icon={BuildIcon}
            tone="primary"
            text="Build Website"
            onClick={triggerAmplifyWebhook}
          />
        )}
      </Flex>
    </DashboardWidget>
  )
}

export default {
  name: 'amplify-deploy',
  component: AmplifyDeploy
}
