import { UserContext } from "@/src/context/UserContext";
import { useRouter } from "next/navigation";
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
  clientId,
  metadata,
}: {
  taskId: string;
  userId: string | undefined;
  clientId: string;
  metadata: any;
}) => {
  const router = useRouter();
  console.log(metadata);
  // Small spinner on the left, loading text in the middle, then a stop button on the right
  return (
    <div className="flex items-center justify-center cursor-pointer">
      <p className="mx-2">{metadata.loading_text}</p>
      <button
        className="text-red-500"
        onClick={(e) => {
          e.stopPropagation();
          cancelProcess(userId, taskId);
        }}
      >
        Stop
      </button>
    </div>
  );
};

export const ToastSuccess = ({
  taskId,
  userId,
  clientId,
  metadata,
}: {
  taskId: string;
  userId: string | undefined;
  clientId: string;
  metadata: any;
}) => {
  const router = useRouter();
  console.log(metadata);
  // Small spinner on the left, loading text in the middle, then a stop button on the right
  return (
    <div className="flex items-center justify-center cursor-pointer">
      <p className="mx-2">{metadata.success_text}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/select?clientId=${clientId}`);
        }}
      >
        Go to Result
      </button>
    </div>
  );
};
