import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import { authService } from "../../services/api";

jest.mock("../../services/api", () => ({
  authService: {
    login: jest.fn(),
    verifyToken: jest.fn(),
  },
}));

const TestConsumer = () => {
  const { user, login, logout, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <span data-testid="user">{user ? user.name : "none"}</span>
      <button onClick={() => login({ email: "test@test.com", password: "pass" })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

describe("AuthContext", () => {
  test("starts with no user when no token exists", async () => {
    authService.verifyToken.mockRejectedValue(new Error("No token"));
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId("user").textContent).toBe("none");
  });

  test("login sets user state", async () => {
    const mockUser = { name: "Test User", email: "test@test.com" };
    authService.login.mockResolvedValue({
      data: { token: "test-token", user: mockUser },
    });

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByText("Login").click();
    });

    expect(screen.getByTestId("user").textContent).toBe("Test User");
  });

  test("logout clears user state", async () => {
    const mockUser = { name: "Test User", email: "test@test.com" };
    authService.login.mockResolvedValue({
      data: { token: "test-token", user: mockUser },
    });

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByText("Login").click();
    });

    expect(screen.getByTestId("user").textContent).toBe("Test User");

    await act(async () => {
      screen.getByText("Logout").click();
    });

    expect(screen.getByTestId("user").textContent).toBe("none");
  });
});
