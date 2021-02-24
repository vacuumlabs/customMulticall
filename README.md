# Custom multicall migrated to NEAR

See parent repo for general info.

## Development

### Betanet

Deploy custom multicall contract to NEAR betanet:

```
env NEAR_MASTER_ACCOUNT=[NEAR_ACCOUNT_ID].betanet truffle migrate --network near_betanet
```

### Localnet

Make sure `masterAccountId` and `evmAccountId` are set correctly in the `NearProvider` for the `near_local` configuration.

Run truffle migrations:

```
truffle migrate --network near_local
```

Store the contract address somewhere.

If you get an account/key error uncomment the `keyStore` section in `NearProvider` for `near_local` and paster your master account secret key.
