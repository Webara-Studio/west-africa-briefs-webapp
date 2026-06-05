"use client";

import { useState, type FormEvent } from "react";

export function NewsletterSignup() {
  const [status, setStatus] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ type: "success", message: "You're in! Welcome to West Africa Briefs." });
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus({ type: "error", message: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again later." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-card border border-border-subtle bg-bg-card p-6 sm:p-8">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-accent-gold mb-3">
          Weekly Newsletter
        </h2>
        <p className="text-accent-cream/70 text-sm sm:text-base mb-6 leading-relaxed">
          Get the weekly digest every Sunday. All 7 daily briefs compiled into
          one engaging read. No spam, unsubscribe anytime.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-2.5 rounded-button bg-bg-primary border border-border-subtle text-accent-cream placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-button bg-accent-gold text-bg-primary font-semibold text-sm hover:bg-accent-gold-dark transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        {status ? (
          <p className={`text-xs mt-3 ${status.type === "success" ? "text-accent-gold" : "text-red-400"}`}>
            {status.message}
          </p>
        ) : (
          <p className="text-text-muted text-xs mt-3">
            Free. Delivered every Sunday morning.
          </p>
        )}
      </div>
    </div>
  );
}
