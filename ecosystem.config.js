module.exports = {
    apps : [
        {
          name: "camy-dev",
          script: "./dist/index.js",
          watch: false,
          env: {
            "NODE_ENV": "production",
          }
        }
    ]
  }
