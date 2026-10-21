"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerAccount, signIn, signOut, deleteMyData } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/fields";
import { Callout } from "@/components/ui/callout";
import { Modal } from "@/components/ui/modal";

/**
 * Account controls. All mutations go through server actions; the server
 * resolves the profile from the session cookie, never from client input.
 */

type Mode = "guest" | "signed-in";

export function AccountCard({ known }: { known: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<"register" | "signin">("register");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const mode: Mode = known ? "signed-in" : "guest";

  async function submitRegistration(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    // Client-side pre-check for fast feedback only, the server re-validates.
    if (!displayName.trim() || displayName.trim().length < 2) {
      setError("Please enter a display name (at least 2 characters).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    const result = await registerAccount({ displayName, email, password });
    if (!result.ok) {
      setError(result.error ?? "Registration failed.");
      return;
    }
    setNotice("Account created. Any guest progress from this browser was carried over.");
    setPassword("");
    router.refresh();
  }

  async function submitSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await signIn({ email, password });
    if (!result.ok) {
      setError(result.error ?? "Sign in failed.");
      return;
    }
    setNotice("Signed in. Any guest progress from this browser was merged into your account.");
    setPassword("");
    router.refresh();
  }

  function doSignOut() {
    setError(null);
    startTransition(async () => {
      await signOut();
      setNotice("Signed out. The browser cookie was cleared.");
      router.refresh();
    });
  }

  function doDelete() {
    setError(null);
    startTransition(async () => {
      await deleteMyData();
      setConfirmDelete(false);
      setNotice("All data tied to this session has been deleted.");
      router.refresh();
    });
  }

  if (notice) {
    return (
      <Callout tone="positive" title="Done">
        {notice}
      </Callout>
    );
  }

  return (
    <div>
      {error ? (
        <div role="alert" className="mb-4 rounded-lg bg-[#f9ede4] px-3 py-2 text-sm text-[#a3532b]">
          {error}
        </div>
      ) : null}

      {mode === "guest" ? (
        <>
          <div role="tablist" aria-label="Choose account action" className="flex gap-2">
            <button
              role="tab"
              aria-selected={tab === "register"}
              onClick={() => setTab("register")}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${tab === "register" ? "bg-forest text-sage" : "bg-forest-100 text-forest hover:bg-forest-100/70"}`}
            >
              Register
            </button>
            <button
              role="tab"
              aria-selected={tab === "signin"}
              onClick={() => setTab("signin")}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${tab === "signin" ? "bg-forest text-sage" : "bg-forest-100 text-forest hover:bg-forest-100/70"}`}
            >
              Sign in
            </button>
          </div>

          {tab === "register" ? (
            <form onSubmit={submitRegistration} className="mt-4 flex flex-col gap-4" noValidate>
              <Field label="Display name" htmlFor="displayName" required hint="Shown only to you.">
                <TextInput
                  id="displayName"
                  name="displayName"
                  autoComplete="nickname"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </Field>
              <Field label="Email" htmlFor="email" required hint="Used only to sign in to this local instance.">
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="Password" htmlFor="password" required hint="At least 8 characters. Stored as a salted scrypt hash.">
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <div>
                <Button type="submit" disabled={pending}>Create account</Button>
              </div>
            </form>
          ) : (
            <form onSubmit={submitSignIn} className="mt-4 flex flex-col gap-4" noValidate>
              <Field label="Email" htmlFor="signin-email" required>
                <TextInput
                  id="signin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="Password" htmlFor="signin-password" required>
                <TextInput
                  id="signin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <div>
                <Button type="submit" disabled={pending}>Sign in</Button>
              </div>
            </form>
          )}
        </>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={doSignOut} disabled={pending}>
            Sign out
          </Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)} disabled={pending}>
            Delete my data
          </Button>
        </div>
      )}

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete all data for this session?">
        <p className="text-sm text-mist">
          This permanently erases your lesson progress, knowledge check history, scenario runs and
          action plan items for this browser session. This cannot be undone.
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="danger" onClick={doDelete} disabled={pending}>
            Yes, delete everything
          </Button>
          <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={pending}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
