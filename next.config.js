const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
    webpack: (config) => {
        // config.module.rules.push(
        //     {
        //         test: /\.wasm$/,
        //         loader: 'wasm-loader'
        //     }
        // );
        config.plugins.push(
            new SWPrecacheWebpackPlugin({
                verbose: true,
                staticFileGlobsIgnorePatterns: [/\.next\//],
                runtimeCaching: [
                    {
                        handler: 'networkFirst',
                        urlPattern: /^https?.*/
                    }
                ]
            })
        );

        return config
    }
};