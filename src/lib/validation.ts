import { containsProfanity } from "./profanity";

export const NAME_REGEX = /^[a-zA-Z\s]{1,20}$/;

export function validateName(name: string): string | null {
  if (!name.trim()) return "Name is required.";
  if (!NAME_REGEX.test(name))
    return "Name must be 1-20 letters only (no numbers, symbols, or emojis).";
  if (containsProfanity(name)) return "Please use appropriate language.";
  return null;
}

export function validateGrade(grade: string): string | null {
  if (!grade) return "Please select your grade level.";
  if (!["9th", "10th", "11th", "12th"].includes(grade))
    return "Invalid grade level.";
  return null;
}
