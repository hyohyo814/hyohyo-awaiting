import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";

export default function Profile() {
  const { user } = useUser();
  const { data, isLoading } = api.users.getUserRecords.useQuery();

  return (
    <PageLayout>
      <h1 className="text-5xl
      font-semibold tracking-tight text-white
      sm:text-[5rem]">
        Hi! {user?.username}
      </h1>
      <div className="flex flex-col
      gap-12 text-white text-3xl font-light
      w-96 p-6 bg-slate-900/90 rounded-xl">
        {!!isLoading && <div className="font-light">Loading User...</div>}
        {!isLoading && <table className="font-light">
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
        </table>}
      </div>
      <div className="flex w-full h-16 bg-slate-800
      rounded-full shadow-xl items-center px-12 gap-x-4">
        <Link href="/" className="bg-orange-400 px-10
        py-2 rounded-full">
          Home
        </Link>
        <Link href="/test" className="bg-orange-400 px-10
        py-2 rounded-full">
          Test 
        </Link>
      </div>
    </PageLayout>
  );
}
