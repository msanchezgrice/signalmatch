import { customAlphabet } from "nanoid";

const alphabet = "23456789abcdefghijkmnpqrstuvwxyz";
const makeRef = customAlphabet(alphabet, 10);

export function generateRefCode() {
  return makeRef();
}
