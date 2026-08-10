import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import { authService } from "../../services/api";

jest.mock("../../services/api", () => ({
  authService: {
    login: jest.fn(),
    verifyToken: jest.fn(),
    getProfile: jest.fn(),
    logout: jest.fn(),
  },
}));

const TestConsumer = () => {
  const { user, login, logout, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <span data-testid="user">{user ? user.name : "none"}</span>
      <span data-testid="role">{user ? user.role || "none" : "none"}</span>
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
      data: { token: "test-token" },
    });
    authService.getProfile.mockResolvedValue({ data: { user: mockUser } });

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
      data: { token: "test-token" },
    });
    authService.getProfile.mockResolvedValue({ data: { user: mockUser } });

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

  test("verify with a stored token fetches the profile so role is available", async () => {
    localStorage.setItem("token", "valid-token");
    authService.verifyToken.mockResolvedValue({
      status: 200,
      data: { userData: { userId: "u1", username: "admin-user" } },
    });
    authService.getProfile.mockResolvedValue({
      data: {
        user: { _id: "u1", username: "admin-user", email: "a@b.com", role: "admin" },
      },
    });

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    expect(authService.getProfile).toHaveBeenCalled();
    expect(screen.getByTestId("user").textContent).toBe("admin-user");
    expect(screen.getByTestId("role").textContent).toBe("admin");
  });
});
