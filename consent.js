(function () {
  'use strict';

  var GA4_ID = 'G-YJZNM3BYVC';
  var CONSENT_COOKIE = 'kitsos_consent';
  var COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
  var analyticsLoaded = false;

  function readCookie() {
    var prefix = CONSENT_COOKIE + '=';
    var cookies = document.cookie ? document.cookie.split(';') : [];
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(prefix) === 0) return cookie.slice(prefix.length);
    }
    return null;
  }

  function readConsent() {
    var saved = readCookie();
    if (saved === 'granted' || saved === 'denied') return saved;

    try {
      saved = localStorage.getItem(CONSENT_COOKIE);
      if (saved === 'granted' || saved === 'denied') {
        writeConsent(saved);
        localStorage.removeItem(CONSENT_COOKIE);
        return saved;
      }
    } catch (error) {}

    return null;
  }

  function writeConsent(value) {
    document.cookie = CONSENT_COOKIE + '=' + value +
      '; Max-Age=' + COOKIE_MAX_AGE +
      '; Path=/; Domain=kitsos.net; SameSite=Lax; Secure';
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID);

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(script);
  }

  function initConsent() {
    var banner = document.querySelector('.consent');
    var accept = document.querySelector('.consent-accept');
    var decline = document.querySelector('.consent-decline');
    var saved = readConsent();

    if (saved === 'granted') loadAnalytics();
    else if (!saved && banner) banner.classList.add('show');

    if (accept) {
      accept.addEventListener('click', function () {
        writeConsent('granted');
        loadAnalytics();
        if (banner) banner.classList.remove('show');
      });
    }

    if (decline) {
      decline.addEventListener('click', function () {
        writeConsent('denied');
        if (banner) banner.classList.remove('show');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsent);
  } else {
    initConsent();
  }
})();
