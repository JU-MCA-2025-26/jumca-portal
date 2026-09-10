import type { Request, Response } from "express";
import type { AuthRequest, GetCoursesResponse, GetElectivesResponse, SaveElectiveResponse } from "@jumca/shared";
import { asyncHandler } from "@/utils/asyncHandler.js";
import courseService from "@/services/course.service.js";

export const getCourses = asyncHandler(async (req: Request, res: Response<GetCoursesResponse>) => {
  const { semester, type, isElective } = req.query as {
    semester?: string;
    type?: string;
    isElective?: string;
  };

  const courses = await courseService.getCourses({ semester, type, isElective });

  res.json({
    success: true,
    data: courses,
  });
});

export const getElectives = asyncHandler(async (req: AuthRequest, res: Response<GetElectivesResponse>) => {
  const { semester, basket } = req.query as {
    semester?: string;
    basket?: string;
  };

  const userId = req.user?.userId;
  const result = await courseService.getElectives({ semester, basket, userId });

  res.json({
    success: true,
    data: result.data,
    userSelections: result.userSelections,
  });
});

export const saveElective = asyncHandler(async (req: AuthRequest, res: Response<SaveElectiveResponse>) => {
  const { courseCode, basket, semester } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "User not authenticated",
      data: null as any,
    });
    return;
  }

  const userElective = await courseService.saveUserElective({ userId, courseCode, basket, semester });

  res.status(201).json({
    success: true,
    message: "Elective preference saved successfully",
    data: userElective,
  });
});
