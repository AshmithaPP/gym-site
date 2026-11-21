import { SITE } from "./site";

export const whatsappNumber = () => {
  const raw = (SITE.whatsapp || "").replace(/\D/g, "");
  if (!raw) return "";
  return raw.length === 10 ? `91${raw}` : raw;
};

export const whatsappLink = (text = "") => {
  const wa = whatsappNumber();
  if (!wa) return null;
  return `https://wa.me/${wa}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
};

/**
 * Submit an enquiry to the backend API route.
 * Dispatches both the gym notification and the sender confirmation email.
 */
export async function submitEnquiry(payload) {
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: result.error || "Submission failed" };
    }
    return { success: true, ...result };
  } catch (err) {
    return { success: false, error: err.message || "Network error" };
  }
}

/**
 * Fallback enquiry handler (opens WhatsApp or mailto)
 */
export function sendEnquiry({ subject, lines }) {
  const text = [subject, ...lines.filter(Boolean)].join("\n");
  const wa = whatsappLink(text);
  if (wa) {
    window.open(wa, "_blank", "noopener,noreferrer");
    return "whatsapp";
  }
  if (SITE.email) {
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    return "email";
  }
  return null;
}
