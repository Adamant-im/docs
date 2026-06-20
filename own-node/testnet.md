# Testnet

You may want to test the node in a safe environment before running a mainnet node. The `testnet` configuration lets you experiment and run tests without affecting the mainnet.

## Installation

- **Automatic installation**

  You can use the [installation script](./installation.md#installation-script) to automatically install the node for testnet:

  ```sh
  sudo bash -c "$(wget -O - https://adamant.im/install_node.sh)" -O -b master -n testnet -j 24
  ```

  This will create a `test/config.json` file, which you can edit as needed.

- **Manual setup**

  To manually set up and run a local testnet node, copy the default config file and edit your copy:

  ```sh
  cp test/config.default.json test/config.json
  ```

## Running ADM testnet node

To start the testnet node:

```sh
npm run start:testnet
```

You can also override individual configuration values at startup without editing `test/config.json`. For example, to enable public API access:

```sh
npm run start:testnet -- --config-set api.access.public=true
```

See [Configuration Overrides](./configuration.md#configuration-overrides) for the full override syntax.

## Running tests

Refer to [CONTRIBUTING.md](https://github.com/Adamant-im/adamant/blob/dev/.github/CONTRIBUTING.md).

## Helpful links and info

- A bootstrap snapshot of the testnet database is available for download (the installation script also supports bootstrapping): https://testnet.adamant.im/db_test_backup.sql.gz
- The testnet explorer: [testnet.adamant.im](https://testnet.adamant.im/)
- Request testnet ADM coins (3500 ADM) via the faucet: [Faucet](https://adamant.im/free-adm-tokens/)
- Access the testnet messenger app (dev branch build): [Testnet messenger](https://dev-adamant-testnet.surge.sh/)
- View the IPs and ports of testnet peers in [test/config.default.json](https://github.com/Adamant-im/adamant/blob/dev/test/config.default.json).
