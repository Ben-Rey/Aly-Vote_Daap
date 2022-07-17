export const fetchProposals = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        `We are lucky to live in a glorious age that gives us everything we could ask 
        for as a human race. What more could you need when you have meat covered in 
        cheese nestled between bread as a complete meal.`,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      ])
    }, 1000)
  })
}

export const setProposals = (proposal: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Proposal ${proposal} added`)
    }, 5000)
  })
}
