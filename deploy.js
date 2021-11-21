require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

const provider = new HDWalletProvider(
  process.env.METAMASK,
  process.env.RINKEBYURL
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const [account] = accounts;
  const defaultMessage = 'ajspeller';

  console.log(`Deploy from account: ${account}`);

  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [defaultMessage],
    })
    .send({ gas: '1000000', from: account });

  console.log(`Contract deployed to: ${result.options.address}`);
  provider.engine.stop();
};

deploy();
