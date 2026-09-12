import React from "react";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../ProtectedRoute";

const mockAuth = { user: null, loading: true };
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => mockAuth,
}));

// The auto-applied src/__mocks__/react-router-dom.js renders <Navigate> as null,
// so assert the redirect by its absence of children plus the mock's own marker.
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("../../__mocks__/react-router-dom"),
  Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
}));

const Secret = () => <p>protected content</p>;

beforeEach(() => {
  mockAuth.user = null;
  mockAuth.loading = true;
});

describe("ProtectedRoute", () => {
  test("shows a spinner while the session is still being verified", () => {
    const { container } = render(
      <ProtectedRoute>
        <Secret />
      </ProtectedRoute>
    );

    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  test("redirects to the login route when there is no user", () => {
    mockAuth.loading = false;

    render(
      <ProtectedRoute>
        <Secret />
      </ProtectedRoute>
    );

    expect(screen.getByTestId("navigate")).toHaveTextContent("/api/login");
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  test("renders children once a user is present", () => {
    mockAuth.loading = false;
    mockAuth.user = { id: "u1", name: "Ada" };

    render(
      <ProtectedRoute>
        <Secret />
      </ProtectedRoute>
    );

    expect(screen.getByText("protected content")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });
});
