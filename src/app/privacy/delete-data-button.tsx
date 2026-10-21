"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteMyData } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

/** Simple confirm-then-delete control for the privacy page. */
export function DeleteDataButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <p className="rounded-lg bg-[#e9f6ee] px-3 py-2 text-sm text-[#1e7a46]">
        Deleted. This session now has a fresh, empty record.
      </p>
    );
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)} disabled={pending}>
        Delete my data
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete all data for this session?">
        <p className="text-sm text-mist">
          This erases your lesson progress, scores, scenario runs, planner notes and action items.
          It cannot be undone.
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="danger"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await deleteMyData();
                setOpen(false);
                setDone(true);
                router.refresh();
              })
            }
          >
            Yes, delete everything
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
