"use client";

import { useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function PilotRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const lastEarlyPayload = useRef<string | null>(null);

  async function send(stage: "email-started" | "full-enquiry") {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    data.set("form-name", "pilot-request");
    data.set("submission_stage", stage);
    if (!String(data.get("email") ?? "").trim()) return;

    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      setStatus("sent");
      setMessage("Local preview: this enquiry is ready to send once the Netlify preview is deployed.");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(
          Array.from(data.entries(), ([key, value]) => [key, String(value)]),
        ).toString(),
      });
      if (!response.ok) throw new Error(`Submission failed (${response.status})`);
      setStatus("sent");
      setMessage(stage === "full-enquiry" ? "Thanks — your enquiry has been sent." : "Thanks — we’ve received your email and will follow up.");
    } catch {
      setStatus("error");
      setMessage("We couldn’t send that just now. Please email hello@clevacado.co.za and we’ll help.");
    }
  }

  function handlePartialBlur() {
    const form = formRef.current;
    const email = form?.elements.namedItem("email");
    if (form && email instanceof HTMLInputElement && email.validity.valid && email.value) {
      const fields = ["email", "name", "company", "message"];
      const signature = fields.map((field) => String(new FormData(form).get(field) ?? "").trim()).join("\u001f");
      if (signature === lastEarlyPayload.current) return;
      lastEarlyPayload.current = signature;
      void send("email-started");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    void send("full-enquiry");
  }

  return (
    <form ref={formRef} name="pilot-request" method="post" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit} className="mt-9 space-y-4 text-left">
      <input type="hidden" name="form-name" value="pilot-request" />
      <div className="hidden" aria-hidden="true"><label>Leave this empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="block text-sm font-medium text-white/75">Email address <span className="text-[#B7FF5A]">*</span>
        <input required type="email" name="email" autoComplete="email" onBlur={handlePartialBlur} className="mt-2 min-h-12 w-full rounded-2xl border border-white/15 bg-white/[0.05] px-4 text-base text-white outline-none transition focus:border-[#B7FF5A] focus:ring-2 focus:ring-[#B7FF5A]/20" placeholder="you@company.com" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-white/75">Name
          <input name="name" autoComplete="name" onBlur={handlePartialBlur} className="mt-2 min-h-12 w-full rounded-2xl border border-white/15 bg-white/[0.05] px-4 text-base text-white outline-none transition focus:border-[#B7FF5A]" />
        </label>
        <label className="block text-sm font-medium text-white/75">Company
          <input name="company" autoComplete="organization" onBlur={handlePartialBlur} className="mt-2 min-h-12 w-full rounded-2xl border border-white/15 bg-white/[0.05] px-4 text-base text-white outline-none transition focus:border-[#B7FF5A]" />
        </label>
      </div>
      <label className="block text-sm font-medium text-white/75">What would you like to explore?
        <textarea name="message" rows={4} onBlur={handlePartialBlur} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 text-base text-white outline-none transition focus:border-[#B7FF5A]" />
      </label>
      <input type="hidden" name="submission_stage" value="full-enquiry" />
      <button disabled={status === "sending"} type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#B7FF5A] px-7 font-bold text-[#040606] transition hover:-translate-y-0.5 disabled:opacity-60">{status === "sending" ? "Sending…" : "Send enquiry"}</button>
      <p aria-live="polite" role={status === "error" ? "alert" : "status"} className="min-h-6 text-sm text-white/60">{message}</p>
      <p className="text-xs leading-relaxed text-white/38">Email is the only required field. If you leave the email field after entering a valid address, we’ll receive an early follow-up so we can help even if you don’t finish the form. The form sends your details to ClevaCado.</p>
    </form>
  );
}
