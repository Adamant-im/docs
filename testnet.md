# Testnet

You may want to test the node in a safe environment before running a `mainnet` node. The `testnet` configuration allows to experiment and run tests without affecting the `mainnet`.

- **Automatic installation**

  You can use the [installation script](./installation.md#installation-script) to automatically install the node for testnet:

  ```sh
  # Fetches the script and install the latest stable ADAMANT version using testnet config
  sudo bash -c "$(wget -O - https://adamant.im/install_node.sh)" -O -b master -n testnet
  ```

  This will create `test/config.json` file, which you can edit as needed.

- **Manually setup**

  To manually set up and run a local test node, copy the default config file and edit your copy:

  ```sh
  cp test/config.default.json test/config.json
  ```

To start the testnet node:

```sh
npm run start:testnet
```

The testnet explorer is available at [testnet.adamant.im](https://testnet.adamant.im/).

You can view the IPs and ports of testnet nodes in the [test/config.default.json](./test/config.default.json) file.
