import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Portfolio from "./components/Portfolio";
import UsernameGate from "./components/UsernameGate";

export default function App() {
  const [username, setUsername] = useState<string>("");

  if (!username) {
    return (
      <>
        <UsernameGate onEnter={setUsername} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Portfolio username={username} />
      <Toaster />
    </>
  );
}
