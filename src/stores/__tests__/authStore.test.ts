import { renderHook, act } from "@testing-library/react-native";
import { useAuthStore } from "../authStore";

// Mock supabase
jest.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
}));

describe("useAuthStore", () => {
  it("starts with no user", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
  });

  it("starts not loading", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.loading).toBe(false);
  });

  it("has signIn function", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(typeof result.current.signIn).toBe("function");
  });

  it("has signUp function", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(typeof result.current.signUp).toBe("function");
  });

  it("has signOut function", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(typeof result.current.signOut).toBe("function");
  });
});
