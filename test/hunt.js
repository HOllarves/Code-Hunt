var HuntContract = artifacts.require("./Hunt.sol");

contract('HuntContract', function (accounts) {

  var contractInstance,
    testBounty = {
      repoUrl: "https://github.com/HOllarves/Code-Hunt",
      issue: 1,
      duration: 432000,
      prize: 2000000000000000000
    }

  it("...should return true on bounty creation.", () => {
    return HuntContract.deployed()
      .then((instance) => {
        contractInstance = instance
        return contractInstance.createBounty(testBounty.repoUrl, testBounty.issue, testBounty.duration, { from: accounts[0], value: 2000000000000000000 })
      })
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
        assert.equal(bounty[0], testBounty.repoUrl, "it should return the same repository url")
        assert.equal(bounty[1], testBounty.issue, "it should return the same issue ID")
        assert.equal(bounty[2], testBounty.prize, "it should return the same prize")
      })
  })

  it("...should be able to get a specific bounty's issue", () => {
    contractInstance.getBountyIssue(accounts[0])
      .then(issue => {
        assert.equal(issue, testBounty.issue, "It should return the bounty's issueID")
      })
  })

  it("...should be able to get a specific bounty's reward", () => {
    contractInstance.getBountyReward(accounts[0])
      .then(reward => {
        assert.equal(reward, testBounty.prize, "It should return the bounty's reward")
      })
  })

  it("...should be able to get all bounties", () => {
    contractInstance.getBounties()
      .then(bounties => {
        assert.equal(bounties.length, 1, "It should return one bounty")
      })
  })

  it("...should submit a hunt request", () => {
    contractInstance.submitHunt(accounts[0], 1)
      .then(response => {
        assert.equal(response, true, "it should return true on hunt submission")
      })
  })

  it("...should cancel own bounty", () => {
    contractInstance.cancelBounty()
      .then(response => {
        assert.equal(response, true, "it should return true on bounty cancelation")
      })
  })

  it("...should accept a hunt submission", () => {
    contractInstance.acceptHunt(accounts[0], accounts[0])
      .then(response => {
        assert.equal(response, true, "it should accept a hunt submission")
      })
  })
});
