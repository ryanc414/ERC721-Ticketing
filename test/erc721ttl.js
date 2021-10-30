const erc721ttl = artifacts.require('erc721ttl');
const timeMachine = require('ganache-time-traveler');
const { expectRevert } = require('@openzeppelin/test-helpers');

const Tue_Jan_01_00_00_00_UTC_2019 = 1546300800;
const Sun_Feb_10_00_00_00_UTC_2019 = 1549756800;
const Wed_Mar_20_00_00_00_UTC_2019 = 1553040000;

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('erc721ttl', (accounts) => {
  let erc721instance;

  beforeEach(async () => {
    const snapshot = await timeMachine.takeSnapshot();
    snapshotId = snapshot.result;
  });

  afterEach(async () => {
    await timeMachine.revertToSnapshot(snapshotId);
  });

  before('Deploy Contracts', async () => {
    /* DEPLOY CONTRACTS HERE */
    erc721instance = await erc721ttl.new('TTL Example', 'TTL', Sun_Feb_10_00_00_00_UTC_2019, { from: accounts[0] });
  });

  it('cannot be destroyed by non-admin', async () => {
    await expectRevert(erc721instance.destroy({ from: accounts[1] }), 'ERC721TTL: must have admin role to destroy');
  });

  it('cannot destroy before ttl', async () => {
    await timeMachine.advanceBlockAndSetTime(Tue_Jan_01_00_00_00_UTC_2019);
    await expectRevert(erc721instance.destroy(), 'ERC721TTL: can only destroy after TTL expires');
  });

  it('can destroy after ttl', async () => {
    await timeMachine.advanceBlockAndSetTime(Wed_Mar_20_00_00_00_UTC_2019);
    await erc721instance.destroy();
  });
});
