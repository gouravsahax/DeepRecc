import { getMyReccs, deleteRecc } from "@/lib/recc-action"
import Link from "next/link";
import SubmitButton from "../components/SubmitButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Recommendations | PeerProducts",
  description: "Manage and view your product recommendations on PeerProducts.",
};

const page = async () => {
  const {reccs, count} = await getMyReccs();

  return (
    <div className="w-full flex justify-center items-center">
      <div className="px-4 md:px-8 py-4 flex flex-col gap-4 lg:w-[60vw]">
        <div>
          Number of reccomendations : {count}
        </div>
        {reccs.map((recc) => (
          <div key={recc.id} className="border-1 border-zinc-800 px-4 py-2 rounded-sm flex flex-col bg-black text-zinc-300">
            <h3 className="text-lg uppercase mb-2">{recc.title}</h3>
            <p className="mb-4">{recc.description}</p>
            {recc.imageUrl && (
              <div className="mb-4 overflow-hidden rounded-sm border border-zinc-800">
                <img src={recc.imageUrl} alt={recc.title} className="w-full object-cover max-h-[200px]" />
              </div>
            )}
            <Link className="underline mb-4" href={recc.url || "/"}>{recc.type}</Link>
            <div className="flex gap-2 mb-2">
              <Link href={`/reccs/edit/${recc.id}`} className="cursor-pointer px-2 py-1 border-1 border-green-600 hover:bg-green-600 hover:text-black rounded-sm text-md">Edit</Link>
              <form action={deleteRecc.bind(null, recc.id)}>
                <SubmitButton pendingText="Deleting..." className="cursor-pointer px-2 py-1 border-1 border-red-600 hover:bg-red-600 hover:text-black rounded-sm text-md">Delete</SubmitButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default page
