# Installation

The following guide is for **Ubuntu Linux**. For more detailed guides on different OS, see:

- [How to run ADAMANT Node on Ubuntu or CentOS Linux](https://news.adamant.im/how-to-run-your-adamant-node-on-ubuntu-990e391e8fcc)
- [How to Install an ADAMANT Node on macOS](https://news.adamant.im/how-to-install-an-adamant-node-on-macos-cfdcb9434b9a)
- [How to run ADAMANT Node on Windows](https://news.adamant.im/how-to-run-adamant-node-on-windows-ee057e6e80d5)
- [How to run ADAMANT Node using Docker (Windows or Mac)](https://news.adamant.im/how-to-run-your-adamant-node-on-docker-windows-or-mac-9a927cf7875a)

## Requirements

- **Ubuntu** v18.04–v24.04 (other versions are not tested)
- **RAM**: 2 GB or more
- **Disk space**: A minimum of 70 GB as of June 2025 (mainnet)
  - Expect the blockchain to grow by approximately _10 GB per year_

## Installation script

For new servers, use the [Installation script](https://github.com/Adamant-im/adamant/blob/dev/tools/install_node.sh) from official repository, or fetch it directly from the ADAMANT website:

```sh
sudo bash -c "$(wget -O - https://adamant.im/install_node.sh)"
```

The script updates Ubuntu packages, creates a dedicated user named `adamant`, sets up a new PostgreSQL database, installs Node.js and other necessary dependencies, configures the ADAMANT mainnet/testnet node, and optionally downloads an up-to-date ADAMANT blockchain image.

Script parameters:

- `-b`: The GitHub branch from which the ADAMANT node will be installed. Default is `master`.
- `-n`: The ADAMANT blockchain network (`mainnet` or `testnet`). Default is `mainnet`.
- `-j`: The Node.js version (`iron`=20 or `jod`=22). Default is `jod`.

For example:

```sh
sudo bash -c "$(wget -O - https://adamant.im/install_node.sh)" -O -b dev -n testnet -j jod
```

## Manual Installation

If you are an experienced Linux user and want more control over installation, you can manually set up the ADAMANT node.

### Prerequisites

- **Toolchain components** — Used for compiling dependencies

  ```sh
  sudo apt-get install -y python build-essential curl automake autoconf libtool
  ```

- **Git** — Used for cloning and updating ADAMANT GitHub repository

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
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    nvm i --lts=jod #Node.js 22 LTS
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

See [Configuration](./configuration) for description of every configuration file property.

### Bootstrap with a blockchain image/snapshot

Using a blockchain snapshot can significantly reduce the initial sync time for your mainnet/testnet node. However, you must fully trust the source of the snapshot, as it bypasses verification of every individual transaction.

If you choose not to use a snapshot, your node will validate the entire blockchain from genesis, which can take several days.

```sh
wget https://explorer.adamant.im/db_backup.sql.gz
gunzip db_backup.sql.gz
psql adamant_main < db_backup.sql
rm db_backup.sql
```

(This example is for mainnet ADM node. For testnet, use the image url: https://testnet.adamant.im/db_test_backup.sql.gz)

Bootstrapping typically takes up to 20 minutes but can save you several days of synchronization time.

### Running ADM node

To verify that everything is set up correctly, start the node temporarily in the terminal:

```sh
node app.js
```

If everything is working properly, you’ll see log output indicating that the blockchain is syncing and the node height is increasing.

Next, run the ADM node using pm2:

```sh
pm2 start --name adamant app.js
```

Check that the node is running smoothly:

```sh
pm2 logs adamant
```

You can also verify the node’s block height and status with simple API requests:

```sh
curl http://localhost:36666/api/blocks/getHeight
curl http://localhost:36666/api/node/status
```

To ensure the node starts automatically after a system reboot, you can add it to your crontab (adjust the path if needed):

```sh
crontab -l | { cat; echo "@reboot cd /home/adamant/adamant && pm2 start --name adamant app.js"; } | crontab -
```

Alternatively, you can use pm2's built-in startup functionality: `pm2 save` — `pm2 startup`.

### Recovering an ADAMANT node

It may happen that your ADM node lost the current blockchain height and restarted, rising from the beginning. The most common reasons are a hardware error or lack of disk space. Though validating blocks from 0 height is a decent option, catching up with the current height may take several days.

If you probably prefer using an up-to-date blockchain image and enabling it back in ten minutes, run this script:

```sh
sudo bash -c "$(wget -O - https://adamant.im/fix_node.sh)" -O -n mainnet
```

Script parameters:

- `-n`: The ADAMANT blockchain network (`mainnet` or `testnet`). Default is `mainnet`.

Alternatively, follow the recovery steps manually.
