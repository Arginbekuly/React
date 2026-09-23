// # 1 isEven(number)
function isEven(number) {
    if (number % 2 === 0) {
        return true;
    }
    return false;
}
console.log(isEven(5));

let isEvenArrow = (num => num % 2 === 0);
console.log(isEvenArrow(6));



// # 2 getFullName(firstName, lastName)

function getFullName(firstName , lastName) {
    return `${firstName} ${lastName}`;
}
console.log(getFullName('Kydyrali', 'Arginbekuly'));



// # 3 calculatePrice(price, quantity)

function calculateNumbers(price , quantity) {
    return price * quantity;
}
console.log(calculateNumbers(1000,4))



// # 4 calculateDiscount(price, percent)
function calculateDiscount(price , percent) {
    return price * percent / 100;
}
console.log(calculateDiscount(1000,50))


// # 5 getMax(a, b)

function getMax(a, b) {
    if (a > b)
        return a;
    return b;
}
console.log(getMax(50, 60));