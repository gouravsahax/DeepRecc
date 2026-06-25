import { getARecc, updateRecc } from "@/lib/recc-action";
import SubmitButton from "../../../components/SubmitButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Recommendation | PeerProducts",
  description: "Update your product recommendation details.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({params}: PageProps) => {
  const id = (await params).id;
  const {title, desc} = await getARecc(id);

  return (
    <div className="w-screen flex flex-col items-center pt-6">
      <h1 className="mb-2">Edit Reccomendation</h1>
      <form action={updateRecc.bind(null, id)} className="flex flex-col gap-4 p-4 border-1 border-zinc-800 rounded-sm w-[95vw] lg:w-[40vw]">
        <h1>title</h1>
        <input type="text" name="title" defaultValue={title} className="border-1 border-zinc-800"/>
        <h1>description</h1>
        <input type="text" name="desc" defaultValue={desc! || ""} className="border-1 border-zinc-800"/>
        <SubmitButton className="mt-4 cursor-pointer px-2 py-1 border-1 border-zinc-300 hover:bg-zinc-300 hover:text-black rounded-sm text-md w-full">Submit</SubmitButton>
      </form>
    </div>
  )
}

export default page
