export interface IDataSignup {
  fullName: string;
  password: string;
  email: string;
}
export interface IDataLogin {
  password: string;
  email: string;
}
export interface IUser {
  _id: string;
  email: string;
  fullName: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}
