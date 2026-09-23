const user = {
    firstName: 'Kydyrali',
    lastName: 'Arginbekuly',
    age: 20,
    address: {
        city: 'Almaty',
        street: 'Pushkin 3/1'
    }
}


// #1
console.log("#1 Read the name and city")
console.log(user.firstName + ' ' + user.lastName, user.address.city);


// #2
console.log("#2 Change the age")
user.age = 22
console.log(user.age)


// #3
console.log("#3 Add an email")
user.email = "k_arginbekuly@kbtu.kz"
console.log(user.email)

// #4
console.log("#4 Remove the street")
delete user.address.street
console.log("Updated user: ", user)

// #5
console.log("#5 Get name and age using destructuring")
const { firstName , age } = user
console.log(firstName, age)


// #6
console.log("#6 Get city using nested destructuring.")
const {address : {city}} = user
console.log(city)


// #7
console.log("#7 Rename name to userName during destructuring")
const { firstName : userName } = user
console.log(userName)