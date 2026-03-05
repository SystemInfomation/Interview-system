export interface FormData {
  name: string;
  grade: string;
}

export const GRADE_OPTIONS = ["9th", "10th", "11th", "12th"] as const;

export const INITIAL_FORM_DATA: FormData = {
  name: "",
  grade: "",
};
