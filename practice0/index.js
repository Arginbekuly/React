// Вспомогательная функция для вывода данных на страницу
function renderOutput(elementId, content) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = typeof content === 'object' ? JSON.stringify(content, null, 2) : content;
    }
}

// ==========================================
// Task 1: Basic Variables & Data Types
// ==========================================
const name = "Kydyrali";
let age = 21;
const isActive = true;
const courses = ["JS", "Enterprises", "Golang"];
const address = { city : "Almaty", street : "Pushkin"};
const schoolName = null;
let country;

const aboutStudent = `The about student his name is ${ name } , age ${ age }, living in address ${ address.city } at street ${ address.street }`;

const task1Results = [
    `Name: ${name} (Type: ${typeof name})`,
    `Age: ${age} (Type: ${typeof age})`,
    `Status: ${isActive} (Type: ${typeof isActive})`,
    `Courses: ${JSON.stringify(courses)} (Type: ${typeof courses})`,
    `Address: ${JSON.stringify(address)} (Type: ${typeof address})`,
    `School name: ${schoolName} (Type: ${typeof schoolName})`,
    `Country: ${country} (Type: ${typeof country})`,
    `\nSummary: ${aboutStudent}`
].join('\n');

renderOutput('output-task1', task1Results);

// ==========================================
// Task 2: Array Operations
// ==========================================
const numbers = [3, 7, 2, 10, 5];
const multipliedNumber = numbers.map(number => number * 2);
const myNum = 5;
const greaterThanMyNum = numbers.filter(number => number > myNum);
const firstNumGreaterThanFive = numbers.find(number => number >= 5);
const sumNumbers = numbers.reduce((sum, number) => sum + number, 0);
const hasTen = numbers.includes(10);

const task2Results = [
    `Multiply every number by 2: [${multipliedNumber.join(', ')}]`,
    `Get numbers greater than 5: [${greaterThanMyNum.join(', ')}]`,
    `Find the first number greater than 5: ${firstNumGreaterThanFive}`,
    `Calculate the sum: ${sumNumbers}`,
    `Check whether 10 exists: ${hasTen}`
].join('\n');

renderOutput('output-task2', task2Results);

// ==========================================
// Task 3: Array of Objects
// ==========================================
const t3Students = [
    { id : 1 , name: 'Anna' , grade : 85 },
    { id : 2 , name: 'John' , grade : 62 },
    { id : 3 , name: 'Sara' , grade : 91 },
    { id : 4,  name: 'Mike' , grade : 55 },
];

const greaterThanSeventy = t3Students.filter(student => student.grade >= 70);
const studentNames = t3Students.map(student => student.name);
const foundStudentById = t3Students.find(student => student.id === 3);

const maxGrade = Math.max(...t3Students.map(student => student.grade));
const topStudentObj = t3Students.find(student => student.grade === maxGrade);

const totalGrade = t3Students.reduce((sum, s) => sum + s.grade, 0);
const averageGrade = totalGrade / t3Students.length;

const updatedStudentsPass = t3Students.map(s => ({ ...s, passed: s.grade >= 70 }));

const task3Results = [
    `Students with grade >= 70: ${JSON.stringify(greaterThanSeventy)}`,
    `Array of student names: ${JSON.stringify(studentNames)}`,
    `Student with id = 3: ${JSON.stringify(foundStudentById)}`,
    `Top student: ${topStudentObj.name} (${topStudentObj.grade})`,
    `Average grade: ${averageGrade}`,
    `Updated array with 'passed' field: ${JSON.stringify(updatedStudentsPass, null, 2)}`
].join('\n\n');

renderOutput('output-task3', task3Results);

// ==========================================
// Task 4: Object Operations & Destructuring
// ==========================================
const user = {
    firstName: 'Kydyrali',
    lastName: 'Arginbekuly',
    age: 20,
    address: {
        city: 'Almaty',
        street: 'Pushkin 3/1'
    }
};

const fullNameAndCity = `${user.firstName} ${user.lastName}, ${user.address.city}`;
user.age = 22;
user.email = "k_arginbekuly@kbtu.kz";
delete user.address.street;

const { firstName, age: userAge } = user;
const { address: { city } } = user;
const { firstName : userName } = user;

const task4Results = [
    `1. Name & City: ${fullNameAndCity}`,
    `2. Updated Age: ${user.age}`,
    `3. Added Email: ${user.email}`,
    `4. Object after deleting street: ${JSON.stringify(user)}`,
    `5. Destructured firstName & age: ${firstName}, ${userAge}`,
    `6. Nested Destructuring (city): ${city}`,
    `7. Renamed Destructuring (userName): ${userName}`
].join('\n');

renderOutput('output-task4', task4Results);

// ==========================================
// Task 5: Shallow vs Deep Copying
// ==========================================
const original = { name: "Alice", score: 10 };
const copy = { ...original };
copy.score = 15;

const nestedUser = { name: "Alice", address: { city: "Almaty" } };
const deepCopiedUser = { ...nestedUser, address: { ...nestedUser.address } };
deepCopiedUser.address.city = "Astana";

const task5Results = [
    `Shallow Copy Test:`,
    `Original: ${JSON.stringify(original)} | Copy: ${JSON.stringify(copy)}`,
    `\nDeep Copy Test (Nested Object):`,
    `Original: ${JSON.stringify(nestedUser)}`,
    `Deep Copy with changed city: ${JSON.stringify(deepCopiedUser)}`
].join('\n');

renderOutput('output-task5', task5Results);

// ==========================================
// Tasks 6 & 7: Functions & Callbacks
// ==========================================
function isEven(number) { return number % 2 === 0; }
const isEvenArrow = num => num % 2 === 0;
function getFullName(firstName, lastName) { return `${firstName} ${lastName}`; }
function calculateDiscount(price, percent) { return price * percent / 100; }

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const calculate = (a, b, operation) => operation(a, b);

