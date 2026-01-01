const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      minLength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxLength: [50, "El nombre no puede exceder 50 caracteres"],
    },

    apellido: {
      type: String,
      required: [true, "El apellido es requerido"],
      trim: true,
      minLength: [2, "El apellido debe tener al menos 2 caracteres"],
      maxLength: [50, "El apellido no puede exceder 50 caracteres"],
    },

    alias: {
      type: String,
      required: [true, "El alias es requerido"],
      trim: true,
      minLength: [3, "El alias debe tener al menos 3 caracteres"],
      maxLength: [10, "El alias no puede exceder 10 caracteres"],
    },

    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Por favor ingrese un email válido",
      ],
    },

    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
      select: false,
    },
  },
  {
    timestamps: true,

    collection: "users",
  }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
