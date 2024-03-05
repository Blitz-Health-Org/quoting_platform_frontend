// Task Context:
// 1. grab taskIds stored in the local storage
// 2. check on status of tasks in server
// 3. update the status of the tasks in the local storage -- only keep the tasks that are not completed

"use client";

import { createContext, useEffect, useState } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import { Loading } from "../components/ui/Loading";
import toast from "react-hot-toast";

interface PendingTask {
  taskId: string;
  files: string[];
  type: string;
}

export type TaskContextProps = {
  taskInfo: [
    PendingTask[] | undefined,
    (value: PendingTask[] | undefined) => void,
    boolean,
  ];
};

export const TaskContext = createContext<TaskContextProps>({
  taskInfo: [undefined, () => {}, true],
});

export const TaskContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [taskInfo, setTaskInfo, loading] = useLocalStorage<
    PendingTask[] | undefined
  >("taskInfo", undefined);

  const [pendingTaskCheck, setPendingTaskCheck] = useState(true);

  useEffect(() => {
    // Check on the status of each task in the server
    if (pendingTaskCheck && taskInfo) {
      taskInfo.forEach((task) => {
        if (task.taskId) {
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/task/status/${task.taskId}`,
          )
            .then((res) => res.json())
            .then((data) => {
              // if it is completed or failed, remove the task from the local storage
              if (data.status === "completed" || data.status === "failed") {
                // Remove the task from the local storage
                setTaskInfo(taskInfo.filter((t) => t.taskId !== task.taskId));
              }
            });
        }
      });
      setPendingTaskCheck(false);
    }
  }, [taskInfo, pendingTaskCheck, setTaskInfo]);

  // Logic for loading state for parsing tasks
  useEffect(() => {
    console.log("taskInfo IN TASK CONTEXT", taskInfo);
    let loadingParse = false;
    // Check if there are any parsing tasks loading
    if (!loading && taskInfo) {
      console.log("IN TASKINFO LOOP");
      for (const task of taskInfo) {
        console.log(task);
        if (task.type === "parse") {
          console.log("FOUND PARSING TASK");
          toast.loading("Processing PDF(s)...", {
            id: "pdfParsing",
          });
          loadingParse = true;
          break;
        }
      }
    }
    if (!loadingParse) toast.dismiss("pdfParsing");
  }, [taskInfo, loading]);

  if (loading) return <Loading />;

  return (
    <>
      <TaskContext.Provider
        value={{
          taskInfo: [taskInfo, setTaskInfo, loading],
        }}
      >
        {children}
      </TaskContext.Provider>
    </>
  );
};
