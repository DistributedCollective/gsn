//TODO: unfortunately, this doesn't work... causes "typechain_1.glob is not a function" error.
//import "@typechain/hardhat";



import {HardhatUserConfig, subtask, task} from "hardhat/config";
//require("@nomiclabs/hardhat-waffle");
import "@nomiclabs/hardhat-truffle5"
import '@eth-optimism/hardhat-ovm'

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.6",
  //solidity: "0.8.4",
  defaultNetwork: "optimistic",
  networks: {
    optimistic: {
      url: 'http://127.0.0.1:8545', // this is the default port
      accounts: { mnemonic: 'test test test test test test test test test test test junk' },
      gasPrice: 15000000, // required
      ovm: true // required
    }
  }
};
