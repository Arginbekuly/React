const students = [
    { id : 1 , name: 'Anna' , grade : 85 },
    { id : 2 , name: 'John' , grade : 62 },
    { id : 3 , name: 'Sara' , grade : 91 },
    { id : 4,  name: 'Mike' , grade : 55 },
]
// # 1
console.log('# 1')

const greaterThanSeventy = students.filter(student => student.grade >= 70)
console.log('Students with grade ≥ 70: ', greaterThanSeventy)

// # 2
console.log('# 2')

const studentName = students.map(student => student.name)
console.log('An array of student name: ' , studentName)

// # 3
console.log('# 3')
const targetId = 3

const foundStudentById = students.find(student => student.id === targetId)
console.log('Student with id = 3: ' ,foundStudentById)

// # 4
console.log('# 4')

const maxGrade = Math.max(...students.map(student => student.grade));
const topStudent = students.find(student => student.grade === maxGrade)
console.log('Student with the highest grade:' , topStudent.name, ':' , topStudent.grade);

// # 5
console.log('# 5')

const totalGrade = students.reduce((sum, students) => sum + students.grade, 0)
const averageGrade = totalGrade / students.length
console.log('Student with the average grade:' , averageGrade);

// # 6
console.log('# 6')

const passingGrade = 70
const newArray = students.map(student =>({...student, passed: student.grade >= passingGrade}));
console.log('A new array where every student has passed:' , newArray);