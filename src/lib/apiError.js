// Turns an axios failure into something a researcher can act on.
//
// The backend's error handler (middleware/errorHandler.js) responds with
// `{ success: false, error: "<message>" }` — note the key is `error`, NOT
// `message`. Reading `response.data.message` therefore always yields undefined
// and falls through to axios's own `err.message`, which is the useless
// "Request failed with status code 401" string users were seeing.
//
// `message` is still checked second: a few endpoints (and the tests) use it,
// and it costs nothing to accept both shapes.

const STATUS_FALLBACKS = {
  400: "Some of the details you entered aren't valid. Please check and try again.",
  401: "Incorrect email or password.",
  403: "You don't have access to this. If you think that's wrong, contact an administrator.",
  404: "We couldn't find what you were looking for.",
  409: "That already exists. Try a different value.",
  413: "That file is too large.",
  429: "Too many attempts. Please wait a moment and try again.",
};

/**
 * @param {unknown} err     the caught axios error
 * @param {string}  fallback message to use when nothing better is available
 * @returns {string} a message safe to show a user
 */
export function getApiErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const response = err?.response;

  // No response at all: the request never reached the API (server down, wrong
  // REACT_APP_API_URL, CORS, offline). Axios reports this as a bare Error.
  if (!response) {
    if (err?.code === "ECONNABORTED") {
      return "The server took too long to respond. Please try again.";
    }
    return "Can't reach the server. Check your connection and try again.";
  }

  const data = response.data;
  const fromBody =
    (typeof data?.error === "string" && data.error) ||
    (typeof data?.message === "string" && data.message) ||
    (typeof data === "string" && data) ||
    null;

  if (fromBody) return fromBody;

  if (response.status >= 500) {
    return "The server ran into a problem. Please try again in a moment.";
  }

  return STATUS_FALLBACKS[response.status] || fallback;
}

export default getApiErrorMessage;
