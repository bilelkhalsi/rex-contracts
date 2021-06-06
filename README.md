# *REX* Smart Contracts

[![](https://github.com/bilelkhalsi/rex-contracts/workflows/rex-contracts/badge.svg?branch=main)](https://github.com/bilelkhalsi/rex-contracts/actions)


# REX-CONTRACTS

This project hold smart contracts built using solidity & truffle suite.
Smart contracts in this project are built on the following Solidity version : 

```
pragma solidity ^0.8.4;

```

## Development blockchain

Run `yarn start` to get a local [Ganache blockchain network](https://www.trufflesuite.com/docs/ganache/overview) where you can run your smart contracts locally and run integration tests.

## Build

Run `truffle compile` to build contracts. The build artifacts will be stored in the `build/` directory.

## Running truffle tests

Run `truffle test` to execute truffle tests via.

## Deploy contracts

Run `truffle migrate development` to deploy smart contracts in gannache blockchain or any other blockchain of you choice.


### Reference Documentation
For further reference, please consider the following sections:
* [Truffle Suite Documentation](https://www.trufflesuite.com/docs)
* [Solidity Documentation](https://docs.soliditylang.org/en/develop/index.html)
