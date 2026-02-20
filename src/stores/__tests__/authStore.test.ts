import { renderHook, act } from "@testing-library/react-native";
import { useAuthStore } from "../authStore";

jest.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: "u1" }, session: {} }, error: null }),
      signUp: jest.fn().mockResolvedValue({ data: { user: { id: "u1" }, session: {} }, error: null }),
      signOut: jest.fn().mockResolvedValue({}),
      onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: "u1", email: "a@b.com", name: "Test", profile_type: "freelancer", created_at: "" }, error: null }),
      update: jest.fn().mockReturnThis(),
    }),
  },
}));

describe("useAuthStore", () => {
  it("starts unauthenticated with no profile", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
  });

  it("has signIn function", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(typeof result.current.signIn).toBe("function");
  });

  it("has fetchProfile function", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(typeof result.current.fetchProfile).toBe("function");
  });

  it("has updateProfile function", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(typeof result.current.updateProfile).toBe("function");
  });
});
