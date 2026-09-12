import { getApiErrorMessage } from "../apiError";

// The backend's errorHandler responds { success: false, error: "<message>" }.
const backendError = (status, error) => ({
  response: { status, data: { success: false, error } },
});

describe("getApiErrorMessage", () => {
  test("reads the backend's `error` key, which is the shape it actually sends", () => {
    expect(
      getApiErrorMessage(backendError(401, "Invalid email or password"))
    ).toBe("Invalid email or password");
  });

  test("also accepts a `message` key", () => {
    expect(
      getApiErrorMessage({
        response: { status: 400, data: { message: "Email already in use" } },
      })
    ).toBe("Email already in use");
  });

  test("never leaks axios's own status-code string", () => {
    // This is the regression: axios sets err.message to
    // "Request failed with status code 401" and the old code fell through to it.
    const axiosStyle = {
      message: "Request failed with status code 401",
      response: { status: 401, data: {} },
    };

    const result = getApiErrorMessage(axiosStyle, "Incorrect email or password.");

    expect(result).not.toMatch(/status code/i);
    expect(result).toBe("Incorrect email or password.");
  });

  test("explains a suspended account from the backend's 403 text", () => {
    expect(
      getApiErrorMessage(backendError(403, "Account has been suspended"))
    ).toBe("Account has been suspended");
  });

  test("has a friendly default for each common status", () => {
    expect(getApiErrorMessage({ response: { status: 401, data: {} } })).toBe(
      "Incorrect email or password."
    );
    expect(getApiErrorMessage({ response: { status: 429, data: {} } })).toMatch(
      /too many attempts/i
    );
    expect(getApiErrorMessage({ response: { status: 503, data: {} } })).toMatch(
      /server ran into a problem/i
    );
  });

  test("distinguishes an unreachable server from a rejected request", () => {
    expect(getApiErrorMessage({ message: "Network Error" })).toMatch(
      /can't reach the server/i
    );
  });

  test("names a timeout as a timeout", () => {
    expect(getApiErrorMessage({ code: "ECONNABORTED" })).toMatch(
      /took too long/i
    );
  });

  test("falls back to the caller's message when nothing else fits", () => {
    expect(
      getApiErrorMessage({ response: { status: 418, data: {} } }, "Custom fallback")
    ).toBe("Custom fallback");
  });
});
