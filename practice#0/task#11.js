users = [
    {name: "Dos", address : {city: "Almaty", street: "Pushkin"},},
    {name: "Baha", email: "baha@gmail.com", },
    {name: "Kana", address : {city: "Almaty", street: "Abay"}},
    {name: "Dinur", email: "dinur@gmail.com"},
]

users.forEach(user => {
    const city = user?.address?.city ?? "City not specified";
    console.log(`${user.name} : ${city}`)
});



// ?? -> null or undefined
// || -> 0 "" null or undefined or NaN


