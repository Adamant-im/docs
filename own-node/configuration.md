# Configuration

The configuration file locations are `config.json` for mainnet and `test/config.json` for testnet:

```
├── config.json
└── test
    └── config.json
```

You can copy the configuration files from the default templates.

- For mainnet:

  ```sh
  cp config.default.json config.json
  ```

- For testnet:

  ```sh
  cp test/config.default.json test/config.json
  ```

  You can learn more about testnet on the [Testnet page](./testnet.md).

## Configuration Overrides

You can override specific configuration values at startup without editing `config.json` or `test/config.json` directly. Overrides are applied in this order: selected config file → each `--config-overrides` file in command-line order → repeated `--config-set` values → legacy CLI shortcuts (`--port`, `--address`, `--peers`, `--log`, `--snapshot`). The final resolved config is validated against the node config schema before startup.

Use `--config-set` for individual dot-path values:

```sh
node app.js \
  --config test/config.json \
  --genesis test/genesisBlock.json \
  --config-set consensusActivationHeights.fairSystem=4359465 \
  --config-set 'redis={ "url": "redis://127.0.0.1:6379/1", "password": null }'
```

The same flags work through npm scripts:

```sh
npm run start -- --config-set port=36667
npm run start:testnet -- --config-set api.access.public=true
```

Use `--config-overrides` for a file with multiple overrides. Non-`.json` files are parsed as env-style `key=value` pairs (one per line):

```dotenv
consensusActivationHeights.fairSystem=4359465
redis={ "url": "redis://127.0.0.1:6379/1", "password": null }
```

Files ending in `.json` are parsed as nested JSON partial overrides:

```json
{
  "consensusActivationHeights": {
    "fairSystem": 4359465
  },
  "redis": {
    "url": "redis://127.0.0.1:6379/1",
    "password": null
  }
}
```

Values are parsed as JSON first, so numbers, booleans, `null`, arrays, and objects keep their types. Unknown paths, malformed values, and schema-invalid values fail before startup.

::: warning
Be careful when overriding `consensusActivationHeights.*`: using activation heights that do not match the selected network can make a node diverge from that network. See [Consensus](./consensus.md) for details on consensus activation.
:::

## Logging

The node has three configurable log outputs: a general log, a debug log, and console output.

- **General Log**

  Configures the main log file with `generalLog`:

  ```json
  {
    "generalLog": {
      "enabled": true,
      "fileName": "logs-mainnet/adamant.log",
      "level": "warn",
      "rotate": {
        "enabled": true,
        "maxSize": "300M",
        "retain": 5,
        "rotateInterval": "0 0 0 1 *",
        "rotateOnRestart": true
      }
    }
  }
  ```

  - `enabled`: Enable or disable this log output.
  - `fileName`: Path to the log file. You can use `.log`, `.txt`, or any other extension.
  - `level`: Minimum log level to write.
  - `rotate.enabled`: Enable log rotation.
  - `rotate.maxSize`: Maximum log file size before rotation (e.g., `"300M"`).
  - `rotate.retain`: Number of rotated files to keep.
  - `rotate.rotateInterval`: Cron expression for scheduled rotation.
  - `rotate.rotateOnRestart`: Rotate the log file on every node restart.

- **Debug Log**

  Configures a verbose debug log file with `debugLog`. Accepts the same properties as `generalLog`. Typically set to `level: "trace"` to capture all output.

  ```json
  {
    "debugLog": {
      "enabled": true,
      "fileName": "logs-mainnet/adamant_debug.log",
      "level": "trace",
      "rotate": {
        "enabled": true,
        "maxSize": "300M",
        "retain": 7,
        "rotateInterval": "0 0 * * *",
        "rotateOnRestart": true
      }
    }
  }
  ```

- **Console Log**

  Configures logging to standard output with `consoleLog`:

  ```json
  {
    "consoleLog": {
      "enabled": true,
      "level": "info"
    }
  }
  ```

  - `enabled`: Enable or disable console output.
  - `level`: Minimum log level to print.

Possible log levels (from least to most verbose):

- `fatal`
- `error`
- `warn`
- `info`
- `log`
- `debug`
- `trace`
- `none` — disables all output for that target

## Server Configuration

- **Port**

  Specify the server's API port with the `port` property:

  ```json
  {
    "port": 36666
  }
  ```

- **Address**

  Define the server's listening address using the `address` property:

  ```json
  {
    "address": "0.0.0.0"
  }
  ```

  Example: `0.0.0.0` (binds to all network interfaces).

