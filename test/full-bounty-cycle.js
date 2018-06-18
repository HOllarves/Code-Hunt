var HuntContract = artifacts.require("./Hunt.sol");

contract('Submissions - Declines', function (accounts) {

  var contractInstance,
    testBounty = {
      repoUrl: "https://github.com/HOllarves/Code-Hunt",
      userName: "HOllarves",
      issue: 1,
      duration: 432000,
      prize: 2000000000000000000
    }

  HuntContract.deployed()
    .then(instance => {
      contractInstance = instance
    })

  it("...should return true on bounty creation.", () => {
    contractInstance.createBounty(testBounty.repoUrl, testBounty.userName, testBounty.issue, testBounty.duration, { from: accounts[0], value: 2000000000000000000 })
      .then(transaction => {
        return transaction.receipt.status
      })
      .then(response => {
        assert.equal(response, "0x01", "it should return true on hunt submission")
      })
  });

  it("...should return the bounty created", () => {
    contractInstance.getBounty(accounts[0])
      .then(bounty => {
        assert.equal(bounty[0], testBounty.userName, "it should return the same repository url")
        assert.equal(bounty[1], testBounty.repoUrl, "it should return the same repository url")
        assert.equal(bounty[2], testBounty.issue, "it should return the same issue ID")
        assert.equal(bounty[3], testBounty.prize, "it should return the same prize")
      })
  })

  it("...should submit a hunt request", () => {
    contractInstance.submitHunt(accounts[0], 1, { from: accounts[1] })
      .then(transaction => {
        return transaction.receipt.status
      })
      .then(response => {
        assert.equal(response, "0x01", "it should return true on hunt submission")
      })
  })

  it("...should accept a hunt submission", () => {
    contractInstance.acceptHunt(accounts[1], accounts[0])
      .then(transaction => {
        return transaction.receipt.status
      })
      .then(response => {
        assert.equal(response, "0x01", "it should accept a hunt submission")
      })
  })

});
