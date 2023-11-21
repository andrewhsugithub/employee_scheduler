import { z } from "zod";

export const JobSchema = z.object({
  job_name: z.string(),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const RegisterSchema = z.object({
  boss: z.string(),
  boss_id: z.string(),
  captain: z.string(),
  captain_id: z.string(),
  captain_job: z.array(JobSchema),
  crew: z.array(
    z.object({
      crew_name: z.string(),
      crew_id: z.string(),
      crew_job: z.array(JobSchema),
    })
  ),
});

export type RegisterFormSchema = z.infer<typeof RegisterSchema>;

export type JobFormSchema = z.infer<typeof JobSchema>;
