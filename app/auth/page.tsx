import type { Metadata } from "next";
import SignInButton from "../components/SignInButton";

export const metadata: Metadata = {
  title: "Sign In | PeerProducts",
  description: "Sign in to PeerProducts to share and discover genuine product recommendations and reviews.",
};

export default function AuthPage() {
  return (
    <div className="w-screen h-[80vh] flex justify-center items-center">
      <SignInButton />
    </div>
  );
}
