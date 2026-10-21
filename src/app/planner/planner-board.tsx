"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { upsertAction, toggleAction, deleteAction } from "@/app/actions";
import type { ActionItem } from "@/lib/store/types";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/progress";
import { Field, TextArea, Select, TextInput } from "@/components/ui/fields";
import { Modal } from "@/components/ui/modal";

const KIND_LABELS: Record<ActionItem["kind"], string> = {
  "identify-trusted-person": "Identify a trusted person",
  "prepare-questions": "Prepare questions for a health worker",
  "plan-conversation": "Plan a conversation",
  "revisit-lesson": "Revisit a card",
  reflection: "Short reflection",
  "custom-goal": "Custom goal",
};

export function PlannerBoard({ items }: { items: ActionItem[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [kind, setKind] = useState<ActionItem["kind"]>("prepare-questions");
  const [editing, setEditing] = useState<ActionItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetail, setEditDetail] = useState("");
  const [editKind, setEditKind] = useState<ActionItem["kind"]>("prepare-questions");
  const reduced = useReducedMotion();

  function validate(t: string): string | null {
    if (t.trim().length < 3) return "Give this action a name (at least 3 characters).";
    if (t.length > 120) return "Keep the name under 120 characters.";
    return null;
  }

  function add() {
    const v = validate(title);
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await upsertAction({ kind, title: title.trim(), detail: detail.trim() || undefined });
      if (!res.ok) {
        setError("Could not save this action. Check length limits and try again.");
        return;
      }
      setTitle("");
      setDetail("");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Items */}
      <section aria-labelledby="items-h">
        <h2 id="items-h" className="text-lg font-semibold text-forest">Your actions ({items.filter((i) => !i.done).length} open)</h2>
        {items.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No actions yet"
              description="An action is a small, realistic step. Start with a template, or write your own. You can edit, complete, or delete them any time."
              art="plan-steps"
            />
          </div>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  data-testid="planner-item"
                >
                  <Card className={item.done ? "opacity-70" : undefined}>
                    <CardBody className="pt-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          aria-label={`Mark “${item.title}” ${item.done ? "not done" : "done"}`}
                          checked={item.done}
                          onChange={() => startTransition(async () => void (await toggleAction(item.id)))}
                          className="mt-1 h-5 w-5 accent-forest-600"
                          data-testid="planner-toggle"
                        />
                        <div className="min-w-0 flex-1">
                          <p className={"text-[15px] font-medium text-forest " + (item.done ? "line-through" : "")} data-testid="planner-title">
                            {item.title}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <Badge tone="neutral">{KIND_LABELS[item.kind]}</Badge>
                            <span className="text-xs text-mist">added {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                          </div>
                          {item.detail ? (
                            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-mist">{item.detail}</p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(item);
                              setEditTitle(item.title);
                              setEditDetail(item.detail);
                              setEditKind(item.kind);
                            }}
                            className="min-h-9 rounded-md px-2 text-sm text-quietblue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => startTransition(async () => void (await deleteAction(item.id)))}
                            className="min-h-9 rounded-md px-2 text-sm text-incorrect hover:underline"
                            data-testid="planner-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
        {pending ? <p className="mt-2 text-xs text-mist" role="status">Saving…</p> : null}
      </section>

      {/* Add form */}
      <aside>
        <Card>
          <CardBody className="pt-5">
            <h2 className="font-semibold text-forest">Add a practical action</h2>
            <p className="mt-1 text-xs leading-relaxed text-mist">
              Templates are based on the cards and conversations. Nothing here is prescribed as treatment.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              <Field label="Type" htmlFor="planner-kind">
                <Select id="planner-kind" value={kind} onChange={(e) => setKind(e.target.value as ActionItem["kind"])}>
                  {Object.entries(KIND_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Name" htmlFor="planner-title" error={error ?? undefined} required hint="What exactly will you do?">
                <TextInput
                  id="planner-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Walk to the clinic with Efua"
                  aria-describedby={error ? "planner-title-error" : undefined}
                  maxLength={140}
                />
              </Field>
              <Field label="Details (optional)" htmlFor="planner-detail">
                <TextArea
                  id="planner-detail"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="When, where, with whom, or the actual questions you want to ask."
                  maxLength={2000}
                />
              </Field>
              <Button onClick={add} disabled={pending} data-testid="planner-add">
                Add action
              </Button>
            </div>
          </CardBody>
        </Card>
      </aside>

      {/* Edit modal */}
      {editing ? (
        <Modal open onClose={() => setEditing(null)} title="Edit action">
          <div className="flex flex-col gap-3">
            <Field label="Type" htmlFor="edit-kind">
              <Select id="edit-kind" value={editKind} onChange={(e) => setEditKind(e.target.value as ActionItem["kind"])}>
                {Object.entries(KIND_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Name" htmlFor="edit-title" required>
              <TextInput id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} maxLength={140} />
            </Field>
            <Field label="Details (optional)" htmlFor="edit-detail">
              <TextArea id="edit-detail" value={editDetail} onChange={(e) => setEditDetail(e.target.value)} maxLength={2000} />
            </Field>
            <p className="text-xs text-mist" role="alert" data-testid="edit-validation">{editTitle.trim().length < 3 ? "Name must be at least 3 characters." : ""}</p>
            <Button
              disabled={editTitle.trim().length < 3 || pending}
              onClick={() =>
                startTransition(async () => {
                  await upsertAction({ actionId: editing.id, kind: editKind, title: editTitle.trim(), detail: editDetail.trim() || undefined });
                  setEditing(null);
                })
              }
            >
              Save changes
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
