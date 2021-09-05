require('ts-node/register/transpile-only')

const opt = process.env.OPT

module.exports = {
  // CLI package needs to deploy contracts from JSON artifacts
  contracts_build_directory: '../cli/src/compiled',
  contracts_directory: './src',
  compilers: {
    solc: {
      version: opt ? '../../node_modules/@eth-optimism/solc' : '0.7.6',
      settings: {
        evmVersion: 'istanbul',
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
}
