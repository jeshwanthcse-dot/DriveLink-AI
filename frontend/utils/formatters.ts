/**
 * Application formatting utility functions
 */

/**
 * Formats an ISO date string into a human-readable format.
 * Example: 2026-06-16T08:00:00Z -> Jun 16, 2026, 8:00 AM
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return "N/A";
  }
}

/**
 * Formats a number to USD currency representation.
 * Example: 620 -> $620.00
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Formats distance with appropriate units.
 * Example: 385.5 -> 385.5 km
 */
export function formatDistance(distance: number): string {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(distance)} km`;
}

/**
 * Formats weight with appropriate units.
 * Example: 1250 -> 1,250 kg
 */
export function formatWeight(weight: number): string {
  return `${new Intl.NumberFormat("en-US").format(weight)} kg`;
}

/**
 * Maps delivery status to standard user-friendly text.
 */
export function formatStatus(status: string): string {
  switch (status) {
    case "pending":
      return "Pending Match";
    case "accepted":
      return "Accepted";
    case "in_transit":
      return "In Transit";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    case "draft":
      return "Draft";
    case "posted":
      return "Posted";
    case "matched":
      return "Matched";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
