jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

import { supabase } from "../supabase";

describe("Supabase client", () => {
  it("is defined", () => {
    expect(supabase).toBeDefined();
  });

  it("has auth property", () => {
    expect(supabase.auth).toBeDefined();
  });
});
