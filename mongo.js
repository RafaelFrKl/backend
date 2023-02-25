const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

console.log(process.argv.length)

const password = process.argv[2]
const inputName = process.argv[3]
const inputNumber = process.argv[4]

const url =
    `mongodb+srv://RafaelFK:${password}@cluster0.mqyhyd4.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
	name: inputName,
	number: inputNumber,
})

if (process.argv.length === 3) {
	// View All Notes
	console.log('Phonebook:')
	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
		process.exit(0)
	})
} if (process.argv.length > 3) {
	// Save New Note
	person.save().then(result => {
		console.log(`added ${inputName}'s number ${inputNumber} to phonebook`)
		mongoose.connection.close()
	})  
}

// Restrict search to only include important notes
/*Person.find({ important: true }).then(result => {
    ...
})*/