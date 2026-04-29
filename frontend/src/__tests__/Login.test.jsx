/** @vitest-environment jsdom */
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Login from "../routes/login";
import api from "../api/axios";
import { AuthProvider } from "../context/AuthContext";

vi.mock("../api/axios", () => ({
    default: {
        post: vi.fn(),
    },
}));

vi.mock("../assets/logo-secondary.svg", () => ({ default: "logo-mock" }));

const renderLogin = () => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <Login />
            </AuthProvider>
        </BrowserRouter>
    );
};

describe("Login Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it("updates input values on change", () => {
        renderLogin();
        
        const usernameInput = screen.getByPlaceholderText(/Enter your username/i);
        const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

        fireEvent.change(usernameInput, { target: { value: "nicolo" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });

        expect(usernameInput.value).toBe("nicolo");
        expect(passwordInput.value).toBe("password123");
    });

    it("submits the form and redirects on success", async () => {
        api.post.mockResolvedValue({
            data: { token: "fake-jwt-token" }
        });

        renderLogin();

        fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), { target: { value: "nicolo" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: "password123" } });
        
        fireEvent.click(screen.getByRole("button", { name: /SIGN IN/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/auth/login", {
                username: "nicolo",
                password: "password123"
            });
        });
    });

    it("displays error message from server on failure", async () => {
        api.post.mockRejectedValue({
            response: { data: "Invalid credentials" }
        });
        renderLogin();
        fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), { target: { value: "wronguser" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: "wrongpass" } });
        fireEvent.click(screen.getByRole("button", { name: /SIGN IN/i }));

        await waitFor(() => {
            expect(screen.getByText(/Invalid credentials/i)).toBeTruthy()
        });
    });
});