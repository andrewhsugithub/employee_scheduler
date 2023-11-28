import { z } from "zod";

export const JobSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  jobName: z.string().optional(),
  jobDescription: z.string().optional(),
});

export const RegisterSchema = z.object({
  trip_name: z.string().min(1),
  captain_name: z.string().optional(),
  captain_job: z.array(JobSchema),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  crew: z.array(
    z.object({
      crew_name: z.string().min(1),
      crew_job: z.array(JobSchema),
    })
  ),
  location: z.string().optional(),
  // success: z.boolean().default(true),
});

export type RegisterFormSchema = z.infer<typeof RegisterSchema>;

export type JobFormSchema = z.infer<typeof JobSchema>;
