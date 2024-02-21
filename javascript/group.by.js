const people = [
    { name: 'CR7', age: 38 },
    { name: 'M10', age: 36 },
    { name: 'VeMines', age: 25 },
    { name: 'Phat', age: 25 }
]

// const groupByAge = []
// people.forEach(person => {
//     if (person.age === 25) groupByAge.push(person)
// })
// console.log(groupByAge)


// const groupByAge = {}
// people.forEach(person => {
//     if (!groupByAge[person.age]) {
//         groupByAge[person.age] = []
//     }
//     groupByAge[person.age].push(person)
// })

// console.log(groupByAge)

// Need nodejs 21
const peopleByAge = Object.groupBy(people, person => person.age)
console.log(peopleByAge)