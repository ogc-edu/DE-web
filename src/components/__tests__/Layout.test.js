import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Layout from "../Layout";

const mockAuth = {
  user: { role: "user", name: "Ada", email: "ada@test.com" },
  logout: jest.fn(),
};
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => mockAuth,
}));

let mockPathname = "/api";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("../../__mocks__/react-router-dom"),
  useLocation: () => ({ pathname: mockPathname }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockPathname = "/api";
  mockAuth.user = { role: "user", name: "Ada", email: "ada@test.com" };
});

const renderLayout = () =>
  render(
    <Layout>
      <p>page body</p>
    </Layout>
  );

describe("Layout", () => {
  test("renders its children and the primary nav", () => {
    renderLayout();

    expect(screen.getByText("page body")).toBeInTheDocument();
    // Each nav entry appears twice (desktop sidebar + mobile menu markup).
    for (const label of [
      "Dashboard",
      "Simulator",
      "Import Data",
      "History",
      "Settings",
      "Profile",
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  test("hides the admin queue from non-admins", () => {
    renderLayout();

    expect(screen.queryByText("Admin Queue")).not.toBeInTheDocument();
  });

  test("shows the admin queue for admins", () => {
    mockAuth.user = { role: "admin", name: "Root", email: "root@test.com" };

    renderLayout();

    expect(screen.getAllByText("Admin Queue").length).toBeGreaterThan(0);
  });

  test("shows the signed-in user's name and email", () => {
    renderLayout();

    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("ada@test.com")).toBeInTheDocument();
  });

  test("signing out calls logout", () => {
    renderLayout();

    fireEvent.click(screen.getAllByText("Sign Out")[0]);

    expect(mockAuth.logout).toHaveBeenCalled();
  });

  test("marks a simulation detail page as being under Dashboard", () => {
    // isNavActive treats /api/simulations/:id as the Dashboard section.
    mockPathname = "/api/simulations/abc123";

    renderLayout();

    const dashboardLink = screen.getAllByRole("link", { name: "Dashboard" })[0];
    expect(dashboardLink.className).toContain("bg-accent-600");
  });
});