- **Trust Proxy**

  Enable or disable trusting proxy headers using the `trustProxy` property:

  ```json
  {
    "trustProxy": false
  }
  ```

- **Cache**

  Enable the in-memory Redis cache for API responses with `cacheEnabled`:

  ```json
  {
    "cacheEnabled": false
  }
  ```

  Cache is disabled by default on mainnet and enabled on testnet. Enabling it can improve API response times for high-traffic public nodes.

## Database Configuration

- **Database Connection**

  Configure database connection settings with the `db` object:

  ```json
  {
    "db": {
      "host": "localhost",
      "port": 5432,
      "database": "adamant_main",
      "user": "adamant",
      "password": "password",
      "poolSize": 95,
      "poolIdleTimeout": 30000,
      "reapIntervalMillis": 1000,
      "logEvents": ["error"]
    }
  }
  ```

  - `host`: Database host (e.g., `localhost`).
  - `port`: Database port (e.g., `5432`).
  - `database`: Name of the database (e.g., `adamant_main`).
  - `user`: Database username (e.g., `adamant`).
  - `password`: Database password.
  - `poolSize`: Number of connections in the pool (recommended: `95`).
  - `poolIdleTimeout`: Time (ms) before idle connections close (recommended: `30000`).
  - `reapIntervalMillis`: Interval (ms) to clean idle connections (recommended: `1000`).
  - `logEvents`: List of events to log (e.g., `["error"]`).

## Redis Configuration

Redis is used for caching. Required.

- **Redis Connection**

  Configure Redis connection settings with the `redis` object:

  ```json
  {
    "redis": {
      "url": "redis://127.0.0.1:6379/0",
      "password": null
    }
  }
  ```

  - `url`: Redis server URL (e.g., `redis://127.0.0.1:6379/0`).
  - `password`: Redis password (string or `null`).

## API Configuration

> [!Note]
> Even when a node's Public API is disabled (including `api.enabled` = `false`, `api.access.public` = `false`), other nodes can still connect to it for block exchange — such nodes still participate in blockchain synchronization.

> [!Warning]
> Nodes with a Public API, used by applications, require more CPU since they execute many SQL queries.

- **API Settings**

  Control Public API behavior with the `api` object:

  ```json
  {
    "api": {
      "enabled": true,
      "access": {
        "public": false,
        "whiteList": ["127.0.0.1"]
      },
      "options": {
        "limits": {
          "max": 0,
          "delayMs": 0,
          "delayAfter": 0,
          "windowMs": 60000
        }
      }
    }
  }
  ```

  - `enabled`: Enable or disable the Public API (e.g., `true`).
  - `access.public`: Allow public API access for any IP address (recommended: `false`).
  - `access.whiteList`: List of allowed IP addresses if `access.public` is `false` (e.g., `["127.0.0.1"]`).
  - `options.limits`: API rate-limiting options:
    - `max`: Max requests per window (e.g., `0`, unlimited).
    - `delayMs`: Delay (ms) before responding to requests (e.g., `0`).
    - `delayAfter`: Start delaying after N requests (e.g., `0`).
    - `windowMs`: Time window for rate limits (e.g., `60000`).

## Peer Configuration

