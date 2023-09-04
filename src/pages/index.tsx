import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PageLayout } from "~/components/layout";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <PageLayout>
      {!isSignedIn &&
        <>
          <h1 className="front_title text-5xl font-semibold tracking-tight text-white sm:text-[5rem]">
            Speed<span className="text-rose-600">pasta</span>
          </h1>
          <div className="get_started flex flex-col gap-12 text-white text-3xl font-light items-center">
            <p>Test out your ability with code blocks</p>
            <SignInButton>
              <button className="get_started w-64 h-28 bg-rose-500 rounded-3xl">Get Started</button>
            </SignInButton>
          </div>
        </>}
      {!!isLoaded &&
        <>
          <div className="flex flex-wrap bg-slate-900 w-[64rem] h-[40rem] justify-center items-center">
            <Link
              href="/test"
              className="flex w-64 flex-col gap-12 text-white text-3xl font-light items-center">
              Start
            </Link>
          </div>
        </>
      }
    </PageLayout>
  );
}
