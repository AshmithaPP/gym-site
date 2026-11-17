import { SITE } from "./site";

export const whatsappNumber = () => (SITE.whatsapp || "").replace(/\D/g, "");

export const whatsappLink = (text = "") => {
  const wa = whatsappNumber();
  if (!wa) return null;
  return `https://wa.me/${wa}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
};

/*
  There is no backend: an enquiry opens WhatsApp (SITE.whatsapp) or the visitor's mail app
  (SITE.email) with the message written out. Returns how it was sent, or null when neither
  is configured in lib/site.js — callers then tell the visitor instead of pretending to send.
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
