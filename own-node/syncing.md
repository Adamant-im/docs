# Syncing

To maintain decentralization, a blockchain node must connect and synchronize with other nodes (peers) in the network.

You can define the initial list of peers in the configuration file using [the `peers` field](./configuration.md#peer-configuration).

:::info
Make sure the peers are on the same network. You can verify this by checking the nethash using the [`/api/blocks/getNethash` endpoint](/api-endpoints/blockchain.md#get-blockchain-nethash).
:::

Once connected, the node will automatically discover more peers by querying the peers of its current connections. Discovered peers are saved in the local database, which helps speed up future deployments and restarts.

## Socket connections

For faster transaction syncing between nodes, we recommend enabling [WebSocket Node connections](./configuration.md#websocket-node-configuration) in the configuration.
