import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { addToast } from "@heroui/toast";

import LoginPage from "@/app/login/page";
import { login } from "@/app/actions/auth";
import LoginLayout from "@/app/login/layout";
import { renderWithAdapter } from "@/test/custom-renders";

vi.mock("@/app/actions/auth", () => ({
  login: vi.fn(),
}));

vi.mock("@heroui/toast", () => ({
  addToast: vi.fn(),
}));

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("Login page component", () => {
  test("Should render login layout with child", () => {
    renderWithAdapter(
      <LoginLayout>
        <span>Test layout component</span>
      </LoginLayout>,
    );
    expect(screen.getByText("Test layout component")).toBeDefined();
  });

  test("Should render login page", () => {
    renderWithAdapter(<LoginPage />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /accedi/i,
      }),
    ).toBeDefined();
    expect(screen.getByLabelText(/username/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /accedi/i })).toBeDefined();
  });

  test("Should navigate to '/' after submit successfully", async () => {
    vi.mocked(login).mockResolvedValueOnce({ data: { token: "token" } });
    renderWithAdapter(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /accedi/i }));
    await waitFor(() => {
      expect(login).toHaveBeenCalledExactlyOnceWith("admin", "password");
      expect(pushMock).toHaveBeenCalledExactlyOnceWith("/");
    });
    expect(addToast).not.toHaveBeenCalled();
  });

  test("Should show error toast on failed login", async () => {
    vi.mocked(login).mockResolvedValueOnce({ error: "Invalid credentials" });
    renderWithAdapter(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /accedi/i }));
    await waitFor(() => {
      expect(login).toHaveBeenCalledExactlyOnceWith("admin", "wrong-password");
      expect(addToast).toHaveBeenCalledExactlyOnceWith({
        title: "Invalid credentials",
        color: "danger",
      });
    });
    expect(pushMock).not.toHaveBeenCalled();
  });

  test("Should show error toast when login throws an exception", async () => {
    vi.mocked(login).mockImplementationOnce(() => {
      throw new Error("Network error");
    });
    renderWithAdapter(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /accedi/i }));
    await waitFor(() => {
      expect(login).toHaveBeenCalledExactlyOnceWith("admin", "wrong-password");
      expect(addToast).toHaveBeenCalledExactlyOnceWith({
        title: "Errore nella comunicazione",
        color: "danger",
      });
    });
    expect(pushMock).not.toHaveBeenCalled();
  });
});
