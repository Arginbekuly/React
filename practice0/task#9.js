function createCount() {
    let count = 0;

    return function(){
        count++;
        return count;
    };

}
const count2 = createCount();
console.log(count2());
console.log(count2());
console.log(count2());

const count3 = createCount();
console.log("Second counter result is:", count3());


function createAdder(num){
    return function(number) {
        return number + num;
    }
}

const adder = createAdder(5);
console.log("Result of 3 task is: " , adder(4));