import { z } from 'zod';

export const committeeSchema = z.object({
  positionName: z.string(),
  responsibilities: z.string().nullable(),
});

export const todoSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  deadline: z.string().nullable(),
});

export const rundownSchema = z.object({
  timeStart: z.string(),
  timeEnd: z.string().nullable(),
  activity: z.string(),
  description: z.string().nullable(),
  location: z.string().nullable(),
  notes: z.string().nullable(),
});

export const involvementsSchema = z.object({
  committees: z.array(committeeSchema),
  todos: z.array(todoSchema),
  rundowns: z.array(rundownSchema),
});

export const activitySchema = z.object({
  eventId: z.number(),
  eventName: z.string(),
  eventDescription: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  eventStatus: z.enum(['planning', 'ongoing', 'completed', 'cancelled']),
  involvements: involvementsSchema,
});

export const activitiesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(activitySchema),
  total: z.number(),
});