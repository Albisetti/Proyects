const pageTransitionSpeed = 300

const fadeInUp = {
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
  hide: {
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.3,
    },
  },
}

const fadeInUpWithDelay = {
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.3,
    },
  },
  hide: {
    opacity: 0,
    y: 40,
    transition: {
      delay: 0.2,
      duration: 0.3,
    },
  },
}

const scaleUpContainer = {
  hidden: { scale: 0.5, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      type: 'spring',
      bounce: 0.25,
      duration: 0.5,
    },
  },
}

const scaleUpItem = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1 },
}

const fadeAnim = {
  show: {
    opacity: 1,
    transition: {
      duration: 0.2,
      delay: 0.1,
      ease: 'linear',
      when: 'beforeChildren',
    },
  },
  hide: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'linear',
      when: 'beforeChildren',
    },
  },
}

const flipAnim = {
  show: {
    y: ['100%', '0%'],
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
    },
  },
  hide: {
    y: ['0%', '-100%'],
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      when: 'afterChildren',
    },
  },
}

const swipeAnim = {
  show: {
    opacity: 1,
    x: ['-1rem', '0rem'],
    transition: {
      x: {
        duration: 0.8,
        delay: 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
      opacity: {
        duration: 0.2,
        delay: 0.1,
      },
    },
  },
  hide: {
    x: ['0rem', '1rem'],
    opacity: 0,
    transition: {
      x: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
      opacity: {
        duration: 0.1,
      },
    },
  },
}

const counterAnim = {
  show: {
    y: '0%',
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
    },
  },
  hide: (custom) => ({
    y: `${-100 * custom}%`,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      when: 'afterChildren',
    },
  }),
  hideR: (custom) => ({
    y: `${100 * custom}%`,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      when: 'afterChildren',
    },
  }),
}

const listAnim = {
  hide: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'linear',
      when: 'beforeChildren',
    },
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'linear',
      staggerChildren: 0.05,
    },
  },
}

export {
  fadeInUp,
  fadeInUpWithDelay,
  scaleUpContainer,
  scaleUpItem,
  pageTransitionSpeed,
  fadeAnim,
  flipAnim,
  swipeAnim,
  counterAnim,
  listAnim,
}
