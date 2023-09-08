import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PageLayout } from "~/components/layout";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <PageLayout>
      {!isSignedIn &&
        <>
          <h1 className="front_title text-5xl
          font-semibold tracking-tight text-white
          sm:text-[5rem]">
            Speed<span className="text-rose-600">pasta</span>
          </h1>
          <div className="get_started flex flex-col
          gap-12 text-white text-3xl font-light
          items-center">
            <p>Test out your ability with code blocks</p>
            <SignInButton>
              <button className="get_started w-64 h-28
              bg-rose-500 rounded-3xl"
              disabled={false}>
                Login 
              </button>
            </SignInButton>
            <Link href="/test" className="get_started
            w-64 h-28 bg-rose-500 rounded-3xl flex
            items-center justify-center">
              Guest mode
            </Link>
          </div>
        </>}
      {!!isSignedIn &&
        <>
          <h1 className="front_title text-5xl
          font-semibold tracking-tight text-white
          sm:text-[5rem]">
            Speed<span className="text-rose-600">pasta</span>
          </h1>
          <div className="get_started flex flex-col
          gap-12 text-white text-3xl font-light
          items-center">
            <p>Test out your ability with code blocks</p>
            <Link href="/test" className="get_started
            w-64 h-28 bg-rose-500 rounded-3xl flex
            items-center justify-center">
              Begin
            </Link>
          </div>
        </>
      }
    </PageLayout>
  );
}
