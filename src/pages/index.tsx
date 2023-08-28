import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { user, isSignedIn, isLoaded } = useUser();

  return (
    <PageLayout>
      <h1 className="front_title text-5xl font-semibold tracking-tight text-white sm:text-[5rem]">
        Speed<span className="text-rose-600">pasta</span>
      </h1>
      {!isSignedIn &&
        <div className="get_started flex flex-col gap-12 text-white text-3xl font-light items-center">
          <p>Test out your ability to churn out copypastas</p>
          <SignInButton>
            <button className="get_started w-64 h-28 bg-rose-500 rounded-3xl">Get Started</button>
          </SignInButton>
        </div>}
    </PageLayout>
  );
}
