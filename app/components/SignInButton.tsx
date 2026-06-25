"use client";

import { SignIn } from "@/lib/auth-action";

export default function SignInButton() {
  return (
    <button
      onClick={() => SignIn()}
      className="cursor-pointer px-4 py-2 border border-white hover:bg-white hover:text-black rounded-sm text-md font-medium transition-colors"
    >
      Sign In With Google
    </button>
  );
}
