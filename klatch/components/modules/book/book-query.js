export const bookQuery = ` _type == 'book' => {
    _type,
    _key,
    "template":@.template->{
      name,
      type,
      leftImg,
      rightImg
    },
    pages[]
  }`