import { Star } from 'phosphor-react'
export default {
  title: 'Awards Hero',
  name: 'awardsHero',
  type: 'object',
  icon:Star,
  fields: [
    { title: 'Good Food Award', type: 'image', name: 'goodFoodAwardImage' },
    { title: 'Coffee Review', type: 'image', name: 'coffeeReviewImage' },
    { title: 'Polaroid Image', type: 'image', name: 'polaroidImage' },
    {
      title: 'Golden Bean Espresso',
      type: 'image',
      name: 'goldenBeanEspressoImage'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Awards Page Hero'
      }
    }
  }
}
