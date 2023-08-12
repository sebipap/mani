declare global {
  interface Window {
    analytics: any;
  }
}
type TrackEvent = "BUTTON_CLICKED" | "PAGE_VIEWED";

export function track(event: TrackEvent, properties?: any) {
  if (!window?.analytics) return;
  window.analytics.track(event, properties);
}

export function identify(userId: string, traits?: any) {
  if (!window?.analytics) return;
  window.analytics.identify(userId, traits);
}

export function page(name: string, properties?: any) {
  if (!window?.analytics) return;
  window.analytics.page(name, properties);
}
