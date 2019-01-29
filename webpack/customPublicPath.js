/* global __webpack_public_path__ __HOST__ __PORT__ */
/* eslint no-global-assign: 0 camelcase: 0 */

if (process.env.NODE_ENV === 'production') {
  __webpack_public_path__ = chrome.extension.getURL('/js/');
} else {
  // In development mode,
  // the iframe of injectpage cannot get correct path,
  // it need to get parent page protocol.
  __webpack_public_path__ = `https://${__HOST__}:${__PORT__}/js/`;
}
