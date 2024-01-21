"use client";
import signUp from "../../firebase/signup";
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email === "" || !validateEmail(email)) {
      alert('Please enter a valid email')
      return;
    }

    if (password === "") {
      alert('Please enter a password')
      return;
    }

    await handleSignUpApi()
  }

  const handleSignUpApi = async () => {
    try {
      const { result, error } = await signUp(email, password);
      if (result) {
        return router.push("/")
      }
    }
    catch (error) {
      console.error(error)
    }
  }

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nline-email"
              >
                Email
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="inline-email"
                name="inline-email"
                type="email"
                placeholder="Please enter your email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                }}
              />
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="inline-password"
              >
                Password
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="inline-password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                }}
              />
            </div>
          </div>

          <div className="md:flex md:items-center">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button
                className="shadow bg-brown-200 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>{" "}
      </div>
    </main>
  );
}
