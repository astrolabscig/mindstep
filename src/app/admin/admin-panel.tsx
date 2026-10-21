"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, adminLogout, adminSetLessonPublished, adminVerifyService } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Field, TextInput, Select, TextArea } from "@/components/ui/fields";
import { Card, CardBody } from "@/components/ui/card";
import { Callout } from "@/components/ui/callout";

/**
 * Admin client controls. Mutations go to server actions which re-check the
 * admin cookie server-side; the UI only reflects decisions already made
 * by the server (router.refresh after each action).
 */

export function AdminPanel({
  mode,
  lessonId,
  lessonTitle,
  published,
  serviceId,
  serviceName,
}: {
  mode: "login" | "panel" | "lesson-row" | "verify-row";
  lessonId?: string;
  lessonTitle?: string;
  published?: boolean;
  serviceId?: string;
  serviceName?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"verified" | "awaiting-verification">("verified");
  const [message, setMessage] = useState<string | null>(null);

  if (mode === "login") {
    async function submitLogin(e: React.FormEvent) {
      e.preventDefault();
      setError(null);
      const result = await adminLogin({ key });
      if (!result.ok) {
        setError(result.error ?? "Sign-in failed.");
        return;
      }
      setKey("");
      router.refresh();
    }
    return (
      <form onSubmit={submitLogin} className="mt-6 max-w-md" noValidate>
        <Card className="mt-6">
          <CardBody className="pt-5">
            <h2 className="text-lg font-semibold text-forest">Sign in as moderator</h2>
            <p className="mt-1 text-sm text-mist">
              Enter the shared admin key issued by the project lead. Sessions last 8 hours.
            </p>
            {error ? (
              <div role="alert" className="mt-3 rounded-lg bg-[#f9ede4] px-3 py-2 text-sm text-[#a3532b]">
                {error}
              </div>
            ) : null}
            <div className="mt-4">
              <Field label="Admin key" htmlFor="admin-key" required>
                <TextInput
                  id="admin-key"
                  type="password"
                  autoComplete="off"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Button type="submit" disabled={pending}>Enter moderation area</Button>
            </div>
          </CardBody>
        </Card>
      </form>
    );
  }

  if (mode === "panel") {
    return (
      <div className="mt-4">
        <Button variant="ghost" disabled={pending} onClick={() => startTransition(async () => {
          await adminLogout();
          router.refresh();
        })}>
          Sign out of moderation
        </Button>
      </div>
    );
  }

  if (mode === "lesson-row") {
    return (
      <Button
        size="sm"
        variant={published ? "quiet" : "secondary"}
        disabled={pending}
        className="shrink-0"
        aria-label={published ? `Unpublish lesson: ${lessonTitle ?? lessonId}` : `Publish lesson: ${lessonTitle ?? lessonId}`}
        onClick={() =>
          startTransition(async () => {
            await adminSetLessonPublished(lessonId ?? "", !published);
            router.refresh();
          })
        }
      >
        {published ? "Unpublish" : "Publish"}
      </Button>
    );
  }

  // verify-row
  async function submitVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const result = await adminVerifyService({ serviceId, status, note });
    if (!result.ok) {
      setError("Could not record the verification, the note must be at least 5 characters.");
      return;
    }
    setNote("");
    setMessage("Verification recorded and logged.");
    router.refresh();
  }

  return (
    <form onSubmit={submitVerify} className="flex flex-col gap-3 rounded-lg bg-forest-100/40 p-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
        <Field label="Status" htmlFor={`verify-status-${serviceId}`}>
          <Select
            id={`verify-status-${serviceId}`}
            value={status}
            onChange={(e) => setStatus(e.target.value === "awaiting-verification" ? "awaiting-verification" : "verified")}
          >
            <option value="verified">verified</option>
            <option value="awaiting-verification">awaiting-verification</option>
          </Select>
        </Field>
        <Field
          label="Evidence note (what you checked, and where)"
          htmlFor={`verify-note-${serviceId}`}
        >
          <TextArea
            id={`verify-note-${serviceId}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Re-checked ${serviceName ?? "this listing"} against its cited source on …`}
            className="min-h-16"
          />
        </Field>
      </div>
      {error ? (
        <p role="alert" className="text-xs font-medium text-[#a3532b]">{error}</p>
      ) : null}
      {message ? (
        <Callout tone="positive" title="Recorded">{message}</Callout>
      ) : null}
      <div>
        <Button type="submit" size="sm" variant="secondary" disabled={pending}>
          Record verification
        </Button>
      </div>
    </form>
  );
}
