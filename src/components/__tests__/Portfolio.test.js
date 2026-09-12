import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Portfolio from "../Portfolio";
import { authService } from "../../services/api";

jest.mock("../../services/api", () => ({
  authService: {
    updateProfile: jest.fn(),
    getPresignedUrl: jest.fn(),
    confirmProfilePicture: jest.fn(),
  },
  uploadToS3: jest.fn(),
}));

// Mutable context mocks so each test can set the user / simulation list it needs.
const mockAuth = {
  user: { role: "user", name: "Ada", username: "Ada", email: "ada@test.com" },
  updateUser: jest.fn(),
  logout: jest.fn(),
};
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => mockAuth,
}));

const mockSimulation = { simulations: [] };
jest.mock("../../context/SimulationContext", () => ({
  useSimulation: () => mockSimulation,
}));

const sim = (status) => ({ id: `${status}-${Math.random()}`, status });

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.user = {
    role: "user",
    name: "Ada",
    username: "Ada",
    email: "ada@test.com",
  };
  mockSimulation.simulations = [];
});

describe("Portfolio", () => {
  test("acknowledges the real supervisor and university", () => {
    render(<Portfolio />);

    expect(screen.getByText("Dr Lim Seng Poh")).toBeInTheDocument();
    expect(
      screen.getByText("Universiti Tunku Abdul Rahman")
    ).toBeInTheDocument();
    // No bracketed placeholders left behind.
    expect(screen.queryByText(/\[.*\]/)).not.toBeInTheDocument();
  });

  test("does not render fabricated stats or badges", () => {
    render(<Portfolio />);

    expect(screen.queryByText("#12")).not.toBeInTheDocument();
    expect(screen.queryByText(/premium researcher/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/3 new simulation results/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/last updated:/i)).not.toBeInTheDocument();
  });

  test("does not render dead controls", () => {
    render(<Portfolio />);

    expect(
      screen.queryByRole("button", { name: /enable 2fa/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /view alerts/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /subscription plan/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /notification settings/i })
    ).not.toBeInTheDocument();
  });

  test("renders 0 simulations rather than a fabricated fallback when there are none", () => {
    render(<Portfolio />);

    expect(screen.getByText("Total Simulations").nextSibling).toHaveTextContent(
      "0"
    );
    expect(screen.getByText("0 of 0 completed")).toBeInTheDocument();
    expect(screen.queryByText("42")).not.toBeInTheDocument();
  });

  test("derives total / completed / in-progress counts from the simulation list", () => {
    mockSimulation.simulations = [
      sim("completed"),
      sim("completed"),
      sim("running"),
      sim("pending"),
      sim("failed"),
    ];

    render(<Portfolio />);

    expect(screen.getByText("Total Simulations").nextSibling).toHaveTextContent(
      "5"
    );
    expect(screen.getByText("Completed").nextSibling).toHaveTextContent("2");
    expect(screen.getByText("In Progress").nextSibling).toHaveTextContent("2");
    expect(screen.getByText("2 of 5 completed")).toBeInTheDocument();
  });

  test("still saves the profile through authService.updateProfile", async () => {
    authService.updateProfile.mockResolvedValue({ data: {} });

    render(<Portfolio />);
    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));

    const affiliation = screen.getByPlaceholderText("University of Science");
    fireEvent.change(affiliation, { target: { value: "UTAR" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
    });

    expect(authService.updateProfile).toHaveBeenCalledWith({
      username: "Ada",
      email: "ada@test.com",
      affiliation: "UTAR",
    });
    expect(mockAuth.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ affiliation: "UTAR" })
    );
  });
});
