// #1
const numbers = [3, 7, 2, 10, 5]

const multipliedNumber = numbers.map(number => number * 2)

console.log('Multiply every number by 2:' , multipliedNumber)


// #2
const myNum = 5

const greaterThanMyNum = numbers.filter(number => number > myNum)

console.log('Get numbers greater than 5: ',  greaterThanMyNum)

// #3

const firstNumGreaterThanFive = numbers.find(number => number >= 5)

console.log('Find the first number greater than 5:', firstNumGreaterThanFive)

// #4

const sumNumbers = numbers.reduce((sum, number) => sum + number, 0);

console.log('Calculate the sum: ', sumNumbers);

// #5

console.log('Check whether 10 exists: ', numbers.includes(10));