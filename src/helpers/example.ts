import { trpc } from "../utils/trpc";

export const getMsg = () => {
  return trpc.example.hello.useQuery({ text: "from tRPC" });
};
