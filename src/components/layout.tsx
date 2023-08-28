import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  const { isSignedIn } = useUser();

  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="absolute top-0 w-screen bg-black h-20">
	  {!isSignedIn && <div className="text-white">
	    <SignInButton />
	  </div>}
	  {!!isSignedIn && <div className="text-white">
	    <SignOutButton />
	  </div>}	
	</div>
	<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
	  {props.children}
	</div>
      </main>
  );
};

