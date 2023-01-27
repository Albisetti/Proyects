import React from 'react'

import styles from './styles.module.scss'
import TeamMembers from '../team-members'

const TeamContent = ({ data = {} }) => {
  const { title, subtitle, teamMembers } = data

  return (
    <div className={styles.teamContentContainer}>
      <h1 className={styles.teamTitle}>{title}</h1>
      <h2 className={styles.teamSubtitle}>{subtitle}</h2>
      <TeamMembers data={teamMembers} />
    </div>
  )
}

export default TeamContent
