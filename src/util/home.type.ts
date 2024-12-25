export interface UserData {
  id: number;
  name: string;
  timeCheckIn: string;
  timeCheckOut: string;
  locationCheckIn: string;
  timeWorking: string;
  imagePicture: string;
}
export interface CheckInRecord {
  _id: string;
  userId: string;
  checkInTime: string;
  location: string;
  totalHours: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  checkOutTime: string;
}
