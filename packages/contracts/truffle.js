require('ts-node/register/transpile-only')

module.exports = {
  // CLI package needs to deploy contracts from JSON artifacts
  contracts_build_directory: '../cli/src/compiled',
  contracts_directory: './src',
  compilers: {
    solc: {
      version: "../../node_modules/@eth-optimism/solc",
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
