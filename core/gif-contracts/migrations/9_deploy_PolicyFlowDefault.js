const { info } = require('../io/logger');


const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const PolicyFlowDefault = artifacts.require('policyFlows/PolicyFlowDefault.sol');


module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(PolicyFlowDefault, registry.address, { gas: 3000000 });
  // Etherscan doesn't detects constructor arguments for this contract
  info('PolicyFlowDefault constructor arguments: %s\n', web3.eth.abi.encodeParameters(['address'], [registryStorage.address]).substr(2));

  const policyFlowDefault = await PolicyFlowDefault.deployed();
  const policyFlowDefaultName = await policyFlowDefault.NAME.call();

  info('Register PolicyFlowDefault Registry');
  await registry.register(policyFlowDefaultName, policyFlowDefault.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));
};
