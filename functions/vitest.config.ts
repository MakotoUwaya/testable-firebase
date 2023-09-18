import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["./test/**/*.test.{js,jsx,ts,tsx}"],
  },
});
