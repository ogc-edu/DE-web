// Use the real router — src/__mocks__/react-router-dom.js is applied to every
// suite automatically (CRA sets jest roots to src/), and its stub useLocation
// always reports "/", which is exactly what this page is meant to echo back.
// src/__mocks__/react-router-dom.js is auto-applied to every suite (CRA points
// jest roots at src/), because react-router-dom@7 cannot be resolved by name
// under CRA's Jest: its package.json "main" is ./dist/main.js, a file it does
// not ship, and the resolver predates "exports" maps. These tests need real
// routing, so swap in react-router — the core package react-router-dom merely
// re-exports, and it resolves fine.
jest.mock("react-router-dom", () => jest.requireActual("react-router"));

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "../NotFound";

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <NotFound />
    </MemoryRouter>
  );

describe("NotFound", () => {
  test("renders the 404 message instead of a blank page", () => {
    renderAt("/api/nope");

    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(screen.getByText("There is nothing at this address.")).toBeInTheDocument();
  });

  test("echoes the path that was not found", () => {
    renderAt("/api/this-route-does-not-exist");

    expect(
      screen.getByText("/api/this-route-does-not-exist")
    ).toBeInTheDocument();
  });

  test("offers a link back to the dashboard", () => {
    renderAt("/api/nope");

    const link = screen.getByRole("link", { name: /back to dashboard/i });
    expect(link).toHaveAttribute("href", "/api");
  });
});
