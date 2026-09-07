const add = (a , b ) => a + b;
const multiply = (a, b) => a * b;

const calculate =(a, b, operation) => {
    return operation(a, b);
};

console.log(calculate(4 , 6 , add))
console.log(calculate(4 , 6 , multiply));
