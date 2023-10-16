const mongoose = require('mongoose')

const url = `mongodb+srv://jadsonptr:WR90s9n2AzABzv40@basemongo.s257eiy.mongodb.net/?retryWrites=true`

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(url, connectionParams)
    .then(() => {
        console.log('Connected to the database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
    })

mongoose.Promise = global.Promise;

module.exports = mongoose

