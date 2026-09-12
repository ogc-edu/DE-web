import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Register from "../Register";
import { authService } from "../../services/api";

jest.mock("../../services/api", () => ({
  authService: {
    register: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("../../__mocks__/react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const fillForm = ({
  name = "Ada Lovelace",
  affiliation = "UTAR",
  email = "ada@test.com",
  password = "hunter2",
} = {}) => {
  fireEvent.change(screen.getByLabelText("Full Name"), {
    target: { value: name, id: "name" },
  });
  fireEvent.change(screen.getByLabelText("Affiliation / Organization"), {
    target: { value: affiliation, id: "affiliation" },
  });
  fireEvent.change(screen.getByLabelText("Email Address"), {
    target: { value: email, id: "email" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: password, id: "password" },
  });
};

const submit = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /^register$/i }));
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  authService.register.mockResolvedValue({ data: {} });
});

describe("Register", () => {
  test("renders the registration form", () => {
    render(<Register />);

    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/api/login"
    );
  });

  test("rejects an empty submit without calling the API", async () => {
    render(<Register />);

    await submit();

    expect(authService.register).not.toHaveBeenCalled();
    expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
  });

  test("enforces the 6-12 character password rule client-side", async () => {
    render(<Register />);
    fillForm({ password: "abc" });

    await submit();

    expect(authService.register).not.toHaveBeenCalled();
    expect(
      screen.getByText("Password must be between 6 and 12 characters")
    ).toBeInTheDocument();
  });

  test("sends the form as username/email/password/affiliation", async () => {
    render(<Register />);
    fillForm();

    await submit();

    // The backend field is `username`, not `name` — see docs/CONTEXT.md.
    expect(authService.register).toHaveBeenCalledWith({
      username: "Ada Lovelace",
      email: "ada@test.com",
      password: "hunter2",
      affiliation: "UTAR",
    });
    expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
  });

  test("surfaces the backend message when registration fails", async () => {
    authService.register.mockRejectedValue({
      response: { data: { message: "Email already in use" } },
    });

    render(<Register />);
    fillForm();
    await submit();

    expect(screen.getByText("Email already in use")).toBeInTheDocument();
  });
});
