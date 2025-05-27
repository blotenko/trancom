import Image from "next/image";
import { auth0 } from "../lib/auth0";


export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();

  // If no session, show sign-up and login buttons
  if (!session) {
    return (
      <main className="w-full">
        <Image
                src="/Trancom_Logo-03.svg"
                alt="Trancom Logo"
                width={400}
                height={180}
                className="mx-auto"
        />
        <h1 className=" flex mb-5 justify-center w-full text-4xl font-bold mb-4">
          Hello, Trancom!
        </h1>
        <div className="flex justify-center w-full">
          <a href="/auth/login?screen_hint=signup" className="mr-5">
            <button className="py-3 px-8 rounded-3xl text-xl font-bold bg-blue-300">
              Sign up
            </button>
          </a>
          <a href="/auth/login">
            <button className="py-3 px-8 rounded-3xl text-xl font-bold bg-blue-300">
              Log in
            </button>
          </a>
        </div>
      </main>
    );
  }

  // If session exists, show a welcome message and logout button
  return (
    <main className="w-full"> 
      <Image
        src="/Trancom_Logo-03.svg"
        alt="Trancom Logo"
        width={400}
        height={180}
        className="mb-8 mx-auto"
      />

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">
          Hello, Trancom!
        </h1>
        < p className="text-lg text-gray-600 mb-4">
          Welcome to your admin panel.
        </p>
        <a
          href="/auth/logout"
          className="inline-flex items-center py-1 px-3.5 rounded-3xl text-sm font-bold bg-blue-300"
        >
          <button>Log out</button>
        </a>
      </div> 
    </main>
  );
}