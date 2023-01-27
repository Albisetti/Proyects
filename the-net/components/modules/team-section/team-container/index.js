import React from 'react'
import TeamContent from '../team-content'

import styles from './styles.module.scss'

const TeamContainer = ({ data = {} }) => {
  const { teamContent } = data

  return (
    <div
      className={styles.container}
      id="elemTeam"
      style={{ backgroundImage: 'url(/lines-horizontal-bg.svg)' }}
    >
      <div className={styles.content}>
        <TeamContent data={teamContent} />
      </div>
    </div>
  )
}

export default TeamContainer
