import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ContributionsTimeline from "../ContributionsTimeline";
import { contributionsTimeline, presentationViewPost } from "../ApiService";

jest.mock("../ApiService", () => ({
  contributionsTimeline: jest.fn(),
  presentationViewPost: jest.fn(),
}));

jest.mock("../TimelineFilter", () => ({ filters, setFilters, onClear }) => (
  <div data-testid="timeline-filter">
    TimelineFilter
    <input
      aria-label="start date"
      type="date"
      onChange={(e) =>
        setFilters((prev) => ({ ...prev, startDate: e.target.value }))
      }
    />
    <button onClick={onClear}>Clear Filters</button>
  </div>
));

jest.mock("../SelectedTally", () => ({ count, onDisplay, onCancel }) => (
  <div data-testid="selected-tally">
    Selected: {count}
    <button onClick={onDisplay}>Display Presentation</button>
    <button onClick={onCancel}>Cancel</button>
  </div>
));

window.open = jest.fn();

describe("ContributionsTimeline – Full Component Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state initially", async () => {
    contributionsTimeline.mockResolvedValueOnce([]);

    render(<ContributionsTimeline />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => expect(contributionsTimeline).toHaveBeenCalled());
  });

  test("shows error message when fetch fails", async () => {
    contributionsTimeline.mockRejectedValueOnce(new Error("Network error"));

    render(<ContributionsTimeline />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  test("renders contributions after successful fetch", async () => {
    contributionsTimeline.mockResolvedValueOnce([
      {
        id: 1,
        title: "Contribution A",
        contribution_date: "2024-01-01",
        created_at: "2024-02-01",
        categories: ["Leadership / Ownership"],
        what_happened: "Something happened",
        why_it_mattered: "It mattered",
        outcome_impact: "Big impact",
        evidence_links: [],
        files: [],
      },
    ]);

    render(<ContributionsTimeline />);

    await waitFor(() => {
      expect(screen.getByText("Contribution A")).toBeInTheDocument();
    });

    expect(screen.getByText("Something happened")).toBeInTheDocument();
    expect(screen.getByText("It mattered")).toBeInTheDocument();
    expect(screen.getByText("Big impact")).toBeInTheDocument();
  });

  test("filters contributions by start date", async () => {
    contributionsTimeline.mockResolvedValueOnce([
      {
        id: 1,
        title: "Old Contribution",
        contribution_date: "2023-01-01",
        created_at: "2023-02-01",
        categories: [],
        what_happened: "",
        why_it_mattered: "",
        outcome_impact: "",
        evidence_links: [],
        files: [],
      },
      {
        id: 2,
        title: "New Contribution",
        contribution_date: "2024-01-01",
        created_at: "2024-02-01",
        categories: [],
        what_happened: "",
        why_it_mattered: "",
        outcome_impact: "",
        evidence_links: [],
        files: [],
      },
    ]);

    render(<ContributionsTimeline />);

    await waitFor(() => {
      expect(screen.getByText("Old Contribution")).toBeInTheDocument();
      expect(screen.getByText("New Contribution")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2023-12-31" },
    });

    expect(screen.queryByText("Old Contribution")).not.toBeInTheDocument();
    expect(screen.getByText("New Contribution")).toBeInTheDocument();
  });

  test("renders evidence links", async () => {
    contributionsTimeline.mockResolvedValueOnce([
      {
        id: 1,
        title: "Contribution with link",
        contribution_date: "2024-01-01",
        created_at: "2024-02-01",
        categories: [],
        what_happened: "",
        why_it_mattered: "",
        outcome_impact: "",
        evidence_links: [
          { url: "https://example.com/doc1" },
          { url: "https://example.com/doc2" },
        ],
        files: [],
      },
    ]);

    render(<ContributionsTimeline />);

    await waitFor(() => {
      expect(screen.getByText("Contribution with link")).toBeInTheDocument();
    });

    expect(screen.getByText("https://example.com/doc1")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/doc2")).toBeInTheDocument();
  });

  test("clicking supporting file triggers downloadFile", async () => {
    const mockFile = {
      file_name: "evidence.pdf",
      file_data: btoa("dummy content"),
      mime_type: "application/pdf",
    };

    contributionsTimeline.mockResolvedValueOnce([
      {
        id: 1,
        title: "Contribution with file",
        contribution_date: "2024-01-01",
        created_at: "2024-02-01",
        categories: [],
        what_happened: "",
        why_it_mattered: "",
        outcome_impact: "",
        evidence_links: [],
        files: [mockFile],
      },
    ]);

    const createObjectURL = jest.fn(() => "blob:mock-url");
    const revokeObjectURL = jest.fn();

    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;

    render(<ContributionsTimeline />);

    await waitFor(() => {
      expect(screen.getByText("Contribution with file")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("evidence.pdf"));

    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();
  });

  test("renders current role and company", async () => {
    contributionsTimeline.mockResolvedValueOnce([
      {
        id: 1,
        title: "Contribution with role/company",
        contribution_date: "2024-01-01",
        created_at: "2024-02-01",
        categories: [],
        what_happened: "",
        why_it_mattered: "",
        outcome_impact: "",
        evidence_links: [],
        files: [],
        current_role: "Senior Developer",
        current_company: "HSBC Bank",
      },
    ]);

    render(<ContributionsTimeline />);

    await waitFor(() => {
      expect(
        screen.getByText("Contribution with role/company"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Current role:/i)).toBeInTheDocument();
    expect(screen.getByText("Senior Developer")).toBeInTheDocument();

    expect(screen.getByText(/Current company:/i)).toBeInTheDocument();
    expect(screen.getByText("HSBC Bank")).toBeInTheDocument();
  });

  test("prevents presentation when none selected", async () => {
    contributionsTimeline.mockResolvedValueOnce([]);

    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<ContributionsTimeline />);

    await waitFor(() => expect(contributionsTimeline).toHaveBeenCalled());

    expect(screen.queryByTestId("selected-tally")).not.toBeInTheDocument();

    expect(screen.queryByText(/Display Presentation/i)).not.toBeInTheDocument();

    expect(screen.getByText(/Start building your record/i)).toBeInTheDocument();

    expect(window.alert).not.toHaveBeenCalled();
  });

  test("adds contribution to presentation selection", async () => {
    contributionsTimeline.mockResolvedValueOnce([
      {
        id: 1,
        title: "Contribution A",
        contribution_date: "2024-01-01",
        created_at: "2024-02-01",
        categories: [],
        what_happened: "",
        why_it_mattered: "",
        outcome_impact: "",
        evidence_links: [],
        files: [],
      },
    ]);

    render(<ContributionsTimeline />);

    await waitFor(() => {
      expect(screen.getByText("Contribution A")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Add to presentation view/i));

    expect(screen.getByTestId("selected-tally")).toHaveTextContent("1");
  });

  test("successful presentation opens new window", async () => {
    contributionsTimeline.mockResolvedValueOnce([
      {
        id: 1,
        title: "Contribution A",
        contribution_date: "2024-01-01",
        created_at: "2024-02-01",
        categories: [],
        what_happened: "",
        why_it_mattered: "",
        outcome_impact: "",
        evidence_links: [],
        files: [],
      },
    ]);

    presentationViewPost.mockResolvedValueOnce({
      status: "success",
      id: 999,
    });

    render(<ContributionsTimeline />);

    await waitFor(() => {
      expect(screen.getByText("Contribution A")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Add to presentation view/i));
    fireEvent.click(screen.getByText(/Display Presentation/i));

    await waitFor(() => {
      expect(presentationViewPost).toHaveBeenCalledWith([1]);
    });

    expect(window.open).toHaveBeenCalledWith(
      "/PresentationView/999",
      "_blank",
      "noopener,noreferrer",
    );
  });

  test("presentation error triggers alert", async () => {
    contributionsTimeline.mockResolvedValueOnce([
      {
        id: 1,
        title: "Contribution A",
        contribution_date: "2024-01-01",
        created_at: "2024-02-01",
        categories: [],
        what_happened: "",
        why_it_mattered: "",
        outcome_impact: "",
        evidence_links: [],
        files: [],
      },
    ]);

    presentationViewPost.mockResolvedValueOnce({
      status: "error",
      message: "Something went wrong",
    });

    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<ContributionsTimeline />);

    await waitFor(() => {
      expect(screen.getByText("Contribution A")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Add to presentation view/i));
    fireEvent.click(screen.getByText(/Display Presentation/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Error: Something went wrong");
    });
  });
});
