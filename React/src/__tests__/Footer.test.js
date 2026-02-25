import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  test("renders without crashing", () => {
    const { container } = render(<Footer />);
    expect(container).toBeTruthy();
  });

  test("displays the correct year range", () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);

    expect(
      screen.getByText(new RegExp(`2025 - ${currentYear}`))
    ).toBeInTheDocument();
  });

  test("contains the correct email link", () => {
    render(<Footer />);

    const emailLink = screen.getByRole("link", {
      name: /team@contributionline\.com/i,
    });

    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute(
      "href",
      "mailto:team@contributionline.com"
    );
  });

  test("renders the full footer text", () => {
    render(<Footer />);

    expect(
      screen.getByText(/Company address: 4 Bridge Gate/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/United Kingdom/i)
    ).toBeInTheDocument();
  });
});
