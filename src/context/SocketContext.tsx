import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import io, { Socket } from "socket.io-client";
import { TaskContext } from "./TaskContext";
import { useLocalStorage } from "../utils/useLocalStorage";
import { UserContext } from "./UserContext";

export type SocketTasksContextProps = {
  socketTasks: [
    string[] | undefined,
    (value: string[] | undefined) => void,
    boolean,
  ];
};

export const SocketTasksContext = createContext<SocketTasksContextProps>({
  socketTasks: [undefined, () => {}, true],
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socketTasks, setSocketTasks, loading] = useLocalStorage<
    string[] | undefined
  >("socketTasks", undefined);

  const {
    userId: [userId],
  } = useContext(UserContext);

  const {
    taskInfo: [taskInfo, setTaskInfo],
  } = useContext(TaskContext);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!}`, {
      path: "/socket.io",
      transports: ["websocket"],
    });

    console.log("Connected to Socket.IO server", socket);

    // Listen for 'task_complete' events
    socket.on(`sub_task_complete/${userId}`, (data) => {
      console.log("Task Complete:", data);
      if (socketTasks) {
        if (!socketTasks.includes("fetch_quotes")) {
          // Push "fetch_quotes" to the socketTasks array
          setSocketTasks([...socketTasks, "fetch_quotes"]);
        }
      } else {
        setSocketTasks(["fetch_quotes"]);
      }
    });

    // Listen for 'task_status' events
    socket.on(`task_status/${userId}`, (data) => {
      console.log("Task Status:", data);
      if (data.status == "started") {
        if (taskInfo) {
          setTaskInfo([
            ...taskInfo!,
            { taskId: data.task_id, files: data.files, type: data.type },
          ]);
        } else {
          setTaskInfo([
            { taskId: data.task_id, files: data.files, type: data.type },
          ]);
        }
      }
      if (data.status === "failed") {
        if (data.type === "parse")
          toast.error("Failed to process PDFs. Please try again.");
        setTaskInfo(taskInfo?.filter((task) => task.taskId !== data.task_id));
      }
    });

    socket.on(`task_finished/${userId}`, (data) => {
      console.log("Task Finished:");
      setTaskInfo(taskInfo?.filter((task) => task.taskId !== data.task_id));
      if (data.type === "parse") toast.success("PDF(s) processed successfully");
    });

    return () => {
      socket.off("sub_task_complete");
      socket.off("task_status");
      socket.off("task_finished");
      socket.close();
    };
  }, [socketTasks, taskInfo]);

  return (
    <SocketTasksContext.Provider
      value={{
        socketTasks: [socketTasks, setSocketTasks, loading],
      }}
    >
      {children}
    </SocketTasksContext.Provider>
  );
}
