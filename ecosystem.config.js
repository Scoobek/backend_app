module.exports = {
    apps: [
        {
            name: "node-app",
            script: "./dist/server.js",
            cwd: "/var/www/app",
            instances: "max",
            exec_mode: "cluster",
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
};
