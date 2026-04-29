/** @vitest-environment jsdom */
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Register from "../routes/register";
import api from "../api/axios";
import { AuthProvider } from "../context/AuthContext";

vi.mock("../api/axios", () => ({
    default: {
        post: vi.fn(),
    },
}));

vi.mock("../assets/logo-secondary.svg", () => ({ default: "logo-mock" }));

const renderRegister = () => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <Register />
            </AuthProvider>
        </BrowserRouter>
    );
};

describe("Register Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it("submits the form and triggers profile creation on success", async () => {
        api.post.mockImplementation((url) => {
            if (url === "/auth/register") {
                return Promise.resolve({ data: { token: "new-user-token" } });
            }
            if (url === "/profiles/create") {
                return Promise.resolve({ data: { success: true } });
            }
            return Promise.resolve({});
        });

        renderRegister();

        fireEvent.change(screen.getByPlaceholderText(/Choose a username/i), { target: { value: "newuser" } });
        fireEvent.change(screen.getByPlaceholderText(/Create a strong password/i), { target: { value: "securepass123" } });
        fireEvent.click(screen.getByRole("button", { name: /CREATE ACCOUNT/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/auth/register", {
                username: "newuser",
                password: "securepass123"
            });
            expect(api.post).toHaveBeenCalledWith("/profiles/create", 
                { bio: "Hello! I'm newuser." },
                expect.objectContaining({
                    headers: { Authorization: "Bearer new-user-token" }
                })
            );
        });
    });

    it("handles registration errors from the server", async () => {
        api.post.mockRejectedValueOnce({
            response: { data: "Username already exists" }
        });

        renderRegister();

        fireEvent.change(screen.getByPlaceholderText(/Choose a username/i), { target: { value: "takenuser" } });
        fireEvent.change(screen.getByPlaceholderText(/Create a strong password/i), { target: { value: "password" } });
        fireEvent.click(screen.getByRole("button", { name: /CREATE ACCOUNT/i }));

        await waitFor(() => {
            expect(screen.getByText(/Username already exists/i)).toBeTruthy()
        });
    });
});