- **Peer Settings**

  Configure peer connections with the `peers` object:

  ```json
  {
    "peers": {
      "enabled": true,
      "list": [
        { "ip": "95.216.114.252", "port": 36666 },
        { "ip": "149.102.157.15", "port": 36666 }
      ],
      "access": { "blackList": [] },
      "options": {
        "limits": {
          "max": 0,
          "delayMs": 0,
          "delayAfter": 0,
          "windowMs": 60000
        },
        "timeout": 5000
      }
    }
  }
  ```

  - `enabled`: Enable or disable peer connections (default: `true`).
  - `list`: List of peer IPs and ports. See the full list in [config.default.json](https://github.com/Adamant-im/adamant/blob/master/config.default.json).
  - `access.blackList`: List of blocked IPs (e.g., `["222.222.222.222"]`).
  - `options.limits`: Peer rate-limiting options:
    - `max`: Max requests per window (e.g., `0`, unlimited).
    - `delayMs`: Delay (ms) before responding (e.g., `0`).
    - `delayAfter`: Start delaying after N requests (e.g., `0`).
    - `windowMs`: Time window for rate limits (e.g., `60000`).
  - `options.timeout`: Peer connection timeout (ms, default: `5000`).

## Broadcast Configuration

- **Broadcast Settings**

  Control broadcast behavior with the `broadcasts` object:

  ```json
  {
    "broadcasts": {
      "broadcastInterval": 1500,
      "broadcastLimit": 20,
      "parallelLimit": 20,
      "releaseLimit": 25,
      "relayLimit": 4
    }
  }
  ```

  - `broadcastInterval`: The interval (in ms) at which the node broadcasts unconfirmed transactions (recommended: `1500`).
  - `broadcastLimit`: The number of peers a node broadcasts to per interval (recommended: `20`).
  - `parallelLimit`: The maximum number of asynchronous requests the node can make when broadcasting (recommended: `20`).

    - Example: If `parallelLimit = 5` and `broadcastLimit = 10`, the node will first send transactions to 5 peers asynchronously, then process another 5.

  - `releaseLimit`: The number of transactions, blocks, and signatures included in each broadcast (recommended: `25`).

    - Example: If 10 transactions are waiting to be broadcast and `releaseLimit = 5`, only 5 will be sent in the next broadcast.

  - `relayLimit`: The maximum relay count at which a node will still broadcast an unconfirmed transaction (recommended: `4`).

    - Example: If a transaction has already been broadcast to 5 nodes and `relayLimit = 4`, the node will process the transaction but will not broadcast it further.

## Transaction Configuration

- **Transaction Queue**

  Control transaction queue size with the `transactions` object:

  ```json
  {
    "transactions": {
      "maxTxsPerQueue": 1000
    }
  }
  ```

  - `maxTxsPerQueue`: Max transactions per queue (recommended: `1000`).

## Consensus Activation Heights

The `consensusActivationHeights` object defines the block heights at which consensus upgrades become active:

```json
{
  "consensusActivationHeights": {
    "fairSystem": 4359465,
    "spaceship": 100000000
  }
}
```

- `fairSystem`: Height at which the Fair dPoS voting system activates. On mainnet, this is `4359465`. See [Consensus](./consensus.md#fairsystem) for details.
- `spaceship`: Height at which the `timestampMs` field is preserved in transactions. On mainnet, this is `100000000` (far future; already activated on testnet). See [Consensus](./consensus.md#spaceship) for details.

These values match the mainnet network. **Do not change them for a mainnet node**, as mismatched heights will cause the node to diverge from the network. For testnet or localnet experimentation, you can override these values using [configuration overrides](#configuration-overrides).

## Forging Configuration

- **Forging Settings**

  Configure forging behavior with the `forging` object. Each `secret` entry is a string.
  A plaintext delegate passphrase still forges as before. Starting with node v0.11.0, a value is
  encrypted only when it starts with the prefix `admnode-enc-v1.` (including the final dot).

  ```json
  {
    "forging": {
      "force": false,
      "secret": [],
      "controlSocket": "",
      "access": {
        "whiteList": ["127.0.0.1"]
      }
    }
  }
  ```

  - `force`: Force forging regardless of network state (default: `false`).
  - `secret`: List of delegate forging passphrases. Plaintext entries keep working.
    An encrypted entry is one string that starts with `admnode-enc-v1.`.
  - `controlSocket`: Path of the local Unix socket used to unlock, lock, and check encrypted
    passphrases. Available in node v0.11.0. An empty string uses
    `<node directory>/.run/control-<port>.sock`, which does not depend on `TMPDIR`,
    `XDG_RUNTIME_DIR`, systemd `PrivateTmp`, `sudo`, or the shell. The socket file is mode `0600`,
    and its directory is mode `0700`.
  - `access.whiteList`: Allowed forging IPs (e.g., `["127.0.0.1"]`).

- **Encrypted Delegate Passphrases**

  Node v0.11.0 can store delegate passphrases in `forging.secret` encrypted with one operator
  password. Encryption is optional until a separate deprecation notice. Plaintext configs need no
  migration. Every encrypted delegate on the node shares that password. Plaintext entries in the
  same array still forge without it.

  The encrypted value is AES-256-GCM. The key is derived from the operator password with scrypt
  (`N=131072`, `r=8`, `p=1`). Decrypt accepts only those parameters, and any later change to them
  requires a new prefix version. The value also stores the delegate public key and address. Those
  are already public on chain, so a locked node can name the delegate without decrypting.

  The operator password must be at least 12 characters long and must differ from the delegate
  passphrase. It is not part of the config object, so it is not written back to `config.json`.
  Decrypted passphrases are not written back either, and neither value is logged. After unlock, only
  delegate keypairs stay in memory. Restarting the node requires the password again.

  **Encrypt a passphrase.** Run the command from the node directory as the node's system user.
  `forging encrypt` prompts for one delegate passphrase and the operator password, then prints a
  single `admnode-enc-v1.` line. It does not take the passphrase or the password as arguments.
  Replace the plaintext entry with that line. Repeat for each delegate, using the same operator
  password, and leave `secret` as an array.

  ```sh
  npm run adm-node -- forging encrypt
  ```

  Before it prompts, the command warns when a node in this directory could not open its control
  socket. The usual cause is a node directory that other users can write to, such as mode `0775`
  after a `002` umask. Older installation scripts could leave the directory that way. Fix it
  before you restart the node, or the encrypted delegates cannot be unlocked:

  ```sh
  chmod g-w,o-w /home/adamant/adamant
  ```

  If `controlSocket` is set, check that path instead with
  `npm run adm-node -- forging encrypt --socket <path>`.

  The line below is a placeholder. Put the printed value in `secret` instead:

  ```json
  {
    "forging": {
      "force": false,
      "secret": [
        "admnode-enc-v1.<encrypted-passphrase>"
      ],
      "controlSocket": "",
      "access": {
        "whiteList": ["127.0.0.1"]
      }
    }
  }
  ```

  A malformed `admnode-enc-v1.` entry is ignored and reported in the log. Startup continues.

  **Unlock and lock.** When every configured secret is plaintext, forging behavior is unchanged.

  When an encrypted secret is present, the node still syncs and still serves the API, peers, and
  the mempool. Forging for those delegates stays locked until the password is supplied. A missing
  or wrong password does not stop the node.

  - If the node runs in a terminal, it prompts once after the blockchain has loaded. Press Enter to
    stay locked.
  - Otherwise, for example under pm2 or systemd, the node starts locked. Unlock it over the local
    control socket.

  The node does not accept the operator password as a command-line option or an environment
  variable, because other local users could read it from the process list or the environment.

  ```sh
  npm run adm-node -- forging status
  npm run adm-node -- forging unlock
  npm run adm-node -- forging lock
  ```

  - `forging status` reports the lock state, how many encrypted and plaintext delegates are
    configured, and the address and public key of each encrypted delegate and each loaded
    plaintext delegate. It does not print
    passphrases or the operator password. While the blockchain loads or rebuilds, the state is
    `loading`.
  - `forging unlock` prompts for the operator password and loads every encrypted delegate with
    that password. If any encrypted entry does not match, the unlock fails and encrypted keypairs
    from that attempt are not kept. Unlock also works while the node is loading. Forging starts
    once the blockchain is ready.
  - `forging lock` clears keypairs that were unlocked from encrypted config entries. A delegate
    that is also configured in plaintext stays loaded.

  `unlock`, `lock`, and `status` talk to the running node over its local control socket. Run them
  as the node's system user. Pass the same `--config`, `--config-overrides`, `--config-set`, and
  `--port` options that started the node, so the CLI finds the same socket. Use `--socket` to give
  the socket path directly.

  ```sh
  npm run adm-node -- forging unlock --config test/config.json
  ```

  A custom `controlSocket` must be in a directory that belongs to the node's user and has mode
  `0700`. No directory above it may be writable by other users. Shared sticky directories such as
  `/tmp` are allowed. The node creates a missing directory, but it never changes the permissions
  of an existing one. If the control socket cannot be created, the node still starts, and the CLI
  cannot unlock forging until the socket is available.

  **Monitoring.** Every restart leaves encrypted delegates locked until someone runs
  `forging unlock`, so monitor the lock state. Forging state is not exposed by the public HTTP or
  peer APIs. For automation, `forging status --json --timeout 2000` prints one line without
  delegate addresses or public keys:

  ```json
  {"state":"locked","encrypted":3,"encryptedLoaded":0,"plaintext":0,"invalidEncrypted":0,"loadedKeypairs":0}
  ```

  The node repository includes Zabbix examples in `tools/zabbix/`: a local lock-state template for
  the node host and a separate missed-block template based on public chain data.

## Loading Configuration

- **Loading Settings**

  Control blockchain rebuilding in case of invalid data in the database with the `loading` object:

  ```json
  {
    "loading": {
      "loadPerIteration": 5000,
      "memCheckpoints": {
        "enabled": true
      }
    }
  }
  ```

  - `loadPerIteration`: Max blocks to verify per iteration (recommended: `5000`).
  - `memCheckpoints.enabled`: Enable persisted checkpoints of derived `mem_*` tables for crash recovery (default: `true`). When startup detects inconsistent memory mirrors, the node attempts to restore the latest verified checkpoint and replay only blocks after the checkpoint height. If verification or replay fails, behavior falls back to the existing full memory-table rebuild from genesis.

    Checkpoints are created after fully persisted blocks at completed round boundaries. During catch-up sync, creation is throttled to every 100th round. The node keeps three rotating checkpoint slots in the database (`mem_ckpt_0..2_*` plus `mem_state_checkpoint_meta`).

    Checkpoints are a local recovery cache only. They do not replace graceful shutdown, trusted database snapshots, or blocks as the source of truth. Disabling checkpoints does not prevent recovery, but forces a full rebuild from genesis whenever `mem_*` validation fails.

    See [Installation — Mem-table checkpoint recovery](./installation.md#mem-table-checkpoint-recovery) for operator guidance and log examples.

## SSL Configuration

- **SSL Settings**

  Configure SSL options with the `ssl` object:

  ```json
  {
    "ssl": {
      "enabled": false,
      "options": {
        "port": 443,
        "address": "0.0.0.0",
        "key": "./ssl/adamant.key",
        "cert": "./ssl/adamant.crt"
      }
    }
  }
  ```

  - `enabled`: Enable or disable SSL (e.g., `false`).
  - `options.port`: SSL port (e.g., `443`).
  - `options.address`: Listening address for SSL (e.g., `0.0.0.0`).
  - `options.key`: Path to SSL key file.
  - `options.cert`: Path to SSL certificate file.

## DApp Configuration

- **DApp Settings**

  Control DApp settings with the `dapp` object:

  ```json
  {
    "dapp": {
      "masterrequired": true,
      "masterpassword": "",
      "autoexec": []
    }
  }
  ```

  - `masterrequired`: Require master password for DApp execution (recommended: `true`).
  - `masterpassword`: Master password (e.g., `""`).
  - `autoexec`: List of auto-executable scripts (e.g., `[]`).

## WebSocket Client Configuration

- **WebSocket Client**

  Configure WebSocket client settings with the `wsClient` object:

  ```json
  {
    "wsClient": {
      "enabled": true,
      "portWS": 36668
    }
  }
  ```

  - `enabled`: Enable or disable WebSocket client (e.g., `true`).
  - `portWS`: WebSocket client port (e.g., `36668` for mainnet, `36665` for testnet).

## WebSocket Node Configuration

- **WebSocket Node**

  Configure WebSocket node-to-node connection for syncing with the `wsNode` object:

  ```json
  {
    "wsNode": {
      "enabled": true,
      "maxBroadcastConnections": 15,
      "maxReceiveConnections": 25
    }
  }
  ```

  - `enabled`: Enable or disable WebSocket node-to-node communication.
  - `maxBroadcastConnections`: Maximum number of outbound WebSocket connections used to broadcast data to other nodes.
  - `maxReceiveConnections`: Maximum number of inbound WebSocket connections from other nodes.

## Nethash Configuration

- **Nethash**

  The `nethash` property represents the unique identifier for the blockchain network. It ensures the application connects to the correct network and prevents accidental cross-network operations (e.g., mixing transactions between `mainnet` and `testnet`).

  Example configuration for **mainnet**:

  ```json
  {
    "nethash": "bd330166898377fb28743ceef5e43a5d9d0a3efd9b3451fb7bc53530bb0a6d64"
  }
  ```

  Example configuration for **testnet**:

  ```json
  {
    "nethash": "38f153a81332dea86751451fd992df26a9249f0834f72f58f84ac31cceb70f43"
  }
  ```

  You can find or verify the `nethash` using the genesis block (`genesisBlock.json` or `test/genesisBlock.json` based on your blockchain network). The node derives `nethash` from `genesisBlock.payloadHash` — the SHA-256 payload hash verified from the genesis block transactions. It is not a random identifier.

## CORS

- **CORS**

  By default, ADAMANT Node allows any origin to make requests. You can control [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) with the `cors` object in `config.json`, which accepts the following properties:

  - `origin`: Configures the **Access-Control-Allow-Origin** CORS header. Possible values:
    - `Boolean` — set `origin` to `true` to reflect the request origin, or set it to `false` to disable CORS.
    - `String` — set `origin` to a specific origin. For example, `"http://example.com"` allows only requests from that origin.
    - `Array` — set `origin` to an array of valid origins. For example `["http://example1.com", "http://example2.com/"]`.
  - `methods`: Configures the **Access-Control-Allow-Methods** CORS header. Expects a comma-delimited string (e.g., `'GET,PUT,POST'`) or an array (e.g., `['GET', 'PUT', 'POST']`).

  Example:

  ```json
  {
    "cors": {
      "origin": "http://example1.com",
      "methods": "GET,PUT,POST"
    }
  }
  ```
