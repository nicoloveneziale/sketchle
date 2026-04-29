/** @vitest-environment jsdom */
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Home from "../routes/home";
import api from "../api/axios";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

vi.mock("../api/axios", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

const renderWithAuth = (ui) => {
    return render(
        <BrowserRouter>
            <AuthProvider>{ui}</AuthProvider>
        </BrowserRouter>
    );
};

describe("Home Page Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it("displays the loading spinner initially", () => {
        api.get.mockReturnValue(new Promise(() => {})); 
        renderWithAuth(<Home />);
        expect(screen.getByText(/LOADING GALLERY.../i)).toBeTruthy()
    });

    it("loads and displays theme and drawings successfully", async () => {
        api.get.mockImplementation((url) => {
            console.log("Fetching URL:", url);
            if (url.includes("/theme/daily")) return Promise.resolve({ data: "Cyberpunk City" });
            if (url.includes("/drawings/today")) {
                return Promise.resolve({ 
                    data: { 
                        content: [{ 
                            id: 1, 
                            imageUrl: "test.png", 
                            user: { username: "NicoloArtist" }, 
                            likedByUser: false, 
                            likesCount: 5 
                        }], 
                        last: true 
                    } 
                });
            }
            if (url.includes("/drawings/top")) return Promise.resolve({ data: [] });
            if (url.includes("/drawings/submission")) return Promise.resolve({ data: null });
            return Promise.resolve({ data: {} });
        });

        renderWithAuth(<Home />);

        await waitFor(() => {
            expect(screen.getByText("Cyberpunk City")).toBeTruthy()
        });

        expect(screen.getByText(/Recent Submissions/i)).toBeTruthy()
    });

    it("shows error message when the API fails", async () => {
        api.get.mockRejectedValue(new Error("Network Error"));

        renderWithAuth(<Home />);

        await waitFor(() => {
            expect(screen.getByText(/Could not load today's gallery/i)).toBeTruthy()
        });
    });

    it("shows 'No data found' when gallery is empty", async () => {
        api.get.mockImplementation((url) => {
            if (url.includes("/theme/daily")) {
                return Promise.resolve({ data: "Empty Theme" });
            }
            return Promise.resolve({ data: { content: [], last: true } });
        });
        renderWithAuth(<Home />);
        await waitFor(() => {
            expect(screen.getByText(/No data found. Be the first to submit/i)).toBeDefined();
        });
    });
});