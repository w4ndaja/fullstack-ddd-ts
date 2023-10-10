module.exports = {
    apps : [
        {
          name: "fullstack-ts",
          script: "./dist/index.js",
          watch: true,
          env: {
            "NODE_ENV": "development",
          }
        }
    ]
  }
