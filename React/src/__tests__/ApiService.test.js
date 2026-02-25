import {
  registerUser,
  loginUser,
  logoutUser,
  addContribution,
  contributionsTimeline,
  presentationViewPost,
  presentationViewGet,
} from "../ApiService";

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockReset();
});

describe("ApiService", () => {
  test("registerUser sends correct request and returns JSON", async () => {
    const mockResponse = { success: true };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const formData = { email: "test@example.com", password: "123" };
    const result = await registerUser(formData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/form_capture.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      },
    );

    expect(result).toEqual(mockResponse);
  });

  test("loginUser sends correct request and returns JSON", async () => {
    const mockResponse = { loggedIn: true };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const formData = { email: "test@example.com", password: "123" };
    const result = await loginUser(formData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/login_capture.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      },
    );

    expect(result).toEqual(mockResponse);
  });

  test("logoutUser sends POST request and succeeds on ok response", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    await logoutUser();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/logout_component.php",
      {
        method: "POST",
        credentials: "include",
      },
    );
  });

  test("logoutUser throws error on non-ok response", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(logoutUser()).rejects.toThrow(
      "An error occurred during logout.",
    );
  });

  test("addContribution sends FormData and returns JSON", async () => {
    const mockResponse = { id: 123 };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const formData = new FormData();
    formData.append("title", "Test");

    const result = await addContribution(formData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/add_contribution.php",
      {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );

    expect(result).toEqual(mockResponse);
  });

  test("addContribution throws error on non-ok response", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const formData = new FormData();

    await expect(addContribution(formData)).rejects.toThrow(
      "An error occurred while adding the contribution.",
    );
  });

  test("contributionsTimeline sends GET request and returns JSON", async () => {
    const mockResponse = [{ id: 1 }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await contributionsTimeline();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/contributions_timeline.php",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );

    expect(result).toEqual(mockResponse);
  });

  test("presentationViewPost sends POST request with JSON body", async () => {
    const mockResponse = { success: true };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const ids = [1, 2, 3];
    const result = await presentationViewPost(ids);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/presentation_view_post.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ contributions_id: ids }),
      },
    );

    expect(result).toEqual(mockResponse);
  });

  test("presentationViewGet sends GET request and returns JSON", async () => {
    const mockResponse = { id: 1 };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await presentationViewGet(5);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/presentation_view_get.php?id=5",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    expect(result).toEqual(mockResponse);
  });

  test("presentationViewGet throws error on non-ok response", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(presentationViewGet(99)).rejects.toThrow(
      "An error occurred while fetching the presentation view.",
    );
  });
});
