// src/__mocks__/react-router-dom.js is auto-applied to every suite (CRA points
// jest roots at src/), because react-router-dom@7 cannot be resolved by name
// under CRA's Jest: its package.json "main" is ./dist/main.js, a file it does
// not ship, and the resolver predates "exports" maps. These tests need real
// routing, so swap in react-router — the core package react-router-dom merely
// re-exports, and it resolves fine.
jest.mock("react-router-dom", () => jest.requireActual("react-router"));

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ErrorBoundary from "../ErrorBoundary";

const Boom = () => {
  throw new Error("kaboom");
};

const Fine = () => <p>rendered fine</p>;

// React logs the caught error to console.error; silence it so a passing suite
// stays readable.
let consoleError;
beforeEach(() => {
  consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  consoleError.mockRestore();
});

const renderBoundary = (ui, resetKey = "/api") =>
  render(
    <MemoryRouter>
      <ErrorBoundary resetKey={resetKey}>{ui}</ErrorBoundary>
    </MemoryRouter>
  );

describe("ErrorBoundary", () => {
  test("renders children when nothing throws", () => {
    renderBoundary(<Fine />);

    expect(screen.getByText("rendered fine")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  test("shows the fallback instead of a blank screen when a child throws", () => {
    renderBoundary(<Boom />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("kaboom")).toBeInTheDocument();
  });

  test("fallback offers a link back to the dashboard", () => {
    renderBoundary(<Boom />);

    expect(
      screen.getByRole("link", { name: /back to dashboard/i })
    ).toHaveAttribute("href", "/api");
  });

  test("'Try again' re-renders the subtree", () => {
    const Flaky = ({ shouldThrow }) => {
      if (shouldThrow) throw new Error("kaboom");
      return <p>recovered</p>;
    };

    const { rerender } = render(
      <MemoryRouter>
        <ErrorBoundary resetKey="/api">
          <Flaky shouldThrow />
        </ErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <ErrorBoundary resetKey="/api">
          <Flaky shouldThrow={false} />
        </ErrorBoundary>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(screen.getByText("recovered")).toBeInTheDocument();
  });

  test("clears the error when the route changes", () => {
    const { rerender } = render(
      <MemoryRouter>
        <ErrorBoundary resetKey="/api/broken">
          <Boom />
        </ErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Navigating elsewhere must not pin the fallback for the rest of the session.
    rerender(
      <MemoryRouter>
        <ErrorBoundary resetKey="/api/settings">
          <Fine />
        </ErrorBoundary>
      </MemoryRouter>
    );

    expect(screen.getByText("rendered fine")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });
});
