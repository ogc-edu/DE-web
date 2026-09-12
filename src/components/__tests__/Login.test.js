import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Login from "../Login";

const mockLogin = jest.fn();
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("../../__mocks__/react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const fillForm = (email, password) => {
  fireEvent.change(screen.getByLabelText("Email Address"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: password },
  });
};

const submit = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  mockLogin.mockResolvedValue({ token: "t", user: { _id: "u1", name: "Ada" } });
});

describe("Login", () => {
  test("renders the sign-in form", () => {
    render(<Login />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create an account/i })).toHaveAttribute(
      "href",
      "/api/register"
    );
  });

  test("rejects an empty submit without calling the API", async () => {
    render(<Login />);

    await submit();

    expect(mockLogin).not.toHaveBeenCalled();
    expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
  });

  test("signs in and navigates to the dashboard", async () => {
    render(<Login />);
    fillForm("ada@test.com", "hunter2");

    await submit();

    expect(mockLogin).toHaveBeenCalledWith(
      { email: "ada@test.com", password: "hunter2" },
      false
    );
    expect(mockNavigate).toHaveBeenCalledWith("/api");
  });

  test("remember-me persists to localStorage, otherwise sessionStorage", async () => {
    render(<Login />);
    fillForm("ada@test.com", "hunter2");
    fireEvent.click(screen.getByLabelText("Remember me"));

    await submit();

    expect(mockLogin).toHaveBeenCalledWith(expect.anything(), true);
    expect(localStorage.getItem("user")).toContain("Ada");
    expect(sessionStorage.getItem("user")).toBeNull();
  });

  test("surfaces the backend message when sign-in fails", async () => {
    mockLogin.mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    render(<Login />);
    fillForm("ada@test.com", "wrong");
    await submit();

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("reads the backend's `error` key, not `message`", async () => {
    // middleware/errorHandler.js sends { success: false, error: "..." }.
    mockLogin.mockRejectedValue({
      message: "Request failed with status code 401",
      response: {
        status: 401,
        data: { success: false, error: "Invalid email or password" },
      },
    });

    render(<Login />);
    fillForm("ada@test.com", "wrong");
    await submit();

    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    expect(screen.queryByText(/status code/i)).not.toBeInTheDocument();
  });

  test("never shows axios's raw status-code string", async () => {
    mockLogin.mockRejectedValue({
      message: "Request failed with status code 401",
      response: { status: 401, data: {} },
    });

    render(<Login />);
    fillForm("ada@test.com", "wrong");
    await submit();

    expect(screen.queryByText(/status code/i)).not.toBeInTheDocument();
    expect(screen.getByText("Incorrect email or password.")).toBeInTheDocument();
  });

  test("explains an unreachable backend rather than blaming the password", async () => {
    mockLogin.mockRejectedValue({ message: "Network Error" });

    render(<Login />);
    fillForm("ada@test.com", "hunter2");
    await submit();

    expect(screen.getByText(/can't reach the server/i)).toBeInTheDocument();
  });

  test("keeps the previous error in place while retrying, so the card cannot shudder", async () => {
    mockLogin.mockRejectedValue({
      response: { status: 401, data: { error: "Invalid email or password" } },
    });

    render(<Login />);
    fillForm("ada@test.com", "wrong");
    await submit();
    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();

    // Submitting again must not blank the alert first — clearing and re-setting
    // it collapses then re-expands the vertically-centred card.
    await submit();
    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });

  test("the alert region is always mounted so its reveal is animated, not a jump", () => {
    const { container } = render(<Login />);

    // Collapsed: present in the DOM at zero height rather than absent.
    const slot = container.querySelector(".grid-rows-\\[0fr\\]");
    expect(slot).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  test("says password reset is unavailable rather than linking to a dead route", () => {
    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /forgot password/i }));

    expect(
      screen.getByText(/password reset is not available yet/i)
    ).toBeInTheDocument();
  });
});
