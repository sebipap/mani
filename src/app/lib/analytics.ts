declare global {
  interface Window {
    analytics: any;
  }
}
type TrackEvent = "BUTTON_CLICKED";

export function track(event: TrackEvent, properties?: any) {
  console.log("track", event, properties);
  if (!window?.analytics) return;
  window.analytics.track(event, properties);
}

export function identify(userId: string, traits?: any) {
  console.log("identify", userId, traits);
  if (!window?.analytics) return;
  window.analytics.identify(userId, traits);
}
