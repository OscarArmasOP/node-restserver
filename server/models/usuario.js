//Esquema

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido apá'
}

//Cascaron para crear los esquemas
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario pana']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario nene']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligaria paps']
    },
    img: {
        type: String,
        required: false
    }, //no es obligatioa
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    }, //deafult: 'USER_ROLE'
    estado: {
        type: Boolean,
        default: true
    }, //boolean
    google: {
        type: Boolean,
        default: false
    } // boolean

});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} DEBE DE SER UNIVO'
});

module.exports = mongoose.model('Usuario', usuarioSchema);