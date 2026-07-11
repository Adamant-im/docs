# Installation

The following guide is for **Ubuntu Linux**. For more detailed guides on different OS, see:

- [How to run ADAMANT Node on Ubuntu or CentOS Linux](https://news.adamant.im/how-to-run-your-adamant-node-on-ubuntu-990e391e8fcc)
- [How to Install an ADAMANT Node on macOS](https://news.adamant.im/how-to-install-an-adamant-node-on-macos-cfdcb9434b9a)
- [How to run ADAMANT Node on Windows](https://news.adamant.im/how-to-run-adamant-node-on-windows-ee057e6e80d5)
- [How to run ADAMANT Node using Docker (Windows or Mac)](https://news.adamant.im/how-to-run-your-adamant-node-on-docker-windows-or-mac-9a927cf7875a)

## Requirements

- **Ubuntu** v20.04–v26.04 LTS (other versions are not tested)
- **Node.js** v22.13.0 or newer
- **RAM**: 2 GB or more
- **Disk space**: A minimum of 70 GB as of June 2026 (mainnet)
  - Expect the blockchain to grow by approximately _10 GB per year_

## Installation script

For new servers, use the [Installation script](https://github.com/Adamant-im/adamant/blob/dev/tools/install_node.sh) from the official repository, or fetch it directly from the ADAMANT website:

```sh
sudo bash -c "$(wget -O - https://adamant.im/install_node.sh)"
```

The script updates Ubuntu packages, creates a dedicated user named `adamant`, sets up a new PostgreSQL database, installs Node.js and other necessary dependencies, configures the ADAMANT mainnet/testnet node, and optionally downloads an up-to-date ADAMANT blockchain image. It preserves existing configuration files and local Git changes, and reuses existing users and databases.

Script parameters:

- `-b`: The GitHub branch from which the ADAMANT node will be installed. Default is `master`.
- `-n`: The ADAMANT blockchain network (`mainnet` or `testnet`). Default is `mainnet`.
- `-j`: The Node.js version (`22`, `jod`=22, `24`, `krypton`=24, or `26`). Default is `24`.

For example:

```sh
sudo bash -c "$(wget -O - https://adamant.im/install_node.sh)" -O -b dev -n testnet -j 24
```

A RHEL-compatible installer (CentOS Stream, Rocky Linux, AlmaLinux, RHEL 8–10) is also available:

```sh
sudo bash -c "$(wget -O - https://adamant.im/install_node_centos.sh)" -O -b dev -n mainnet -j 24
```

## Manual Installation

If you are an experienced Linux user and want more control over installation, you can manually set up the ADAMANT node.

### Prerequisites

- **Toolchain components** — Used for compiling dependencies

  ```sh
  sudo apt-get install -y python build-essential curl automake autoconf libtool
  ```

- **Git** — Used for cloning and updating the ADAMANT GitHub repository

  ```sh
  sudo apt-get install -y git
  ```

- **Node.js** — Node.js serves as the underlying engine for code execution

  - Install system-wide via package manager:

    ```sh
    curl -sL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

  - Or locally, using [nvm](https://github.com/nvm-sh/nvm):

    ```sh
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash
    nvm install --lts=krypton  # Node.js 24 LTS
    ```

- **PostgreSQL** — Database engine to store blockchain data

  Install PostgreSQL:

  ```sh
  sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
  wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -
  sudo apt-get update
  sudo apt-get install -y postgresql postgresql-contrib libpq-dev
  ```

  Create a new user:

  ```sh
  adduser adamant
  sudo usermod -aG sudo adamant
  su - adamant
  ```

  Create `adamant_main` and `adamant_test` databases:

  ```sh
  sudo -u postgres createuser --createdb $USER
  createdb adamant_test
  createdb adamant_main
  sudo -u postgres psql -d adamant_test -c "alter user "$USER" with password 'password';"
  sudo -u postgres psql -d adamant_main -c "alter user "$USER" with password 'password';"
  ```

- **pm2** — Node.js process manager for managing ADAMANT node execution

  ```sh
  sudo npm install -g pm2
  ```

### Installation Steps

Clone the ADAMANT repository using Git and initialize the modules.

```sh
su - adamant
git clone https://github.com/Adamant-im/adamant
cd adamant
npm install
```

Copy the default config file by running the following command:

```sh
cp config.default.json config.json
```

Edit the `config.json` file using your preferred text editor, for example, Vim or Nano.

```sh
nano config.json
```

Make the necessary changes to the configuration values in the file. At minimum, you should change the value of the `db.password` property to your actual database password.

See [Configuration](./configuration) for a description of every configuration file property.

### Bootstrap with a blockchain image/snapshot

Using a blockchain snapshot can significantly reduce the initial sync time for your mainnet/testnet node. However, you must fully trust the source of the snapshot, as it bypasses verification of every individual transaction.

If you choose not to use a snapshot, your node will validate the entire blockchain from genesis, which can take several days.

```sh
wget https://explorer.adamant.im/db_backup.sql.gz
gunzip db_backup.sql.gz
psql adamant_main < db_backup.sql
rm db_backup.sql
```

(This example is for the mainnet ADM node. For testnet, use the image URL: https://testnet.adamant.im/db_test_backup.sql.gz)

Bootstrapping typically takes up to 20 minutes but can save you several days of synchronization time.

### Running ADM node

To verify that everything is set up correctly, start the node temporarily in the terminal:

```sh
node app.js
```

If everything is working properly, you'll see log output indicating that the blockchain is syncing and the node height is increasing.

Next, run the ADM node using pm2:

```sh
pm2 start --name adamant app.js
```

Check that the node is running smoothly:

```sh
pm2 logs adamant
```

You can also verify the node's block height and status with simple API requests:

```sh
curl http://localhost:36666/api/blocks/getHeight
curl http://localhost:36666/api/node/status
```

To ensure the node starts automatically after a system reboot, you can add it to your crontab (adjust the path if needed):

```sh
crontab -l | { cat; echo "@reboot cd /home/adamant/adamant && pm2 start --name adamant app.js"; } | crontab -
```

Alternatively, you can use pm2's built-in startup functionality: `pm2 save` — `pm2 startup`.

::: warning Critical Shutdown Notice
Always stop the node gracefully. When running it in the foreground, press `Ctrl+C` and wait for cleanup to finish. Do not use `kill -9` or any other forced termination unless the process is already unrecoverably stuck.

After `Ctrl+C` / `SIGINT` / `SIGTERM`, shutdown is not always immediate. The node may log messages such as `Waiting for loader to finish active sync/rebuild…` or `Waiting for block processing to finish…` while it drains in-flight work safely. Wait until cleanup completes (for example `Cleaned up successfully`) before restarting, closing the terminal, or killing the process. Restarting too early can leave derived `mem_*` tables inconsistent and force a long rebuild on the next startup.

The node stores derived consensus state in memory tables (`mem_accounts`, `mem_round`, and related mirrors). A forced kill can leave these inconsistent with the persisted blockchain. On the next startup this can appear as:

```text
[WRN] loader Detected unapplied rounds in mem_round
[WRN] loader Recreating memory tables…
[inf] loader Rebuilding blockchain, current block height: 1…
```

Do not repair `mem_*` tables with manual SQL edits. The reliable recovery options are restoring a trusted database snapshot or letting the node rebuild/replay derived state from the blockchain.
:::

### Mem-table checkpoint recovery

When enabled (default), the node persists rotating checkpoints of derived `mem_*` tables at completed round boundaries. If startup detects inconsistent memory mirrors, the loader first attempts to restore the latest verified checkpoint and replay only blocks after the checkpoint height:

```text
[inf] loader Recovering from mem-table checkpoint at height 1234567…
[inf] loader Rebuilding blockchain, current block height: 1234568…
```

Checkpoints are a local recovery cache only. Blocks and deterministic replay remain the source of truth. If checkpoint verification or replay fails, the node falls back to a full memory-table rebuild from genesis. You can disable this behavior with [`loading.memCheckpoints.enabled`](./configuration.md#loading-configuration).

During catch-up sync, checkpoint creation is throttled (every 100th round) so sync throughput is not reduced by frequent `mem_*` copies. Under normal operation, a checkpoint is written after each completed round.

::: info Storage impact
Checkpoints use three rotating database slots plus metadata. On current mainnet, expect roughly 48 MB per slot and under 150 MB total for all retained slots. Budget extra free disk space for growth and rotation overhead.
:::

### Recovering an ADAMANT node

It may happen that your ADM node lost the current blockchain height and restarted from the beginning. The most common reasons are a hardware error or lack of disk space. Although validating blocks from height 0 is a valid option, catching up with the current height may take several days.

If the node only needs to recover inconsistent `mem_*` tables while the persisted blockchain is intact, checkpoint recovery (when available) or a local rebuild/replay is usually faster than restoring a full database image.

If you prefer to use an up-to-date blockchain image and restore the node in minutes, run this script:

```sh
sudo bash -c "$(wget -O - https://adamant.im/fix_node.sh)" -O -n mainnet
```

Script parameters:

- `-n`: The ADAMANT blockchain network (`mainnet` or `testnet`). Default is `mainnet`.

The repair tool drops the database to free disk space, downloads and validates the replacement image, then recreates the database and restores it from the snapshot. Back up any required data first.

Alternatively, follow the recovery steps manually.
