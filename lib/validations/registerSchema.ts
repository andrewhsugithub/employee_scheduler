import { z } from "zod";

export const JobSchema = z
  .object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    jobName: z.string(),
  })
  .refine((val) => val.startDate < val.endDate, {
    path: ["startDate"],
    message: "Job Start date must be earlier than End date.",
  });

const getYearMonthDayString = (date: Date) => {
  const year = date.getFullYear() + "";
  const month = date.getMonth() + 1 + "";
  const day = date.getDate() + "";
  return year + "/" + month + "/" + day;
};

export const RegisterSchema = z
  .object({
    trip_name: z.string().min(1),
    captain_job: z.array(JobSchema),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    crew: z.array(
      z
        .object({
          crew_id: z.string(),
          crew_job: z.array(JobSchema),
        })
        .refine(
          (val) => {
            // Group jobs by day
            const dates: Record<string, number> = {};
            val.crew_job.map((job) => {
              let diffHours = Math.floor(
                Math.abs(job.endDate.getTime() - job.startDate.getTime()) / 36e5
              );

              let startHour = job.startDate.getHours();
              let startingDate = job.startDate;
              while (diffHours + startHour >= 24) {
                const startDateString = getYearMonthDayString(startingDate);
                dates[startDateString] =
                  (dates[startDateString] || 0) + 24 - startHour;
                diffHours -= 24 - startHour;
                startHour = 0;
                startingDate.setDate(startingDate.getDate() + 1);
              }
              const startDateString = getYearMonthDayString(startingDate);
              dates[startDateString] =
                (dates[startDateString] || 0) + diffHours;
            });

            // Check if any day has more than 14 hours
            for (const hours of Object.values(dates)) {
              if (hours >= 14) {
                return false;
              }
            }
            return true;
          },
          {
            path: ["crew_job.0.jobName"],
            message: "A crew member can't work more than 14 hours in a day",
          }
        )
    ),
    location: z.string().optional(),
  })
  .refine(
    (val) => {
      // Group jobs by day
      const dates: Record<string, number> = {};
      val.captain_job.map((job) => {
        let diffHours = Math.floor(
          Math.abs(job.endDate.getTime() - job.startDate.getTime()) / 36e5
        );

        let startHour = job.startDate.getHours();
        let startingDate = job.startDate;
        while (diffHours + startHour >= 24) {
          const startDateString = getYearMonthDayString(startingDate);
          dates[startDateString] =
            (dates[startDateString] || 0) + 24 - startHour;
          diffHours -= 24 - startHour;
          startHour = 0;
          startingDate.setDate(startingDate.getDate() + 1);
        }
        const startDateString = getYearMonthDayString(startingDate);
        dates[startDateString] = (dates[startDateString] || 0) + diffHours;
      });

      // Check if any day has more than 14 hours
      for (const hours of Object.values(dates)) {
        if (hours >= 14) {
          return false;
        }
      }
      return true;
    },
    {
      path: ["captain_job.0.jobName"],
      message: "Captain can't work more than 14 hours in a day",
    }
  )
  .refine((val) => val.startDate < val.endDate, {
    path: ["startDate"],
    message: `Trip Start date must be earlier than End date.`,
  });

export type RegisterFormSchema = z.infer<typeof RegisterSchema>;

export type JobFormSchema = z.infer<typeof JobSchema>;
