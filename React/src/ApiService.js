//Frontend - backend communication must happen over HTTPS on production

export const registerUser = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/form_capture.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/login_capture.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/logout_component.php",
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("An error occurred during logout.");
  }
};

// profileSectionGet() fetches data on component mount to display user profile data.

export const profileSectionGet = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/profile_section_get.php",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("profileSectionGet error:", error);
    throw new Error("An error occurred while fetching profile data.");
  }
};

// profileSectionPost() sends to the database profile data saved by the user.

export const profileSectionPost = async (field, value) => {
  try {
    const payload = { field, value };

    const response = await fetch(
      "http://localhost:8001/Contribution_Line/profile_section_post.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("profileSectionPost error:", error);
    throw new Error("An error occurred while saving profile data.");
  }
};

// addContribution() sends the contribution data to the database.

export const addContribution = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/add_contribution.php",
      {
        method: "POST",

        credentials: "include",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("addContribution error:", error);
    throw new Error("An error occurred while adding the contribution.");
  }
};

// contributionsTimeline() fetches all contributions for the logged-in user to display on the timeline.

export const contributionsTimeline = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/contributions_timeline.php",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("contributionsTimeline error:", error);
    throw new Error("An error occurred while fetching the timeline.");
  }
};

// presentationViewPost() sends the presentation view to the database creating a new presentation view record.

export const presentationViewPost = async (contributionIds) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/presentation_view_post.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify({ contributions_id: contributionIds }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("presentationViewPost error:", error);
    throw new Error("An error occurred while creating the presentation view.");
  }
};

// presentationViewGet() fetches a specific presentation record and its associated contributions by ID.

export const presentationViewGet = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:8001/Contribution_Line/presentation_view_get.php?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("presentationViewGet error:", error);
    throw new Error("An error occurred while fetching the presentation view.");
  }
};
