import React from "react";
import { render, screen, act } from "@testing-library/react";
import AdminQueue from "../AdminQueue";
import { adminService } from "../../services/api";

jest.mock("../../services/api", () => ({
  adminService: {
    getQueueStatus: jest.fn(),
  },
}));

// Mutable auth mock so tests can switch between admin / non-admin users.
const mockAuth = {
  user: { role: "admin", name: "Admin", email: "admin@test.com" },
  logout: jest.fn(),
};
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => mockAuth,
}));

const queueMetrics = {
  queue: {
    queueUrl: "https://sqs.ap-southeast-1.amazonaws.com/123456789012/DE-Queue",
    approximateNumberOfMessages: 3,
    approximateNumberOfMessagesNotVisible: 1,
    approximateNumberOfMessagesDelayed: 0,
    oldestMessageAge: 125,
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.user = { role: "admin", name: "Admin", email: "admin@test.com" };
});

describe("AdminQueue", () => {
  test("renders queue depth metrics from the API", async () => {
    adminService.getQueueStatus.mockResolvedValue({ data: queueMetrics });

    await act(async () => {
      render(<AdminQueue />);
    });

    expect(adminService.getQueueStatus).toHaveBeenCalledTimes(1);
    expect(screen.getByText("In Queue")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("In Flight")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Oldest Message Age")).toBeInTheDocument();
    // 125 seconds -> "2m 5s"
    expect(screen.getByText("2m 5s")).toBeInTheDocument();
    expect(
      screen.getByText(queueMetrics.queue.queueUrl)
    ).toBeInTheDocument();
  });

  test("polls the queue every 10 seconds", async () => {
    jest.useFakeTimers();
    try {
      adminService.getQueueStatus.mockResolvedValue({ data: queueMetrics });

      await act(async () => {
        render(<AdminQueue />);
      });

      expect(adminService.getQueueStatus).toHaveBeenCalledTimes(1);

      await act(async () => {
        jest.advanceTimersByTime(10000);
      });
      expect(adminService.getQueueStatus).toHaveBeenCalledTimes(2);

      await act(async () => {
        jest.advanceTimersByTime(10000);
      });
      expect(adminService.getQueueStatus).toHaveBeenCalledTimes(3);
    } finally {
      jest.useRealTimers();
    }
  });

  test("surfaces an error state when the queue is not configured (503)", async () => {
    adminService.getQueueStatus.mockRejectedValue({
      response: { status: 503 },
      message: "Request failed with status code 503",
    });

    await act(async () => {
      render(<AdminQueue />);
    });

    expect(
      screen.getByText(/SQS queue is not configured on the server/i)
    ).toBeInTheDocument();
  });

  test("surfaces an error state for forbidden access (403)", async () => {
    adminService.getQueueStatus.mockRejectedValue({
      response: { status: 403 },
      message: "Request failed with status code 403",
    });

    await act(async () => {
      render(<AdminQueue />);
    });

    expect(
      screen.getByText(/Admin access required/i)
    ).toBeInTheDocument();
  });

  test("non-admins see an access-denied card and never hit the API", async () => {
    mockAuth.user = { role: "user", name: "User" };

    await act(async () => {
      render(<AdminQueue />);
    });

    expect(adminService.getQueueStatus).not.toHaveBeenCalled();
    expect(screen.getByText("Access denied")).toBeInTheDocument();
    expect(
      screen.getByText(/need an admin account/i)
    ).toBeInTheDocument();
  });
});
