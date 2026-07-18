"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formId) {
      setStatus("error");
      setErrorMessage(
        "Form endpoint not configured. Add NEXT_PUBLIC_FORMSPREE_FORM_ID to .env.local",
      );
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("error");
      setErrorMessage("Please fill in name, email, and message.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    data.set("name", name);
    data.set("email", email);
    data.set("message", message);

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      const json = (await res.json().catch(() => null)) as {
        error?: string;
        errors?: { message: string }[];
      } | null;

      if (!res.ok) {
        const msg =
          json?.errors?.map((err) => err.message).join(", ") ||
          json?.error ||
          "Something went wrong. Please try again.";
        setStatus("error");
        setErrorMessage(msg);
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="n-card-inner p-5 sm:p-6">
        <span className="coord-label block mb-2">STATUS / OK</span>
        <p className="n-heading text-base mb-2">MESSAGE SENT</p>
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          className="n-btn mt-5"
          onClick={() => setStatus("idle")}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="n-field">
          <span className="n-field-label">
            Name <span className="n-field-req">*</span>
          </span>
          <input
            className="n-input"
            type="text"
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Your name"
            disabled={status === "submitting"}
          />
        </label>

        <label className="n-field">
          <span className="n-field-label">
            Email <span className="n-field-req">*</span>
          </span>
          <input
            className="n-input"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            disabled={status === "submitting"}
          />
        </label>
      </div>

      <label className="n-field">
        <span className="n-field-label">
          Message <span className="n-field-req">*</span>
        </span>
        <textarea
          className="n-input n-textarea"
          name="message"
          required
          maxLength={2000}
          rows={5}
          placeholder="What are you building?"
          disabled={status === "submitting"}
        />
      </label>

      {/* Formspree honeypot — leave empty */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 pointer-events-none h-0 w-0"
        aria-hidden
      />

      {status === "error" && errorMessage && (
        <p className="text-xs n-mono" style={{ color: "var(--accent)" }}>
          {errorMessage}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 pt-1">
        <span className="coord-label hidden sm:inline">FORM / CONTACT</span>
        <button
          type="submit"
          className="n-btn n-btn-primary"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
