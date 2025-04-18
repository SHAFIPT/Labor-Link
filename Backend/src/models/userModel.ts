import mongoose , {Schema ,model} from 'mongoose';
import { IUser } from 'controllers/entities/UserEntity';
   
const UserSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  ProfilePic: { type: String, default: "https://www.svgrepo.com/show/192247/man-user.svg" },
  role: { type: String, default: 'user' },
  isBlocked: { type: Boolean, default: false },
  refreshToken: { type: [String], default: [] }, 
  lastLogin: { type: Date, default: null },
  authType: { type: String, enum: ["local", "google"], required: true },
}, {timestamps : true});

const User = mongoose.model<IUser>('Users', UserSchema)

export default User;