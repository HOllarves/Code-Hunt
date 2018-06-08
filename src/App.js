import React, { Component } from 'react'
import HuntContract from '../build/contracts/Hunt.json'
import getWeb3 from './utils/getWeb3'
import './App.css'

//Materialize components
import ButtonAppBar from './components/material/AppBar'
import Paper from './components/material/Paper'
import ButtonBases from './components/material/ButtonBases'
import Form from './components/material/Form'
import Grid from '@material-ui/core/Grid'

//Toast
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractInstance: {},
      web3: null,
      accessToken: '',
      currentAction: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })
        // Instantiate contract once web3 provided.
        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const huntContract = contract(HuntContract)
    huntContract.setProvider(this.state.web3.currentProvider)
    this.state.web3.eth.getAccounts((error, accounts) => {
      if (error) console.log(error)
      else {
        this.setState({
          contractInstance: huntContract,
          account: accounts[0]
        })
      }
    })
  }

  addBounty(newBounty) {
    let bountyPrize = newBounty.prize * 1000000000000000000
    delete newBounty.prize
    this.state.contractInstance.deployed()
      .then(instance => {
        instance.createBounty.sendTransaction(newBounty.repoUrl, newBounty.issueID, newBounty.duration, { from: this.state.account, value: bountyPrize })
          .then(() => {
            toast.success("Bounty added", { position: toast.POSITION.BOTTOM_CENTER })
          })
          .catch(error => {
            toast.warn("Unable to add Bounty. Please check the console", { position: toast.POSITION.BOTTOM_CENTER })
            console.log(error)
          })
      })
  }

  loadToken(token) {
    this.setState({ accessToken: token })
  }

  actionSelected(selection) {
    this.setState({ currentAction: selection })
  }

  render() {
    let action
    if (this.state.currentAction) {
      if (this.state.currentAction === "list") {
        this.state.contractInstance.deployed()
          .then(instance => {
            return instance.getBounties()
          })
          .then(bounties => {
            console.log(bounties)
          })
      }
      if (this.state.currentAction === "add") {
        action = (
          <Grid
            container
            spacing={16}
            justify={'center'}
            direction={'row'}>
            <Grid
              item
              xs={8}>
              <Form newBounty={this.addBounty.bind(this)} />
            </Grid>
          </Grid>)
      }
    }

    return (
      <div className="App">
        <ButtonAppBar loadAccessToken={this.loadToken.bind(this)} />
        <Grid
          container
          spacing={24}
          justify={'center'}>
          <Grid item xs={8}>
            <Paper />
          </Grid>
          <Grid item xs={8}>
            <ButtonBases onSelect={this.actionSelected.bind(this)} />
          </Grid>
        </Grid>
        {this.state.currentAction ? action : null}
        <ToastContainer />
      </div>
    );
  }
}

export default App
