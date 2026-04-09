export const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(value || 0);
export const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
export const formatConfidence = (value) => `${((value || 0) * 100).toFixed(1)}% confidence`;
export const toTitleCase = (value = "") => value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
