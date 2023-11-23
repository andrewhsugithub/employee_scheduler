import { z } from "zod";

export const JobSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const RegisterSchema = z.object({
  captain: z.string(),
  captain_job: z.array(JobSchema),
  crew: z.array(
    z.object({
      crew_name: z.string(),
      crew_job: z.array(JobSchema),
    })
  ),
  // success: z.boolean().default(true),
});

export type RegisterFormSchema = z.infer<typeof RegisterSchema>;

export type JobFormSchema = z.infer<typeof JobSchema>;
