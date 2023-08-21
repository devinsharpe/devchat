import { nanoid } from "nanoid";

export const createId = () => nanoid(25);

export const idConfig = {
  length: 25,
};
