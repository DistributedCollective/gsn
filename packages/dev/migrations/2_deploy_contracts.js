const RelayHub = artifacts.require('RelayHub')
const InnerRelayHub = artifacts.require('InnerRelayHub')
const StakeManager = artifacts.require('StakeManager')
const Penalizer = artifacts.require('Penalizer')
const SampleRecipient = artifacts.require('TestRecipient')
const Forwarder = artifacts.require('Forwarder')

module.exports = async function (deployer) {
  await deployer.deploy(StakeManager, 30000)
  await deployer.deploy(Penalizer, 0, 0)
  await deployer.deploy(InnerRelayHub)
  await deployer.deploy(RelayHub, InnerRelayHub.address, StakeManager.address, Penalizer.address, [0, 0, 0, 0, 0, 0, 0, 0, 0])
  await InnerRelayHub.deployed().then(inner => inner.setRelayHub(RelayHub.address))
  await deployer.deploy(Forwarder)
  await deployer.deploy(SampleRecipient, Forwarder.address)
}
