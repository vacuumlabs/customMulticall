const { NearProvider } = require('near-web3-provider');

module.exports = {
  networks: {
    near_local: {
      network_id: '*',
      skipDryRun: true,
      provider: () =>
        new NearProvider({
          networkId: 'local',
          masterAccountId: 'test.node0',
          evmAccountId: 'evm.test.node0',
        }),
    },
    near_mainnet: {
      network_id: 1313161554, // See https://chainid.network/
      skipDryRun: true,
      provider: () =>
        new NearProvider({
          networkId: 'mainnet',
          masterAccountId: process.env.NEAR_MASTER_ACCOUNT,
        }),
    },
    near_betanet: {
      network_id: '*',
      skipDryRun: true,
      provider: () =>
        new NearProvider({
          networkId: 'betanet',
          masterAccountId: process.env.NEAR_MASTER_ACCOUNT,
        }),
    },
    near_testnet: {
      network_id: '*',
      skipDryRun: true,
      provider: () =>
        new NearProvider({
          networkId: 'testnet',
          masterAccountId: process.env.NEAR_MASTER_ACCOUNT,
        }),
    },
    develop: {
      host: '127.0.0.1',
      network_id: '*',
      port: 7545,
    },
  },
  compilers: {
    solc: {
      version: '0.5.12',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
