const mongoose = require('../database').default
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    storeUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        require: false,
    },
    typeUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypeUser',
        require: false,
    },
    createdAt: {
        type: Date,
        dafault: Date.now,
    },

},
    { //para não retorna a senha gravada
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.__v;
            },
        },
    });

//pre indica que antes de salvar o usario vai criptar a pass
// UserSchema.pre('save', async function (next) {
//     const hash = await bcrypt.hash(this.password, 10)
//     this.password = hash

//     next()
// })

const User = mongoose.model('User', UserSchema)

module.exports = User;