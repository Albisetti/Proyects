export const QuizPages = [
  {
    sheets: {
      index: 0,
      leftPage: {
        pageType: 'title',
        title: "Let's Chat Coffee",
      },
      rightPage: {
        pageType: 'question',
        question: "What's your usual go-to destination for buying beans?",
        number:1,
        isMulti:false,
        options: [
          {
            text: 'Grocery store, along with all my other essentials.',
            value: 1,
          },
          {
            text: 'Klatchroasting.com,of course! (Good Answer)',
            value: 2,
          },
          {
            text: "Other Coffee House or Roaster (It's okay, we don't judge.)",
            value: 3,
          },
          {
            text: "I'm new to this or looking for someone else.",
            value:4,
          },
        ],
      },
    },
  },
  {
    sheets: {
      path: 1,
      index: 1,
      leftPage: {
        pageType: 'question',
        number:2,
        question: 'What do you look for first when picking out coffee beans?',
        isMulti:false,
        options: [
          {
            text: 'Roast level generally tells me what I need to know.',
            value: '2a',
          },
          {
            text: 'Packaging or something that catches my eye.',
            value: '2b',
          },
          {
            text: 'Flavor notes, I read ALL of the descriptions.',
            value: '2c',
          },
          {
            text: 'Something new! I can always come back to my favorites later.',
            value: '2d',
          },
        ],
      },
      rightPage: {
        pageType: 'question',
        number:3,
        isMulti:false,
        question:
          "Since we're here to Find Your Roast, let's talk roasts. Do you have a level you currently go for?",
        options: [
          {
            text: 'Dark Roast: I like a bold body that stands up to add-ins.',
            value: '3a',
          },
          {
            text: "Medium Roast: Like all things, it's about balance.",
            value: '3b',
          },
          {
            text: 'Light Roast: I like a smooth, crisp cup to get me going.',
            value: '3c',
          },
        ],
      },
    },
  },
  {
    sheets: {
      path: 1,
      index: 2,
      leftPage: {
        pageType: 'question',
        number:4,
        isMulti:true,
        question:
          "The roast is just one part of the equation, so let's get a little more specific. What flavor notes do you enjoy most? Pick 1-3)",
        options: [
          {
            text: 'Strong & Smoky',
            value: '4a',
          },
          {
            text: 'Dark Chocolate & Nut',
            value: '4b',
          },
          {
            text: 'Chocolate & a touch of fruit',
            value: '4c',
          },
          {
            text: 'Savory & Spicy',
            value: '4d',
          },
        ],
      },
      rightPage: {
        pageType: 'question',
        number:5,
        isMulti:false,
        question:
          "Different brews need different beans. It's science. What method do you use.",
        options: [
          {
            text: 'Espresso. Excellently efficient extraction.',
            value: '5a',
          },
          {
            text: 'Brewer. It helps me multitask.',
            value: '5b',
          },
          {
            text: 'Hand Pour. I prefer a hands-on experience.',
            value: '5c',
          },
          {
            text: 'Other',
            value: '5d',
          },
        ],
      },
    },
  },
  {
    sheets: {
      path: 2,
      index: 1,
      leftPage: {
        pageType: 'question',
        isMulti:false,
        question: 'What do you look for first when picking out coffee beans?',
        number:2,
        options: [
          {
            text: "Espresso. I'm specific about my beans and brew style",
            value: '2a',
          },
          {
            text: "Single Origin. I really want to taste my beans' hometown.",
            value: '2b',
          },
          {
            text: 'Blends. They just bring more to the table.',
            value: '2c',
          },
        ],
      },
      rightPage: {
        pageType: 'question',
        isMulti:false,
        number:3,
        question:
          "Since we're here to Find Your Roast, let's talk roasts. Do you have a level you currently go for?",
        options: [
          {
            text: 'Dark Roast: I like a bold body that stands up to add-ins.',
            value: '3a',
          },
          {
            text: "Medium Roast: Like all things, it's about balance.",
            value: '3b',
          },
          {
            text: 'Light Roast: I like a smooth, crisp cup to get me going.',
            value: '3c',
          },
        ],
      },
    },
  },
  {
    sheets: {
      path: 2,
      index: 2,
      leftPage: {
        pageType: 'question',
        number:4,
        isMulti:true,
        question:
          "The roast is just one part of the equation, so let's get a little more specific. What flavor notes do you enjoy most? Pick 1-3)",
        options: [
          {
            text: 'Chocolate',
            value: '4a',
          },
          {
            text: 'Coffee',
            value: '4b',
          },
          {
            text: 'Dried Fruit',
            value: '4c',
          },
          {
            text: 'Caramel',
            value: '4d',
          },
          {
            text: 'Spice & Vanilla',
            value: '4e',
          },
          {
            text: 'Berry',
            value: '4f',
          },
          {
            text: 'Roasted Nut',
            value: '4g',
          },
          {
            text: 'Citrus',
            value: '4h',
          },
          {
            text: 'Citrus',
            value: '4i',
          },
        ],
      },
      rightPage: {
        pageType: 'question',
        isMulti:false,
        number:5,
        question:
          'Pick a Perry! We all have our favorites and personal styles, whose recommendation do you want to day?',
        options: [
          {
            text: 'Mike: the in-house engineer and tech expert.',
            value: '5a',
          },
          {
            text: 'Cindy: the life of the party.',
            value: '5b',
          },
          {
            text: 'Heather: the resident foodie barista.',
            value: '5c',
          },
          {
            text: 'Holly: the adventure seeker.',
            value: '5d',
          },
        ],
      },
    },
  },
  {
    sheets: {
      path: 3,
      index: 1,
      leftPage: {
        pageType: 'question',
        isMulti:false,
        number:2,
        question:
          "Different brews need different beans. It's science. What method do you use.",
        options: [
          {
            text: 'Espresso. Excellently efficient extraction.',
            value: '2a',
          },
          {
            text: 'Brewer. It helps me multitask.',
            value: '2b',
          },
          {
            text: 'Hand Pour. I prefer a hands-on experience.',
            value: '2c',
          },
          {
            text: 'Other',
            value: '2d',
          },
        ],
      },
      rightPage: {
        pageType: 'question',
        number:3,
        isMulti:false,
        question:
          "Since we're here to Find Your Roast, let's talk roasts. Do you have a level you currently go for?",
        options: [
          {
            text: 'Dark Roast: I like a bold body that stands up to add-ins.',
            value: '3a',
          },
          {
            text: "Medium Roast: Like all things, it's about balance.",
            value: '3b',
          },
          {
            text: 'Light Roast: I like a smooth, crisp cup to get me going.',
            value: '3c',
          },
          {
            text: "I'm new to this or looking for someone else.",
            value: '3d',
          },
        ],
      },
    },
  },
  {
    sheets: {
      path: 3,
      index: 2,
      leftPage: {
        pageType: 'question',
        isMulti:true,
        number:4,
        question:
          "The roast is just one part of the equation, so let's get a little more specific. What flavor notes do you enjoy most? Pick 1-3)",
        options: [
          {
            text: 'Strong & Smoky',
            value: '4a',
          },
          {
            text: 'Dark Chocolate & Nut',
            value: '4b',
          },
          {
            text: 'Chocolate & a touch of fruit',
            value: '4c',
          },
          {
            text: 'Savory & Spicy',
            value: '4d',
          },
        ],
      },
      rightPage: {
        pageType: 'question',
        number:5,
        isMulti:false,
        question:
          "Imagine it's one of those rare, no-obligations weekends when you can do exactly what you want. What activity would you choose?",
        options: [
          {
            text: 'Something exhilarating, like dirt biking or bungee jumping.',
            value: '5a',
          },
          {
            text: 'Being creative in the kitchen, making pasta and sauce from scratch.',
            value: '5b',
          },
          {
            text: 'Hiking in the local mountains to get some fresh air and exercise?',
            value: '5c',
          },
          {
            text: 'Unplugging and relaxing, cozied up with a book or a puzzle.',
            value: '5d',
          },
        ],
      },
    },
  },
  {
    sheets: {
      path: 4,
      index: 1,
      leftPage: {
        pageType: 'question',
        isMulti:false,
        number:2,
        question:
          "When you're visiting a new city, where do you go for a meal?",
        options: [
          {
            text: 'A popular high-end restaurant. Go big or go home!',
            value: '2a',
          },
          {
            text: 'An ethnic spot. Bring on the bold spices!',
            value: '2b',
          },
          {
            text: "A trusted chain. You can't go wrong.",
            value: '2c',
          },
          {
            text: 'A town staple. It may not be fancy, but you gotta trust the locals.',
            value: '2d',
          },
        ],
      },
      rightPage: {
        pageType: 'question',
        isMulti:false,
        number:3,
        question:
          "Different brews need different beans. It's science. What method do you use.",
        options: [
          {
            text: 'Espresso. Excellently efficient extraction.',
            value: '3a',
          },
          {
            text: 'Brewer. It helps me multitask.',
            value: '3b',
          },
          {
            text: 'Hand Pour. I prefer a hands-on experience.',
            value: '3c',
          },
          {
            text: 'Other',
            value: '3d',
          },
        ],
      },
    },
  },
  {
    sheets: {
      path: 4,
      index: 2,
      leftPage: {
        pageType: 'question',
        isMulti:false,
        number:4,
        question:
          "Since we're here to Find Your Roast, let's talk roasts. Do you have a level you currently go for?",
        options: [
          {
            text: 'Dark Roast: I like a bold body that stands up to add-ins.',
            value: '4a',
          },
          {
            text: "Medium Roast: Like all things, it's about balance.",
            value: '4b',
          },
          {
            text: 'Light Roast: I like a smooth, crisp cup to get me going.',
            value: '4c',
          },
        ],
      },
      rightPage: {
        pageType: 'question',
        isMulti:false,
        number:5,
        question:
          "Imagine it's one of those rare, no-obligations weekends when you can do exactly what you want. What activity would you choose?",
        options: [
          {
            text: 'Something exhilarating, like dirt biking or bungee jumping.',
            value: '5a',
          },
          {
            text: 'Being creative in the kitchen, making pasta and sauce from scratch..',
            value: '5b',
          },
          {
            text: 'Hiking in the local mountains to get some fresh air and exercise?',
            value: '5c',
          },
          {
            text: 'Unplugging and relaxing, cozied up with a book or a puzzle.',
            value: '5d',
          },
        ],
      },
    },
  },
]
