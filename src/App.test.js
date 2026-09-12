// One shared axios instance so tests can script the backend responses. It is
// built inside the factory because jest.mock is hoisted above module scope, and
// handed back by every create() call so the test file and src/services/api.js
// talk to the same object.
jest.mock("axios", () => {
  const instance = {
    interceptors: { request: { use: jest.fn() } },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
  return { __esModule: true, default: { create: () => instance } };
});

// Real routing — see the note in src/components/__tests__/NotFound.test.js for
// why react-router-dom is unresolvable by name under CRA's Jest.
jest.mock("react-router-dom", () => jest.requireActual("react-router"));

// Chart.js cannot draw on a jsdom canvas.
jest.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="chart" />,
  Line: () => <div data-testid="chart" />,
}));

import React from "react";
import { render, screen, act } from "@testing-library/react";
import axios from "axios";
import App from "./App";

const mockApi = axios.create();

// App mounts BrowserRouter, which reads the jsdom URL.
const renderAt = async (path) => {
  window.history.pushState({}, "", path);
  await act(async () => {
    render(<App />);
  });
};

// Make AuthContext's mount-time verify + profile fetch succeed.
const signIn = (user = { _id: "u1", username: "Ada", email: "ada@test.com" }) => {
  localStorage.setItem("token", "test-token");
  mockApi.post.mockImplementation((url) =>
    url.includes("/verify")
      ? Promise.resolve({
          status: 200,
          data: { userData: { userId: user._id, username: user.username } },
        })
      : Promise.resolve({ status: 200, data: {} })
  );
  mockApi.get.mockImplementation((url) => {
    if (url.includes("/user/profile")) {
      return Promise.resolve({ data: { user } });
    }
    if (url.includes("/simulation/get")) {
      return Promise.resolve({ data: { simulations: [], simulationCount: 0 } });
    }
    return Promise.resolve({ data: {} });
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  mockApi.get.mockResolvedValue({ data: {} });
  mockApi.post.mockResolvedValue({ data: {} });
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

    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  test("a signed-in user gets the protected page, not the login screen", async () => {
    signIn();

    await renderAt("/api");

    expect(screen.getByText("Research Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Welcome Back")).not.toBeInTheDocument();
  });

  test("a signed-in user reaches another protected route", async () => {
    signIn();

    await renderAt("/api/settings");

    expect(screen.getByText("Account Settings")).toBeInTheDocument();
  });

  test("the admin queue is only in the nav for admins", async () => {
    signIn({
      _id: "u2",
      username: "Root",
      email: "root@test.com",
      role: "admin",
    });

    await renderAt("/api");

    expect(screen.getAllByText("Admin Queue").length).toBeGreaterThan(0);
  });
});
