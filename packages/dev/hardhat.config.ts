// TODO: unfortunately, this doesn't work... causes "typechain_1.glob is not a function" error.
// import "@typechain/hardhat";

// require("@nomiclabs/hardhat-waffle");
import '@nomiclabs/hardhat-truffle5'

const opt = process.env.OPT
let defaultNetwork: string
if (opt != null) {
  require('@eth-optimism/hardhat-ovm')
  defaultNetwork = 'optimistic'

  console.log('using OPTIMISM (env "OPT")')
} else {
  defaultNetwork = 'dev'
  console.log('using non-optimism (normal) build')
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.7.6',
  defaultNetwork,
  networks: {
    optimistic: {
      url: 'http://127.0.0.1:8545', // this is the default port
      accounts: { mnemonic: 'test test test test test test test test test test test junk' },
      gasPrice: 15000000, // required
      ovm: true // required
    },
    dev: {
      url: 'http://127.0.0.1:8545', // this is the default port
      // ganache 'deterministic' values
      accounts: { mnemonic: 'myth like bonus scare over problem client lizard pioneer submit female collect' }
    }
  }
}
