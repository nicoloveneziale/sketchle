/** @vitest-environment jsdom */
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Root from "../routes/root";
import { AuthProvider } from "../context/AuthContext";

vi.mock("@tsparticles/react", () => ({
    default: () => <div data-testid="particles-mock" />,
    initParticlesEngine: () => Promise.resolve(),
}));
vi.mock("@tsparticles/slim", () => ({
    loadSlim: vi.fn(),
}));

vi.mock("../assets/logo-main.svg", () => ({ default: "logo-mock" }));

const renderRoot = () => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <Root />
            </AuthProvider>
        </BrowserRouter>
    );
};

if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollTo = vi.fn();
}

describe("Root Layout Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear(); 
    });

    afterEach(() => {
        cleanup();
    });

    it("renders Register and Login links when user is not authenticated", () => {
        renderRoot();
        expect(screen.getByText(/Register/i)).toBeTruthy()
        expect(screen.getByText(/Log In/i)).toBeTruthy()
        expect(screen.queryByText(/Logout/i)).not.toBeTruthy()
    });

    it("renders Username and Logout button when user is authenticated", async () => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("username", "NicoloUser");
        renderRoot();
        await waitFor(() => {
            expect(screen.getByText("NicoloUser")).toBeTruthy()
            expect(screen.getByText(/Logout/i)).toBeTruthy()
        });
        
        expect(screen.queryByText(/Log In/i)).not.toBeTruthy()
    });

    it("calls logout and removes user info on logout click", async () => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("username", "NicoloUser");

        renderRoot();
        const logoutButton = await screen.findByText(/Logout/i);
        fireEvent.click(logoutButton);
        await waitFor(() => {
            expect(screen.getByText(/Log In/i)).toBeTruthy()
        });
    });
});