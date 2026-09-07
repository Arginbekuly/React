const students = [
    {id : 1 , name : "Kydyrali", age : 20, grades: [75, 10, 50] },
    {id : 2 , name : "Dinur", age : 19, grades: [94, 87, 75]},
    {id : 3 , name : "Kana", age : 21, grades: [85, 89, 65]},
    {id : 4 , name : "Baha", age : 22, grades: [95, 85, 93]},
    {id : 5 , name : "Dos", age : 20, grades: [75, 75, 92]},
]

// # 1
function getAverage(grades){
    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length
}
console.log(getAverage(students[3].grades));


// # 2
function getStudentAverage(student){
    return getAverage(student.grades)
}

console.log(`${students[1].name }` , getStudentAverage(students[1]));


// # 3
function getPassedStudents(students){
    return students.filter(student => getStudentAverage(student) >= 70)
}
console.log("passed: ", getPassedStudents(students));



// # 4
function getStudentNames(students){
    return students.map(student => student.name)
}
console.log(getStudentNames(students));

// # 5
function findStudent(students, id){
    return students.find(student => student.id === id);
}
console.log(findStudent(students, 1));


// # 6
function getTopStudent(students){
    return students.reduce((topStudent, student) => getStudentAverage(topStudent) <= getStudentAverage(student) ? student : topStudent, students[0]);
}
console.log(getTopStudent(students));

// # 7
function getStudentsWithPass(students){
    return students.map(student => ({...student, passed : getStudentAverage(student) >= 70 }))
}
console.log(getStudentsWithPass(students));