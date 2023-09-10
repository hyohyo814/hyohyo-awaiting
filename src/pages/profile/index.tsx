import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";

export default function Profile() {
  const { user } = useUser();
  const { data, isLoading } = api.users.getUserRecords.useQuery();

  console.log(data)
  return (
    <PageLayout>
      {!!user && <div className="flex text-8xl
      font-semibold tracking-tight text-white
       gap-x-12">
        <span>Hi! {user?.username}</span>
        <Image
          src={user.imageUrl}
          alt={`${user.username} profile image`}
          width={128}
          height={128}
          className="rounded-full border border-white"
        />
      </div>}
      <div className="flex flex-col
      gap-12 text-white text-3xl font-light
      w-96 p-6 bg-slate-900/90 rounded-xl">
        {!!isLoading && <div className="font-light">Loading User...</div>}
        {!isLoading && <table className="font-light">
          <tbody> 
            <tr className="border-b border-slate-500">
              <td>&nbsp;</td>
              <td>Records</td>
            </tr>
            {!!data?.records && data.records.map((v, k) => {
              return (
                <tr key={v.id} className="">
                  <td>{k+1}</td>
                  <td>{v.time} s</td> 
                </tr>
            )})}
          </tbody>
        </table>}
      </div>
      <div className="flex flex-grow h-16 bg-slate-800
      rounded-full shadow-xl items-center px-12 gap-x-4">
        <Link href="/" className="bg-orange-400 px-10
        py-2 rounded-full">
          Home
        </Link>
        <Link href="/test" className="bg-rose-400 px-10
        py-2 rounded-full">
          Test 
        </Link>
      </div>
    </PageLayout>
  );
}
