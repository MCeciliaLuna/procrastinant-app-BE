const mongoose = require("mongoose");

const tareaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El ID de usuario es requerido"],
      index: true,
    },

    descripcion: {
      type: String,
      required: [true, "La descripción es requerida"],
      trim: true,
      minLength: [1, "La descripción debe tener al menos 1 caracter"],
      maxLength: [300, "La descripción no puede exceder 300 caracteres"],
    },

    listo: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "tareas",
  }
);

tareaSchema.index({ userId: 1, numeroOrden: 1 });

tareaSchema.index({ userId: 1, listo: 1 });

tareaSchema.index({ createdAt: -1 });

tareaSchema.methods.toJSON = function () {
  const tareaObject = this.toObject();
  delete tareaObject.__v;
  return tareaObject;
};

tareaSchema.methods.toggle = async function () {
  this.listo = !this.listo;
  return await this.save();
};

tareaSchema.statics.findByUserId = function (userId, options = {}) {
  const { listo = null, sort = "numeroOrden", order = "asc" } = options;

  const query = { userId };

  if (listo !== null) {
    query.listo = listo;
  }

  const sortOrder = order === "desc" ? -1 : 1;
  const sortObj = { [sort]: sortOrder };

  return this.find(query).sort(sortObj).exec();
};

tareaSchema.statics.countByUserId = function (userId, filters = {}) {
  const query = { userId, ...filters };
  return this.countDocuments(query);
};

tareaSchema.statics.deleteAllByUserId = function (userId) {
  return this.deleteMany({ userId });
};

const Tarea = mongoose.model("Tarea", tareaSchema);

module.exports = Tarea;
