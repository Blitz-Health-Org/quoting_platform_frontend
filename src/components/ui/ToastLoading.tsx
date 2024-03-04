import { UserContext } from "@/src/context/UserContext";
import { useContext } from "react";

async function cancelProcess(userId: string | undefined, taskId: string) {
  // Cancel the process
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/task/terminate/${taskId}?uid=${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export const ToastLoading = ({
  taskId,
  userId,
}: {
  taskId: string;
  userId: string | undefined;
}) => {
  // Small spinner on the left, loading text in the middle, then a stop button on the right
  return (
    <div className="flex items-center justify-center">
      <p className="mx-2">Loading...</p>
      <button
        className="text-red-500"
        onClick={() => cancelProcess(userId, taskId)}
      >
        Stop
      </button>
    </div>
  );
};
