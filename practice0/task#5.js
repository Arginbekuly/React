const original= {name: "Alice", score: 10 }
copy = {...original}


//  # 1
console.log(copy.score = 15)
console.log(original , copy)


// # 2
const user = { name: "Alice", address: { city: "Almaty" } }
user1 = {...user, address : {...user.address }}
user1.address.city = "Astana"
console.log(user)
console.log(user1)
