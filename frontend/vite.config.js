export default {
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  root: "frontend",
  build: {
    outDir: "dist",
  },
};
