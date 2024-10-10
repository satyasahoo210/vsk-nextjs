"use server";

import { Role } from "@prisma/client";
import {
  AnnouncementSchemaType,
  AssignmentSchemaType,
  ClassSchemaType,
  EventSchemaType,
  ExamSchemaType,
  LessonSchemaType,
  ParentSchemaType,
  ResultSchemaType,
  State,
  StudentSchemaType,
  SubjectSchemaType,
  TeacherSchemaType,
} from "./definitions";
import prisma from "./prisma";
import { hashSync } from "bcrypt-ts";
import moment from "moment";

export const createSubject = async (
  state: State,
  data: SubjectSchemaType
): Promise<State> => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teacherIds.map((id) => ({ id })),
        },
      },
    });
    return { success: true, message: "Subject created successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateSubject = async (
  state: State,
  data: SubjectSchemaType
): Promise<State> => {
  if (!data.id) {
    console.error("Subject `id` is missing");
    return { success: false, message: "Something went wrong" };
  }

  try {
    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teachers: {
          set: data.teacherIds.map((id) => ({ id })),
        },
      },
    });
    return { success: true, message: "Subject updated successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteSubject = async (
  state: State,
  data: FormData
): Promise<State> => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: { id: parseInt(id) },
    });
    return { success: true, message: "Subject deleted successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const createClass = async (
  state: State,
  data: ClassSchemaType
): Promise<State> => {
  try {
    await prisma.class.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: data.supervisorId,
      },
    });
    return { success: true, message: "Class created successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateClass = async (
  state: State,
  data: ClassSchemaType
): Promise<State> => {
  if (!data.id) {
    console.error("Class `id` is missing");
    return { success: false, message: "Something went wrong" };
  }
  try {
    await prisma.class.update({
      where: { id: data.id },
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: data.supervisorId,
      },
    });
    return { success: true, message: "Class updated successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteClass = async (
  state: State,
  data: FormData
): Promise<State> => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: { id: parseInt(id) },
    });
    return { success: true, message: "Class deleted successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const createTeacher = async (
  state: State,
  data: TeacherSchemaType
): Promise<State> => {
  try {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        secret: hashSync(data.password),
        role: Role.TEACHER,
        isActive: true,
      },
    });

    await prisma.teacher.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        bloodGroup: data.bloodGroup,
        birthday: data.birthday,
        gender: data.gender,
        img: data.img,

        id: user.id,
        username: data.username,
        email: data.email,

        subjects: {
          connect: data.subjects?.map((id) => ({ id })),
        },
      },
    });
    return { success: true, message: "Teacher created successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateTeacher = async (
  state: State,
  data: TeacherSchemaType
): Promise<State> => {
  if (!data.id) {
    console.error("Teacher `id` is missing");
    return { success: false, message: "Something went wrong" };
  }
  try {
    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        bloodGroup: data.bloodGroup,
        birthday: data.birthday,
        gender: data.gender,
        img: data.img,

        subjects: {
          set: data.subjects?.map((id) => ({ id })),
        },
      },
    });
    return { success: true, message: "Teacher updated successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteTeacher = async (
  state: State,
  data: FormData
): Promise<State> => {
  const id = data.get("id") as string;
  try {
    await prisma.$transaction([
      prisma.user.delete({
        where: { id: id },
      }),
      prisma.teacher.delete({
        where: { id: id },
      }),
    ]);
    return { success: true, message: "Teacher deleted successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const createStudent = async (
  state: State,
  data: StudentSchemaType
): Promise<State> => {
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, message: "Class capacity is full" };
    }

    const user = await prisma.user.create({
      data: {
        username: data.username,
        secret: hashSync(data.password),
        role: Role.STUDENT,
        isActive: true,
      },
    });

    await prisma.student.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        bloodGroup: data.bloodGroup,
        birthday: data.birthday,
        gender: data.gender,
        img: data.img,

        id: user.id,
        username: data.username,
        email: data.email,

        classId: data.classId,
        gradeId: data.gradeId,
        parentId: data.parentId,
      },
    });
    return { success: true, message: "Student created successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateStudent = async (
  state: State,
  data: StudentSchemaType
): Promise<State> => {
  if (!data.id) {
    console.error("Student `id` is missing");
    return { success: false, message: "Something went wrong" };
  }
  try {
    await prisma.student.update({
      where: { id: data.id },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        bloodGroup: data.bloodGroup,
        birthday: data.birthday,
        gender: data.gender,
        img: data.img,

        classId: data.classId,
        gradeId: data.gradeId,
        parentId: data.parentId,
      },
    });
    return { success: true, message: "Student updated successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteStudent = async (
  state: State,
  data: FormData
): Promise<State> => {
  const id = data.get("id") as string;
  try {
    await prisma.user.delete({
      where: { id: id },
    });

    await prisma.student.delete({
      where: { id: id },
    });
    return { success: true, message: "Student deleted successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const createParent = async (
  state: State,
  data: ParentSchemaType
): Promise<State> => {
  try {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        secret: hashSync(data.password),
        role: Role.PARENT,
        isActive: true,
      },
    });

    await prisma.parent.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        img: data.img,

        id: user.id,
        username: data.username,
        email: data.email,
      },
    });
    return { success: true, message: "Parent created successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateParent = async (
  state: State,
  data: ParentSchemaType
): Promise<State> => {
  if (!data.id) {
    console.error("Parent `id` is missing");
    return { success: false, message: "Something went wrong" };
  }
  try {
    await prisma.parent.update({
      where: { id: data.id },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        img: data.img,
      },
    });
    return { success: true, message: "Parent updated successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteParent = async (
  state: State,
  data: FormData
): Promise<State> => {
  const id = data.get("id") as string;
  try {
    await prisma.user.delete({
      where: { id: id },
    });

    await prisma.parent.delete({
      where: { id: id },
    });
    return { success: true, message: "Parent deleted successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const createAnnouncement = async (
  state: State,
  data: AnnouncementSchemaType
): Promise<State> => {
  try {
    await prisma.announcement.create({
      data: {
        title: data.title,
        classId: data.classId > 0 ? data.classId : null,
        date: data.date,
        description: data.description,
      },
    });
    return { success: true, message: "Announcement created successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateAnnouncement = async (
  state: State,
  data: AnnouncementSchemaType
): Promise<State> => {
  if (!data.id) {
    console.error("Announcement `id` is missing");
    return { success: false, message: "Something went wrong" };
  }

  try {
    await prisma.announcement.update({
      where: { id: data.id },
      data: {
        title: data.title,
        classId: data.classId > 0 ? data.classId : null,
        date: data.date,
        description: data.description,
      },
    });
    return { success: true, message: "Announcement updated successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteAnnouncement = async (
  state: State,
  data: FormData
): Promise<State> => {
  const id = data.get("id") as string;
  try {
    await prisma.announcement.delete({
      where: { id: parseInt(id) },
    });
    return { success: true, message: "Announcement deleted successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const createEvent = async (
  state: State,
  data: EventSchemaType
): Promise<State> => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        classId: data.classId > 0 ? data.classId : null,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
      },
    });
    return { success: true, message: "Event created successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateEvent = async (
  state: State,
  data: EventSchemaType
): Promise<State> => {
  if (!data.id) {
    console.error("Event `id` is missing");
    return { success: false, message: "Something went wrong" };
  }

  try {
    await prisma.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        classId: data.classId > 0 ? data.classId : null,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
      },
    });
    return { success: true, message: "Event updated successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteEvent = async (
  state: State,
  data: FormData
): Promise<State> => {
  const id = data.get("id") as string;
  try {
    await prisma.event.delete({
      where: { id: parseInt(id) },
    });
    return { success: true, message: "Event deleted successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const createExam = async (
  state: State,
  data: ExamSchemaType
): Promise<State> => {
  try {
    await prisma.exam.create({
      data: {
        title: data.title,
        lessonId: data.lessonId,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
    return { success: true, message: "Exam created successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateExam = async (
  state: State,
  data: ExamSchemaType
): Promise<State> => {
  if (!data.id) {
    console.error("Exam `id` is missing");
    return { success: false, message: "Something went wrong" };
  }

  try {
    await prisma.exam.update({
      where: { id: data.id },
      data: {
        title: data.title,
        lessonId: data.lessonId,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
    return { success: true, message: "Exam updated successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteExam = async (
  state: State,
  data: FormData
): Promise<State> => {
  const id = data.get("id") as string;
  try {
    await prisma.exam.delete({
      where: { id: parseInt(id) },
    });
    return { success: true, message: "Exam deleted successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const createAssignment = async (
  state: State,
  data: AssignmentSchemaType
): Promise<State> => {
  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        lessonId: data.lessonId,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
    return { success: true, message: "Assignment created successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateAssignment = async (
  state: State,
  data: AssignmentSchemaType
): Promise<State> => {
  if (!data.id) {
    console.error("Assignment `id` is missing");
    return { success: false, message: "Something went wrong" };
  }

  try {
    await prisma.assignment.update({
      where: { id: data.id },
      data: {
        title: data.title,
        lessonId: data.lessonId,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
    return { success: true, message: "Assignment updated successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteAssignment = async (
  state: State,
  data: FormData
): Promise<State> => {
  const id = data.get("id") as string;
  try {
    await prisma.assignment.delete({
      where: { id: parseInt(id) },
    });
    return { success: true, message: "Assignment deleted successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const createResult = async (
  state: State,
  data: ResultSchemaType
): Promise<State> => {
  try {
    await prisma.result.create({
      data: {
        score: data.score,
        examId: data.examId > 0 ? data.examId : null,
        assignmentId: data.assignmentId > 0 ? data.assignmentId : null,
        studentId: data.studentId,
      },
    });
    return { success: true, message: "Result created successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateResult = async (
  state: State,
  data: ResultSchemaType
): Promise<State> => {
  if (!data.id) {
    console.error("Result `id` is missing");
    return { success: false, message: "Something went wrong" };
  }

  try {
    await prisma.result.update({
      where: { id: data.id },
      data: {
        score: data.score,
        examId: data.examId > 0 ? data.examId : null,
        assignmentId: data.assignmentId > 0 ? data.assignmentId : null,
        studentId: data.studentId,
      },
    });
    return { success: true, message: "Result updated successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteResult = async (
  state: State,
  data: FormData
): Promise<State> => {
  const id = data.get("id") as string;
  try {
    await prisma.result.delete({
      where: { id: parseInt(id) },
    });
    return { success: true, message: "Result deleted successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const createLesson = async (
  state: State,
  data: LessonSchemaType
): Promise<State> => {
  try {
    await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: moment(data.startTime, "HH:mm").toDate(),
        endTime: moment(data.endTime, "HH:mm").toDate(),
        classId: data.classId,
        teacherId: data.teacherId,
        subjectId: data.subjectId,
      },
    });
    return { success: true, message: "Lesson created successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateLesson = async (
  state: State,
  data: LessonSchemaType
): Promise<State> => {
  if (!data.id) {
    console.error("Lesson `id` is missing");
    return { success: false, message: "Something went wrong" };
  }

  try {
    await prisma.lesson.update({
      where: { id: data.id },
      data: {
        name: data.name,
        day: data.day,
        startTime: moment(data.startTime, "HH:mm").toDate(),
        endTime: moment(data.endTime, "HH:mm").toDate(),
        classId: data.classId,
        teacherId: data.teacherId,
        subjectId: data.subjectId,
      },
    });
    return { success: true, message: "Lesson updated successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteLesson = async (
  state: State,
  data: FormData
): Promise<State> => {
  const id = data.get("id") as string;
  try {
    await prisma.lesson.delete({
      where: { id: parseInt(id) },
    });
    return { success: true, message: "Lesson deleted successfully" };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};
