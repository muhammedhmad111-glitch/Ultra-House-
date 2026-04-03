import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface AnalyticsSettings {
  metaPixelId?: string;
  tiktokPixelId?: string;
  ga4MeasurementId?: string;
}

class AnalyticsService {
  private settings: AnalyticsSettings = {};
  private initialized = false;

  async init() {
    if (this.initialized) return;
    
    try {
      const docRef = doc(db, 'settings', 'store');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.settings = {
          metaPixelId: data.metaPixelId,
          tiktokPixelId: data.tiktokPixelId,
          ga4MeasurementId: data.ga4MeasurementId,
        };
        this.loadScripts();
        this.initialized = true;
      }
    } catch (error) {
      console.error("Failed to initialize analytics:", error);
    }
  }

  private loadScripts() {
    // Meta Pixel
    if (this.settings.metaPixelId) {
      this.loadMetaPixel(this.settings.metaPixelId);
    }

    // TikTok Pixel
    if (this.settings.tiktokPixelId) {
      this.loadTiktokPixel(this.settings.tiktokPixelId);
    }

    // GA4
    if (this.settings.ga4MeasurementId) {
      this.loadGA4(this.settings.ga4MeasurementId);
    }
  }

  private loadMetaPixel(id: string) {
    if (typeof window === 'undefined') return;
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return; n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    (window as any).fbq('init', id);
    (window as any).fbq('track', 'PageView');
  }

  private loadTiktokPixel(id: string) {
    if (typeof window === 'undefined') return;
    (function(w: any, d: any, t: any) {
      w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "trackSelf", "untrackSelf"], ttq.setAndDefer = function(t: any, e: any) { t[e] = function() { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]); ttq.instance = function(t: any) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e }, ttq.load = function(e: any, n: any) { var i = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = i, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {}; var o = d.createElement("script"); o.type = "text/javascript", o.async = !0, o.src = i + "?sdkid=" + e + "&lib=" + t; var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(o, a) };
      ttq.load(id);
      ttq.page();
    })(window, document, 'ttq');
  }

  private loadGA4(id: string) {
    if (typeof window === 'undefined') return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) { (window as any).dataLayer.push(arguments); }
    (window as any).gtag = gtag;
    gtag('js', new Date());
    gtag('config', id);
  }

  trackEvent(eventName: string, params: any = {}) {
    if (!this.initialized) return;

    // Meta
    if (this.settings.metaPixelId && (window as any).fbq) {
      (window as any).fbq('track', eventName, params);
    }

    // TikTok
    if (this.settings.tiktokPixelId && (window as any).ttq) {
      (window as any).ttq.track(eventName, params);
    }

    // GA4
    if (this.settings.ga4MeasurementId && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
  }

  trackPageView() {
    if (!this.initialized) return;
    
    if (this.settings.metaPixelId && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
    if (this.settings.tiktokPixelId && (window as any).ttq) {
      (window as any).ttq.page();
    }
    // GA4 handles pageview automatically on config usually, but we can be explicit
    if (this.settings.ga4MeasurementId && (window as any).gtag) {
      (window as any).gtag('event', 'page_view');
    }
  }
}

export const analyticsService = new AnalyticsService();
