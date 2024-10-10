import { Day, Gender } from "@prisma/client";
import { z } from "zod";
import validator from "validator";

const TIME_REGEX = /^[0-2]\d:[0-5]\d$/;
export const DUMMY_PASSWORD = "Zy.QI64?q8]VjvT";

export type State = {
  success: boolean;
  message: string | null;
};

export const BLOOD_GROUPS = [
  "A +ve",
  "A -ve",
  "B +ve",
  "B -ve",
  "AB +ve",
  "AB -ve",
  "O +ve",
  "O -ve",
] as const;
export const GENDERS = ["MALE", "FEMALE"] as const;

export const SignInSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).trim(),
  password: z.string().trim(),
});
export type SignInSchemaType = z.infer<typeof SignInSchema>;

export const TeacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(15, { message: "Username must be at most 15 characters long!" })
    .regex(/^[a-zA-Z\d_]+$/, {
      message: "Username can contain any of alphabets, digits & `_`",
    })
    .regex(/^[a-z]/, {
      message: "Username must begin with an alphabet",
    }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .or(z.literal("")),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long!" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().optional(),
  phone: z
    .string()
    .refine(validator.isMobilePhone, "Please enter a valid phone number")
    .or(z.literal("")),
  address: z.string().optional(),
  bloodGroup: z.enum(BLOOD_GROUPS).or(z.literal("")),
  birthday: z.coerce.date({ message: "Please enter birth date" }),
  gender: z.nativeEnum(Gender, { message: "Gender is required" }),
  img: z.string().optional(),
  subjects: z.array(z.coerce.number()).optional(),
});

export type TeacherSchemaType = z.infer<typeof TeacherSchema>;

export const StudentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),

  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long!" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().optional(),
  phone: z
    .string()
    .refine(validator.isMobilePhone, "Please enter a valid phone number")
    .or(z.literal("")),
  address: z.string().optional(),
  bloodGroup: z.enum(BLOOD_GROUPS).optional(),
  birthday: z.coerce.date({ message: "Please enter birth date" }),
  gender: z.nativeEnum(Gender, { message: "Gender is required" }),
  img: z.string().optional(),

  gradeId: z.coerce.number().min(1, "Grade is required"),
  classId: z.coerce.number().min(1, "Class is required"),
  parentId: z.string().min(1, "Parent is required"),
});

export type StudentSchemaType = z.infer<typeof StudentSchema>;

export const ParentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),

  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long!" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().optional(),
  img: z.string().optional(),
});

export type ParentSchemaType = z.infer<typeof ParentSchema>;

export const AnnouncementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long!" })
    .max(20, { message: "Title must be at most 20 characters long!" }),

  description: z.string(),
  date: z.string().transform((str) => new Date(str)),
  classId: z.coerce.number(),
});

export type AnnouncementSchemaType = z.infer<typeof AnnouncementSchema>;

export const AssignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long!" })
    .max(20, { message: "Title must be at most 20 characters long!" }),

  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  lessonId: z.coerce.number().min(1, "Please select a lesson"),
});

export type AssignmentSchemaType = z.infer<typeof AssignmentSchema>;

export const ClassSchema = z.object({
  id: z.coerce.number().optional(),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long!" })
    .max(10, { message: "Name must be at most 10 characters long!" }),
  capacity: z.coerce.number().min(1, "Capacity is required"),
  gradeId: z.coerce.number().min(1, "Please select a grade"),
  supervisorId: z.string().min(1, "Please select a teacher"),
});

export type ClassSchemaType = z.infer<typeof ClassSchema>;

export const EventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long!" })
    .max(10, { message: "Title must be at most 10 characters long!" }),
  description: z.string(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  classId: z.coerce.number(),
});

export type EventSchemaType = z.infer<typeof EventSchema>;

export const ExamSchema = z.object({
  id: z.coerce.number().optional(),
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long!" })
    .max(10, { message: "Title must be at most 10 characters long!" }),
  startTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().transform((str) => new Date(str)),
  lessonId: z.coerce.number().min(1, "Please select a lesson"),
});

export type ExamSchemaType = z.infer<typeof ExamSchema>;

export const LessonSchema = z.object({
  id: z.coerce.number().optional(),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long!" })
    .max(10, { message: "Name must be at most 10 characters long!" }),
  startTime: z
    .string()
    .regex(TIME_REGEX, { message: "Please enter a valid time" }),
  endTime: z
    .string()
    .regex(TIME_REGEX, { message: "Please enter a valid time" }),
  day: z.nativeEnum(Day, { message: "Please select a day" }),
  subjectId: z.coerce.number().min(1, "Please select a subject"),
  classId: z.coerce.number().min(1, "Please select a class"),
  teacherId: z.string().min(1, "Please select a teacher"),
});

export type LessonSchemaType = z.infer<typeof LessonSchema>;

export const ResultSchema = z
  .object({
    id: z.coerce.number().optional(),
    examId: z.coerce.number(),
    assignmentId: z.coerce.number(),
    studentId: z.string().min(1, "Please select a student"),
    score: z.coerce.number(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.assignmentId <= 0 && data.examId <= 0) ||
      (data.assignmentId > 0 && data.examId > 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either exam or assignment is required. Please select any one",
        path: ["examId"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either exam or assignment is required. Please select any one",
        path: ["assignmentId"],
      });
    }
  });

export type ResultSchemaType = z.infer<typeof ResultSchema>;

export const SubjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, "Subject name is required"),
  teacherIds: z.array(z.string()),
});

export type SubjectSchemaType = z.infer<typeof SubjectSchema>;
