export const money = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", maximumFractionDigits: 0,
}).format(Number(value || 0));
export const date = (value) => value ? new Intl.DateTimeFormat("es-CO", {
  day: "2-digit", month: "short", year: "numeric",
}).format(new Date(value)) : "—";
export const initials = (value = "") => value.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
