const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let account;
let inbox;
const defaultMessage = 'ajspeller';
const updatedMessage = 'cbspeller';

beforeEach(async () => {
  const fetchedAccounts = await web3.eth.getAccounts();
  [account] = fetchedAccounts;

  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [defaultMessage],
    })
    .send({ from: account, gas: '1000000' });
});

describe('Inbox', () => {
  it(`deploys a contract`, () => {
    assert.ok(inbox.options.address);
  });
  it(`has default message of '${defaultMessage}'`, async () => {
    assert.equal(await inbox.methods.message().call(), defaultMessage);
  });
  it(`updated a message`, async () => {
    await inbox.methods.setMessage(updatedMessage).send({ from: account });
    assert.equal(await inbox.methods.message().call(), updatedMessage);
  });
});
