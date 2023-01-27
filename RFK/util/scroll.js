export const scrollToSection = (id) => {
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
}
