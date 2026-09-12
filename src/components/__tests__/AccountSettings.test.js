import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import AccountSettings from "../AccountSettings";
import { authService } from "../../services/api";

jest.mock("../../services/api", () => ({
  authService: {
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
    getPresignedUrl: jest.fn(),
    confirmProfilePicture: jest.fn(),
  },
  uploadToS3: jest.fn(),
}));

const mockAuth = {
  user: {
    role: "user",
    name: "Ada",
    email: "ada@test.com",
    affiliation: "UTAR",
  },
  logout: jest.fn(),
  updateUser: jest.fn(),
};
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => mockAuth,
}));

// handleProfileSave / handlePasswordSave hold their spinner for a minimum
// duration; run timers so the assertions do not race it.
beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  authService.updateProfile.mockResolvedValue({ data: {} });
  authService.changePassword.mockResolvedValue({ data: {} });
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

const flush = async () => {
  await act(async () => {
    jest.advanceTimersByTime(2000);
  });
};

const saveProfile = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  });
  await flush();
};

const savePassword = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
  });
  await flush();
};

describe("AccountSettings", () => {
  test("renders the settings sections prefilled from the user", () => {
    render(<AccountSettings />);

    expect(screen.getByText("Account Settings")).toBeInTheDocument();
    expect(screen.getByText("Profile Information")).toBeInTheDocument();
    expect(screen.getByText("Danger Zone")).toBeInTheDocument();
    // "Change Password" is both the card title and its submit button, so match
    // the section by its unique description instead.
    expect(
      screen.getByText("Update your account password")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name")).toHaveValue("Ada");
    expect(screen.getByLabelText("Email Address")).toHaveValue("ada@test.com");
  });

  test("saves the profile as username/email/affiliation", async () => {
    render(<AccountSettings />);

    fireEvent.change(screen.getByLabelText("Affiliation / Organization"), {
      target: { value: "UTAR Kampar" },
    });
    await saveProfile();

    // The backend expects `username`, not `name`.
    expect(authService.updateProfile).toHaveBeenCalledWith({
      username: "Ada",
      email: "ada@test.com",
      affiliation: "UTAR Kampar",
    });
    expect(screen.getByText("Profile updated successfully!")).toBeInTheDocument();
  });

  test("omits empty username/email rather than failing backend validation", async () => {
    render(<AccountSettings />);

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "" },
    });
    await saveProfile();

    expect(authService.updateProfile).toHaveBeenCalledWith({
      affiliation: "UTAR",
    });
  });

  test("surfaces a profile save failure", async () => {
    authService.updateProfile.mockRejectedValue({
      response: { data: { message: "Email already taken" } },
    });

    render(<AccountSettings />);
    await saveProfile();

    expect(screen.getByText("Email already taken")).toBeInTheDocument();
  });

  test("refuses a password change when the confirmation does not match", async () => {
    render(<AccountSettings />);

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpass" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "different" },
    });
    await savePassword();

    expect(authService.changePassword).not.toHaveBeenCalled();
    expect(screen.getByText("New passwords do not match.")).toBeInTheDocument();
  });

  test("refuses a password shorter than six characters", async () => {
    render(<AccountSettings />);

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "abc" },
    });
    await savePassword();

    expect(authService.changePassword).not.toHaveBeenCalled();
    expect(
      screen.getByText("Password must be at least 6 characters.")
    ).toBeInTheDocument();
  });

  test("changes the password and clears the fields", async () => {
    render(<AccountSettings />);

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpass" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "newpass" },
    });
    await savePassword();

    expect(authService.changePassword).toHaveBeenCalledWith({
      currentPassword: "oldpass",
      newPassword: "newpass",
    });
    expect(screen.getByText("Password changed successfully!")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toHaveValue("");
  });

  test("signing out asks for confirmation first", async () => {
    const confirmSpy = jest
      .spyOn(window, "confirm")
      .mockImplementation(() => false);

    render(<AccountSettings />);
    // Layout's sidebar has its own Sign Out; the Danger Zone one renders last.
    const dangerZoneSignOut = () =>
      screen.getAllByRole("button", { name: /sign out/i }).pop();

    fireEvent.click(dangerZoneSignOut());

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockAuth.logout).not.toHaveBeenCalled();

    confirmSpy.mockImplementation(() => true);
    fireEvent.click(dangerZoneSignOut());
    expect(mockAuth.logout).toHaveBeenCalled();

    confirmSpy.mockRestore();
  });
});
