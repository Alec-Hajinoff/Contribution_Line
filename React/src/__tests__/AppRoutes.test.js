import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AppRoutes from "../AppRoutes";

jest.mock("../MainRegLog", () => () => (
  <div data-testid="main-reg-log">MainRegLog</div>
));
jest.mock("../RegisteredPage", () => () => (
  <div data-testid="registered-page">RegisteredPage</div>
));
jest.mock("../UserDashboard", () => () => (
  <div data-testid="user-dashboard">UserDashboard</div>
));
jest.mock("../LogoutComponent", () => () => (
  <div data-testid="logout-component">LogoutComponent</div>
));
jest.mock("../PresentationView", () => () => (
  <div data-testid="presentation-view">PresentationView</div>
));

describe("AppRoutes", () => {
  test("renders MainRegLog on /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("main-reg-log")).toBeInTheDocument();
  });

  test("renders RegisteredPage on /RegisteredPage", () => {
    render(
      <MemoryRouter initialEntries={["/RegisteredPage"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("registered-page")).toBeInTheDocument();
  });

  test("renders UserDashboard on /UserDashboard", () => {
    render(
      <MemoryRouter initialEntries={["/UserDashboard"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("user-dashboard")).toBeInTheDocument();
  });

  test("renders LogoutComponent on /LogoutComponent", () => {
    render(
      <MemoryRouter initialEntries={["/LogoutComponent"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("logout-component")).toBeInTheDocument();
  });

  test("renders PresentationView on /PresentationView/:id", () => {
    render(
      <MemoryRouter initialEntries={["/PresentationView/123"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("presentation-view")).toBeInTheDocument();
  });
});
