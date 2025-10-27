# Testnet

You may want to test the node in a safe environment before running a `mainnet` node. The `testnet` configuration allows to experiment and run tests without affecting the `mainnet`.

## Installation

- **Automatic installation**

  You can use the [installation script](./installation.md#installation-script) to automatically install the node for testnet:

  ```sh
  # Fetches the script and install the latest stable ADAMANT version using testnet config
  sudo bash -c "$(wget -O - https://adamant.im/install_node.sh)" -O -b master -n testnet -j jod
  ```

  This will create `test/config.json` file, which you can edit as needed.

- **Manually setup**

  To manually set up and run a local test node, copy the default config file and edit your copy:

  ```sh
  cp test/config.default.json test/config.json
  ```

## Running ADM testnet node

To start the testnet node:

```sh
npm run start:testnet
```

## Running tests

Refer to [CONTRIBUTING.md](https://github.com/Adamant-im/adamant/blob/dev/.github/CONTRIBUTING.md).

## Helpful links and info

- A bootstrap snapshot of the testnet database is available for download (the installation script also supports bootstrapping): https://testnet.adamant.im/db_test_backup.sql.gz
- The testnet explorer: [testnet.adamant.im](https://testnet.adamant.im/)
- Request testnet ADM coins (3500 ADM) via the same faucet as mainnet: [Faucet](https://adamant.im/free-adm-tokens/)
- Access the testnet messenger app (dev branch autobuild): [Testnet messenger](https://dev-adamant-testnet.surge.sh/)
- You can view the IPs and ports of testnet nodes in the [test/config.default.json](https://github.com/Adamant-im/adamant/blob/dev/test/config.default.json) file.
