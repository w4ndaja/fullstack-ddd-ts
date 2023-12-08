module.exports = {
    apps : [
        {
          name: "camy-dev",
          script: "./dist/index.js",
          watch: true,
          env: {
            "NODE_ENV": "development",
          }
        }
    ]
  }
