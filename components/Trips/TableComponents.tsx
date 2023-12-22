import { FlatList, Text, View, Modal, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { set } from "zod";
import { db } from "@/lib/firebase";
import useFetch from "@/hooks/useFetch";

interface TableProps {
  show: boolean;
  handleShow: (showModal: boolean) => void;
  trips: DocumentData;
}

interface jobs {
  jobtype: string;
  time: string;
}

function generateIntervals(Jobs: jobs[]): string[] {
  var intervals: string[] = [];
  var startTime: string;
  var endTime: string;
  var temp: string;
  for (let i = 0; i < Jobs.length; i++) {
    //白色的
    if (i == 0) {
      //第一個job
      startTime = "0:00";
      [endTime, temp] = Jobs[i].time.split("~");
      intervals.push(startTime + "~" + endTime);
    } else {
      [temp, startTime] = Jobs[i - 1].time.split("~");
      [endTime, temp] = Jobs[i].time.split("~");
      intervals.push(startTime + "~" + endTime);
    }

    intervals.push(Jobs[i].time);
    //紅色的
  }
  [temp, startTime] = Jobs[Jobs.length - 1].time.split("~");
  intervals.push(startTime + "~" + "24:00");

  return intervals;
}

function calculatePortion(timeString: string): number {
  // 分割兩個時間
  var totalMinute: number;
  var portion;
  const [startTime, endTime] = timeString.split("~");

  // 小時跟分鐘分開
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  // 全轉成分鐘
  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;
  totalMinute = endTimeInMinutes - startTimeInMinutes;
  portion = (totalMinute * 100) / 1440;
  return portion;
}

type employee = Record<string, jobs[]>; //key是員工名

const Table = ({ show, handleShow, trips }: TableProps) => {
  const [employeeJobs, setEmployeeJobs] = useState({});

  const Employee: employee = {
    Josh: [
      { jobtype: "捕魚", time: "4:00~6:00" },
      { jobtype: "殺魚", time: "7:00~8:00" },
      { jobtype: "處鯉魚獲", time: "13:00~14:00" },
    ],
    Andrew: [
      { jobtype: "捕魚", time: "2:00~3:00" },
      { jobtype: "殺魚", time: "9:00~10:00" },
      { jobtype: "處鯉魚獲", time: "16:00~18:00" },
    ],
    Roger: [
      { jobtype: "捕魚", time: "5:00~6:00" },
      { jobtype: "殺魚", time: "9:00~11:00" },
      { jobtype: "處鯉魚獲", time: "20:00~23:00" },
    ],
  };

  const allJobsArray = Object.keys(Employee)
    .map((person) => {
      const jobsArray = Employee[person].map((job, index) => ({
        person,
        jobtype: job.jobtype,
        key: `${person}_${index}`,
      }));
      return jobsArray;
    })
    .flat();

  const dataArray: number[] = Array.from(
    { length: 24 },
    (_, index) => index + 1
  );

  let intervals: string[];

  useEffect(() => {
    const getFormattedHour = (date: Date) => {
      const hour = date?.getHours();
      const minutes = date?.getMinutes();
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      return formattedHour + ":" + minutes + ampm;
    };

    //  const jobInfo: Record<string, jobs[]> = {};

    //  const jobIds: Record<string, string[]> = {}; //key:crewid, value:jobsids
    //  trips?.crew?.map((crewMember: any, index: number) => {
    //    jobIds[crewMember.id] = crewMember.crew_jobs.map((job: any) => job.id);
    //    await Promise.all(jobIds[crewMember.id]?.map(async (jobId: string) => {
    //      const jobRef = doc(db, "jobs", jobId);
    //      const jobData = await getDoc(jobRef);
    //      jobInfo[crewMember.crew_name].push({
    //        jobtype: jobData.data()?.job_name,
    //        time:
    //          getFormattedHour(jobData.data()?.expected_starting_datetime) +
    //          "~" +
    //         getFormattedHour(jobData.data()?.expected_ending_datetime),
    //    });
    //    }));
    //  });
    const fetchData = async () => {
      const jobInfo: Record<string, jobs[]> = {};

      const jobIds: Record<string, string[]> = {}; // key: crewid, value: jobsids

      await Promise.all(
        trips?.crew?.map(async (crewMember: any) => {
          jobIds[crewMember.id] = crewMember.crew_jobs.map(
            (job: any) => job.id
          );

          const jobDataPromises = jobIds[crewMember.id]?.map(
            async (jobId: string) => {
              const jobRef = doc(db, "jobs", jobId);
              const jobData = await getDoc(jobRef);

              return {
                jobtype: jobData.data()?.job_name,
                time:
                  getFormattedHour(jobData.data()?.expected_starting_datetime) +
                  "~" +
                  getFormattedHour(jobData.data()?.expected_ending_datetime),
              };
            }
          );
          const jobDataResults = await Promise.all(jobDataPromises);
          jobInfo[crewMember.crew_name] = jobDataResults;
        }) || []
      );
      console.log("jobInfo:", jobInfo);
      setEmployeeJobs(jobInfo);
    };
    fetchData();
  }, []);

  return (
    <Modal animationType="slide" visible={show} transparent={true}>
      <View
        className={`absolute bg-transparent z-10 right-0 left-0 top-0 bottom-0 flex-1 items-center justify-center`}
      >
        <View
          className={`p-3 rounded-2xl bg-slate-200 w-10/12 h-5/6 justify-center items-center`}
        >
          <View className="justify-center items-center">
            <Text className="text-xl">Job Scheduler</Text>
          </View>

          <View className="flex-1 items-center justify-center w-4/5 h-4/5">
            <View className="bg-white">
              <View className="flex flex-row bg-blue-300 border-2 justify-self-start">
                <Text className="w-24 text-center">Name</Text>
                <View className="bg-slate-100 border-l-2">
                  <Text className="text-center">Sunday,April 26, 2020</Text>
                  <View className="flex flex-row br-2 p-2 space-x-2 border-t-2 border-l-2">
                    {dataArray.map((number, index) => (
                      <View className="border-r w-5" key={index}>
                        <Text>{number - 1}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View className="flex flex-row">
                <View className="flex bg-white">
                  {Object.keys(Employee).map((person) => (
                    <View
                      key={person}
                      className="flex flex-row bg-white border justify-self-start"
                    >
                      <Text className=" w-24 h-7 text-center">{`${person}`}</Text>
                    </View>
                  ))}
                </View>
                <View className="flex">
                  {Object.keys(Employee).map((person) => {
                    intervals = generateIntervals(Employee[person]);

                    return (
                      <View key={person} className="flex flex-row w-5/5 border">
                        {/* <Text>{`${person}的工作:`}</Text> */}

                        {intervals.map((time: string, index) => {
                          const portion: number = calculatePortion(time);
                          {
                            /*const roundValue: string = portion.toFixed(0);
                          const percentString: string = `${roundValue}%`;*/
                          }
                          const realValue: number = (675 * portion) / 100;
                          const [startTime, endTime] = time.split("~");

                          if (index % 2 == 0) {
                            return (
                              <View
                                key={index}
                                className={`justify-self-start h-7 border-r`}
                                style={{ minWidth: realValue }}
                                // style={{ minWidth: `${portion}%` }}
                              >
                                <Text className="">{startTime}</Text>
                              </View>
                            );
                          } else if (index % 2 == 1) {
                            return (
                              <View
                                key={index}
                                className={`justify-self-start h-7 border-r bg-red-500`}
                                style={{ minWidth: realValue }}
                                // style={{ minWidth: `${portion}%` }}
                              >
                                <Text className="">{startTime}</Text>
                              </View>
                            );
                          }
                          {
                            /*return (
                            <View
                              key={index}
                              className={`justify-self-start h-7 border-r`}
                              style={{ minWidth: realValue }}
                              // style={{ minWidth: `${portion}%` }}
                            >
                              <Text className="">{startTime}</Text>
                            </View>
                          );*/
                          }
                        })}
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => handleShow(false)}
          className="absolute top-4 right-4"
        >
          <MaterialIcons name="close" color="#fff" size={22} />
        </Pressable>
      </View>
    </Modal>
  );
};
export default Table;
