import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-[400px] overflow-hidden border border-zinc-200 bg-white outline outline-1 -outline-offset-1 outline-zinc-200">
        <SignIn
          withSignUp
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-in"
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: 'mx-auto w-full',
              card: 'border-0 shadow-none',
              cardBox: 'border-0 shadow-none',
              modalContent: 'shadow-none',
              footerAction: 'hidden',
              footerActionText: 'hidden',
              footerActionLink: 'hidden',
            },
          }}
        />
      </div>
    </div>
  );
}
