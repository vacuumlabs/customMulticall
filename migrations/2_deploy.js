const PoolState = artifacts.require('PoolState');

module.exports = async function (deployer) {
  deployer.deploy(PoolState);
};