const task67Results = [
    `isEven(5): ${isEven(5)} | isEvenArrow(6): ${isEvenArrow(6)}`,
    `getFullName: ${getFullName('Kydyrali', 'Arginbekuly')}`,
    `calculateDiscount(1000, 50): ${calculateDiscount(1000, 50)}`,
    `Callback Add (4, 6): ${calculate(4, 6, add)}`,
    `Callback Multiply (4, 6): ${calculate(4, 6, multiply)}`
].join('\n');

renderOutput('output-tasks6-7', task67Results);

// ==========================================
// Tasks 8 & 9: Scope & Closures
// ==========================================
function createCount() {
    let count = 0;
    return function() {
        count++;
        return count;
    };
}

const counter1 = createCount();
const c1_step1 = counter1();
const c1_step2 = counter1();

const counter2 = createCount();
const c2_step1 = counter2();

function createAdder(num) {
    return function(number) {
        return number + num;
    };
}
const addFive = createAdder(5);

const task89Results = [
    `Scope demonstration executed (check browser console for block scope output).`,
    `Counter 1 calls: ${c1_step1}, ${c1_step2}`,
    `Counter 2 (independent instance) call: ${c2_step1}`,
    `Closure Adder (createAdder(5)(4)): ${addFive(4)}`
].join('\n');

renderOutput('output-tasks8-9', task89Results);

// ==========================================
// Task 10: Array/Object Destructuring, Spread & Rest
// ==========================================
const t10Numbers = [10, 20, 30, 40];
const [firstNum, secondNum] = t10Numbers;

const t10User = { id: 1, name: "Anna", age: 21 };
const { name: t10Name, age: t10Age } = t10User;

const arrayCopy = [...t10Numbers, 50];
const updatedUserObj = { ...t10User, name: "Kydyrali", age: 22 };
const userWithEmail = { ...t10User, name: "Kydyrali", age: 22, email: "Kydyrali@gmail.com" };

const arr1 = [10, 20, 30, 40];
const arr2 = [50, 60, 70];
const mergedArr = [...arr1, ...arr2];

const sumRest = (...nums) => nums.reduce((sum, curr) => sum + curr, 0);

const task10Results = [
    `1. Array Destructuring: first = ${firstNum}, second = ${secondNum}`,
    `2. Object Destructuring: name = ${t10Name}, age = ${t10Age}`,
    `3. Spread Array Copy: ${JSON.stringify(arrayCopy)}`,
    `4. Updated Object: ${JSON.stringify(updatedUserObj)}`,
    `5. Object with New Property: ${JSON.stringify(userWithEmail)}`,
    `6. Merged Arrays: ${JSON.stringify(mergedArr)}`,
    `7. Rest Parameter Sum (1, 2): ${sumRest(1, 2)}`,
    `   Rest Parameter Sum (1, 2, 3, 4): ${sumRest(1, 2, 3, 4)}`
].join('\n');

renderOutput('output-task10', task10Results);

// ==========================================
// Task 11: Optional Chaining & Nullish Coalescing
// ==========================================
const usersList = [
    { name: "Dos", address: { city: "Almaty", street: "Pushkin" } },
    { name: "Baha", email: "baha@gmail.com" },
    { name: "Kana", address: { city: "Almaty", street: "Abay" } },
    { name: "Dinur", email: "dinur@gmail.com" }
];

const task11Results = usersList.map(u => {
    const city = u?.address?.city ?? "City not specified";
    return `${u.name}: ${city}`;
}).join('\n');

renderOutput('output-task11', task11Results);

// ==========================================
// Final Task: Comprehensive Student Analysis
// ==========================================
const finalStudents = [
    { id: 1, name: "Kydyrali", age: 20, grades: [75, 10, 50] },
    { id: 2, name: "Dinur", age: 19, grades: [94, 87, 75] },
    { id: 3, name: "Kana", age: 21, grades: [85, 89, 65] },
    { id: 4, name: "Baha", age: 22, grades: [95, 85, 93] },
    { id: 5, name: "Dos", age: 20, grades: [75, 75, 92] }
];

function getAverage(grades) {
    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
}

function getStudentAverage(student) {
    return getAverage(student.grades);
}

function getPassedStudents(students) {
    return students.filter(student => getStudentAverage(student) >= 70);
}

function getStudentNames(students) {
    return students.map(student => student.name);
}

function findStudent(students, id) {
    return students.find(student => student.id === id);
}

function getTopStudent(students) {
    return students.reduce((topStudent, student) =>
            getStudentAverage(topStudent) <= getStudentAverage(student) ? student : topStudent,
        students[0]
    );
}

function getStudentsWithPass(students) {
    return students.map(student => ({
        ...student,
        passed: getStudentAverage(student) >= 70
    }));
}

const finalTaskResults = [
    `1. Baha's Grades Average: ${getAverage(finalStudents[3].grades).toFixed(2)}`,
    `2. Dinur Average: ${getStudentAverage(finalStudents[1]).toFixed(2)}`,
    `3. Passed Students: ${JSON.stringify(getPassedStudents(finalStudents).map(s => s.name))}`,
    `4. All Student Names: ${JSON.stringify(getStudentNames(finalStudents))}`,
    `5. Student with ID=1: ${JSON.stringify(findStudent(finalStudents, 1))}`,
    `6. Top Student: ${getTopStudent(finalStudents).name}`,
    `7. Students with 'passed' property: \n${JSON.stringify(getStudentsWithPass(finalStudents), null, 2)}`
].join('\n\n');

renderOutput('output-final', finalTaskResults);