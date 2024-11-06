import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  givenName: string;
  familyName: string;
  googleId?: string;
  verified: boolean;
  checkPassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      required: true,
      unique: true,
      type: String,
    },
    password: {
      type: String,
      validate: {
        validator: function (this: IUser, value: string) {
          return !!value || !!this.googleId;
        },
        message: "Either password or googleId is required",
      },
    },
    givenName: {
      type: String,
    },
    familyName: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (this: IUser, value: string) {
          return !!value || !!this.password;
        },
        message: "Either password or googleId is required",
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (this: IUser, next) {
  if (!this.isModified("password") || !this.password) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.checkPassword = async function (password: string) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
