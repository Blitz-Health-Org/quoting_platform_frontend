import CopyPlugin from 'copy-webpack-plugin'
// import ReloaderLocater from '@vercel/webpack-asset-relocator-loader'

/** @type {import('next').NextConfig} */
const nextConfig = {
    // webpack(config, { dev }) {
    //     config.externals.push('pdf2json');


    //     config.plugins.push(
    //         new CopyPlugin({
    //             patterns: ['node_modules/pdf2json/**/*']
    //         })
    //     );
    //     return config
    //   },
    experimental: {
        serverComponentsExternalPackages: ['pdf2json'],
      },
};

export default nextConfig;
