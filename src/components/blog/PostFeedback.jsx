"use client";

import { votePost } from "@/services/feedback/actions";
import { useActionState } from "react";

const number = new Intl.NumberFormat("en-US");

const vote =
  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)] disabled:cursor-wait";
const voteOff = "border-[var(--line)] text-[var(--ink)]";
const voteOn = "border-[var(--signal)] bg-[var(--surface)] text-[var(--signal)]";

function ThumbIcon({ down = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={down ? "rotate-180" : undefined}
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

/**
 * Reads and "Was this helpful?" under a post. `initial` is
 * `{ reads, likes, dislikes, myVote }` from getPostFeedback(). A plain form posting
 * to a server action, so voting works before (and without) JavaScript too.
 */
export default function PostFeedback({ slug, initial }) {
  const [state, formAction, pending] = useActionState(votePost, initial);

  const button = (value, label, count) => {
    const pressed = state.myVote === value;
    return (
      <button
        type="submit"
        name="value"
        value={value}
        aria-pressed={pressed}
        disabled={pending}
        className={`${vote} ${pressed ? voteOn : voteOff}`}
      >
        <ThumbIcon down={value === "DISLIKE"} />
        <span className="sr-only">{label}</span>
        <span className="tabular-nums">{number.format(count)}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
      <form action={formAction} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="slug" value={slug} />
        <p className="mr-1 font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
          Was this helpful?
        </p>
        {button("LIKE", "Yes, helpful", state.likes)}
        {button("DISLIKE", "No, not helpful", state.dislikes)}
        <span aria-live="polite" className="text-sm text-[var(--slate)]">
          {state.voted ? (state.myVote ? "Thanks for the feedback" : "Vote removed") : ""}
        </span>
      </form>
      <p className="font-mono text-xs text-[var(--slate)]">
        {number.format(state.reads)} {state.reads === 1 ? "read" : "reads"}
      </p>
    </div>
  );
}
