const mongoose = require('mongoose')

const password = process.argv[2]
const personName = process.argv[3]
const personPhone = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0-ionyk.mongodb.net/phonebook-app?retryWrites=true`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: personName,
    number: personPhone
})

if (process.argv.length > 3) {
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}