# Steps to deploy opengsn relay to aws

### 1. Relayer domain

You will need public domain name for running relayer on AWS, best way to do this is to acquire some domain name for this purpose at any domain seller (or acquire it directly at AWS). If you acquire domain somewhere else but in `Route53` you can use this AWS tutorial to transfer DNS from your domain name provider to `Route53` at AWS: <https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/migrate-dns-domain-in-use.html>

### 2. Launch EC2 instance (t2.medium, ubuntu 20.04 preferred)

After you acquire domain name you can launch ec2 instance by going to EC2 service in AWS dashboard and chosing `Launch Instance`. You can reference to this link for documentation on how to get started with EC2:
<https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/launching-instance.html>

Important thing to mention here is that you need to keep track of your private key you create and the security group for instance has to be publicly accessible for relay port (80, 443)

### 3. Allocate Elastic IP address and associate it to the EC2 instance launched

Elastic IP addresses are not changing while dynamically allocated public IPs in EC2 change at instance restart. From EC2 dashboard go to `Elastic IPs` in side menu and create Elastic IP address. After you create it take a not of it and associate it to the existing EC2 instance which you created previously.
Reference to this link in documentation for any issues: <https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html>

### 4. Create A record in hosted zone

For your subdomain to point at Elastic IP associated with the EC2 instance you will need to create A record with value similar to something like `gsn-relayer.<cutomdomainname>.<tld>`. IP address this record should point to will be Elastic IP address from previous step. This domain name should serve as a public domain for your relayer.

### 5. Install git, docker and node

Connect to EC2 instance via ssh and install git, docker and node for ubuntu.

### 6. Clone OpenGSN

Clone open-gsn to your home folder:

    cd
    git clone https://github.com/DistributedCollective/gsn.git

### 7. Add missing dependencies

```bash
cd gsn
yarn add -D @types/web3@"1.0.20" @types/ethereum-protocol@"^1.0.0" -W
```

This will install the missing dependencies and attempt to build the packages. This build will fail with the following error:

```bash
../../node_modules/@truffle/hdwallet-provider/dist/index.d.ts(1,28): error TS7016: Could not find a declaration file for module '@trufflesuite/web3-provider-engine'. 'Code/sovryn/sovryn-devops/aws/create-ec2-relayer/gsn/node_modules/@trufflesuite/web3-provider-engine/index.js' implicitly has an 'any' type.
  Try `npm install @types/trufflesuite__web3-provider-engine` if it exists or add a new declaration (.d.ts) file containing `declare module '@trufflesuite/web3-provider-engine';`
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

### 8. Add type declaration for the truffle provider engine

Add type declaration file for `@trufflesuite/web3-provider-engine` to the opencli package.

```bash
    cat > packages/cli/Index.d.ts < EOF
    declare module '@trufflesuite/web3-provider-engine';
    EOF
```

### 9. Map the declaration file to the tsconfig.json file

```bash
cat > packages/cli/tsconfig.json < EOF
{
  "extends": "../../tsconfig.packages.json",
  "include": [
    "src/**/*.ts",
    "src/compiled/*.json",
    "../contracts/types/truffle-contracts/index.d.ts",
    "../contracts/types/truffle-contracts/types.d.ts",
    "Index.d.ts"
  ],
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  }
}
EOF 
```

### 10. Create a type definition for ProviderEngine

Run `nano  node_modules/@truffle/hdwallet-provider/dist/index.d.ts` and replace

```bash
import ProviderEngine from "@trufflesuite/web3-provider-engine";
```

with

```bash

declare type ProviderEngine = typeof import("@trufflesuite/web3-provider-engine");
```
Then run `yarn install` from the project root. This should successfully install the package.

### 11. Edit .env file

Edit env file in dockers folder:

    cd ~/gsn/dockers/relaydc && vim .env

Update domain name here to contain your sudomain of choice (possibly `gsn-relayer.<cutomdomainname>.<tld>`)

### 12. Edit relay-config.json file in gsn/dockers/relaydc/config/relay-config.json ()

You will need to provide relayer with ownerAddress, versionRegistry and networkUrl. For Mumbai network this would be:

    networkUrl: https://rpc-mumbai.matic.today
    versionRegistry: 0x7380D97dedf9B8EEe5bbE41422645aA19Cd4C8B3
    ownerAddress: <this would be your ethereum address>

### 13. Run .rdc script for local

Run the script for docker containers:

    sudo ./rdc local up -d

### 14. Wait for docker containers to run

Check docker logs to get the status of all containers:

    sudo docker container ls
    sudo docker conainer logs <container_name>

### 15. Create mnemonic file with funded account

Create file containing mnemonic for your ethereum wallet (the owner address):

    vim pass12

### 16. Register Relay

```bash
node ~/gsn/packages/cli/dist/commands/gsn-relayer-register  \
  --from <owners address> \
  --relayUrl <relayer url> \
  --stake 2 \
  --unstakeDelay 100000 \
  --funds 2 \
  --network <node rpc url> \
  --gasPrice 87 \
  --mnemonic `pwd`/pass12
```

- Check if everything is alright by running metacoin tests
