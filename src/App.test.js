jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: () => ({
      interceptors: { request: { use: jest.fn() } },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    }),
  },
}));

// Real routing — see the note in src/components/__tests__/NotFound.test.js for
// why react-router-dom is unresolvable by name under CRA's Jest.
jest.mock("react-router-dom", () => jest.requireActual("react-router"));

import React from "react";
import { render, screen, act } from "@testing-library/react";
import App from "./App";

// App mounts BrowserRouter, which reads the jsdom URL.
const renderAt = async (path) => {
  window.history.pushState({}, "", path);
  await act(async () => {
    render(<App />);
  });
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("App routing", () => {
  test("renders without crashing", async () => {
    await renderAt("/api/login");
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
  });

  test("an unknown path renders NotFound instead of a blank page", async () => {
    await renderAt("/api/definitely-not-a-route");

    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to dashboard/i })
    ).toHaveAttribute("href", "/api");
  });

  test("an unknown path outside the /api prefix also renders NotFound", async () => {
    await renderAt("/totally/elsewhere");

    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  test("the site root redirects into the app rather than 404ing", async () => {
    await renderAt("/");

    // "/" -> /api -> ProtectedRoute -> /api/login while signed out.
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.queryByText("Page not found")).not.toBeInTheDocument();
  });

  test("a known protected path signed out redirects to login, not NotFound", async () => {
    await renderAt("/api/settings");

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.queryByText("Page not found")).not.toBeInTheDocument();
  });

  test("the public register route still renders", async () => {
    await renderAt("/api/register");

    expect(screen.queryByText("Page not found")).not.toBeInTheDocument();
  });
});
