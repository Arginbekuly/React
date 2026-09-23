const message = "global"

function anotherMessage(){
    const message = "function"

    if(true) {
        const message = "block"
        console.log(message)
    }
    console.log(message)
}
anotherMessage();
console.log(message)
