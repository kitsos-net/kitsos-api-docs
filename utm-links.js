(function () {
  'use strict';

  var UTM_SOURCE = 'docs.api.kitsos.net';
  var CONTACT_URL = 'https://kitsos.net/contact';
  var TERMS_URL = 'https://kitsos.net/terms';

  function withUtmSource(rawUrl) {
    if (!rawUrl || rawUrl.charAt(0) === '#') return rawUrl;

    var url;
    try {
      url = new URL(rawUrl, window.location.href);
    } catch (error) {
      return rawUrl;
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') return rawUrl;
    url.searchParams.set('utm_source', UTM_SOURCE);
    return url.href;
  }

  function normalizeSwaggerLink(link) {
    var contact = link.closest('.swagger-ui .info__contact');
    if (contact) {
      var contactLinks = Array.prototype.slice.call(contact.querySelectorAll('a'));
      var contactIndex = contactLinks.indexOf(link);

      if (contactIndex === 0) {
        link.textContent = 'Kitsos Support';
        link.href = CONTACT_URL;
      } else if (contactIndex === 1 || /website/i.test(link.textContent)) {
        link.textContent = ' - Website';
        link.href = CONTACT_URL;
      }
    }

    if (link.closest('.swagger-ui .info__license')) {
      link.textContent = 'Proprietary';
      link.href = TERMS_URL;
    }

    if (link.closest('.swagger-ui .info__tos')) {
      link.href = TERMS_URL;
    }
  }

  function updateLink(link) {
    normalizeSwaggerLink(link);
    var updated = withUtmSource(link.getAttribute('href'));
    if (updated && updated !== link.getAttribute('href')) link.setAttribute('href', updated);
  }

  function updateFormAction(control) {
    var updated = withUtmSource(control.getAttribute('formaction'));
    if (updated && updated !== control.getAttribute('formaction')) {
      control.setAttribute('formaction', updated);
    }
  }

  function updateLinks(root) {
    if (root.nodeType !== 1 && root.nodeType !== 9) return;

    if (root.matches && root.matches('a[href]')) updateLink(root);
    if (root.matches && root.matches('button[formaction], input[formaction]')) updateFormAction(root);

    root.querySelectorAll('a[href]').forEach(updateLink);
    root.querySelectorAll('button[formaction], input[formaction]').forEach(updateFormAction);
  }

  function initUtmLinks() {
    updateLinks(document);

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(updateLinks);
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUtmLinks);
  } else {
    initUtmLinks();
  }
})();
