import argon2 from "argon2";

export const comparePassword = async (
  candidatePassword: string,
  hash: string
) => {
  return argon2.verify(hash, candidatePassword);
};
