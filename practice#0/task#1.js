const name = "Kydyrali";
let age = 21;
const isActive = true;
const courses = ["JS", "Enterprises", "Golang"];
const address = { city : "Almaty", street : "Pushkin"};

const schoolName = null;
let country;

console.log("Name:" , name, "Type:", typeof name);
console.log("Age:" , age, "Type:", typeof age);
console.log("Status:", isActive, "Type:", typeof isActive);
console.log("Courses:", courses, "Type:", typeof courses);
console.log("Address:" , address, "Type:", typeof address);
console.log("School  name:" , schoolName, "Type:", typeof schoolName);
console.log("Country:" , country, "Type:", typeof country);


const aboutStudent = `The about student his name is ${ name } , age ${ age }, living in address ${ address.city } at street ${ address.street }`;
console.log(aboutStudent);