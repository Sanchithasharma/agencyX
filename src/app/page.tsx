import Image from "next/image";
// import Login from '../app/authorization/login';
import SignUp from '../app/authorization/signup';


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      {/* <h1 className="text-brown-400">Agency X</h1> */}
      {/* <Login/> */}
      <SignUp/>
    </main>
  );
}
