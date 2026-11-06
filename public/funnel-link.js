// ELV-2095: the header button leads to the web funnel. Carry the landing page's UTM
// tags over to it, so the funnel keeps the visit's attribution.
const UTM_PREFIX = "utm_";

function forwardUtm(link) {
  const page = new URLSearchParams(window.location.search);
  const target = new URL(link.href);
  for (const [key, value] of page) {
    if (key.startsWith(UTM_PREFIX) && !target.searchParams.has(key)) {
      target.searchParams.set(key, value);
    }
  }
  link.href = target.toString();
}

document.querySelectorAll("[data-funnel-link]").forEach(forwardUtm);
