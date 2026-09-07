// # 1
const numbers = [10 , 20, 30, 40];
const [first, second] = numbers;
console.log(first, second);


//  # 2
user = { id: 1, name: "Anna", age: 21 }
const {name , age} = user;
console.log(name, age)

// # 3
const copy = [...numbers, 50]
console.log(numbers);
console.log(copy)

//  # 4
const newUser = {...user, name : "Kydyrali", age: 22};
console.log(user)
console.log(newUser)


//  # 5
let newUser1 = {...user, name : "Kydyrali", age: 22, email: "Kydyrali@gmail.com"};
console.log(newUser1)


// # 6
const array1 = [10, 20, 30, 40];
const array2 = [50, 60, 70];
const array3 = [...array1, ...array2];
console.log(array3)


// # 7
const sum = (...number) => {
    return number.reduce((sum, curr) => sum + curr, 0)
}
console.log(sum(1,2));
console.log(sum(1,2,3,4));