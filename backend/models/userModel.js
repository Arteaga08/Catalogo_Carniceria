// backend/models/UserModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "editor"],
      default: "editor",
    },
  },
  {
    timestamps: true,
  }
);

// Método para comparar contraseñas (se usará durante el login)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware pre-save para cifrar la contraseña antes de guardarla
userSchema.pre('save', async function (next) {

  if (this.isModified('password')) { // Solo hashea si la contraseña ha sido modificada (o es nueva)
    const salt = await bcrypt.genSalt(10); // Genera un "salt"
    this.password = await bcrypt.hash(this.password, salt); // Hashea la contraseña
  }

  next(); // Llama a next() SIEMPRE para continuar el flujo
});

const User = mongoose.model("User", userSchema);

export default User;
