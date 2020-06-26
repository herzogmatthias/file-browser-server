declare global {
  namespace Express {
    interface Request {
      decoded?: import("../../interfaces/IUser").IUser;
    }
  }
}
export {};
