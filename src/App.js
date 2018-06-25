import React, { Component } from 'react'
import HuntContract from '../build/contracts/Hunt.json'
import getWeb3 from './utils/getWeb3'
import './App.css'

//Materialize components
import ButtonAppBar from './components/material/AppBar'
import ButtonBases from './components/material/ButtonBases'
import Form from './components/material/Form'
import Grid from '@material-ui/core/Grid'
import BountyCard from './components/BountyCard'

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
      currentAction: null,
      bountyList: [],
      bountyForm: {}
    }
    this.loadList = this.loadList.bind(this)
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

  /**
   * Instantiates contract and saves it in state
   */
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

  /**
   * Adds new bounty to the blockchain
   * @param {Object} newBounty - The new bounty to be added
   * newBounty:
   *  - repoUrl: string
   *  - userName: string,
   *  - issueId: number,
   *  - duration: number,
   */
  addBounty(newBounty) {
    let bountyPrize = newBounty.prize * 1000000000000000000
    delete newBounty.prize
    this.state.contractInstance.deployed()
      .then(instance => {
        instance.createBounty.sendTransaction(newBounty.repoUrl, newBounty.userName, newBounty.issueID, newBounty.duration, { from: this.state.account, value: bountyPrize })
          .then(() => {
            toast.success("Bounty added", { position: toast.POSITION.BOTTOM_CENTER })
          })
          .catch(error => {
            toast.warn("Unable to add Bounty. It seems there's a bounty already registered with that address", { position: toast.POSITION.BOTTOM_CENTER })
            console.log(error)
          })
      })
  }

  /**
   * Saves oauth token to state variable
   * @param {string} token 
   */
  loadToken(token) {
    this.setState({ accessToken: token })
  }

  /**
   * Reloads form and available bounties
   * whenever a new action is selected.
   * @param {string} selection 
   */
  actionSelected(selection) {
    Promise.all([this.loadList(this.state.contractInstance), this.loadForm()])
      .then(data => {
        let bountyList = data[0],
          bountyForm = data[1]
        this.setState({
          bountyList: bountyList,
          currentAction: selection,
          bountyForm: bountyForm
        })
      })
  }

  loadUserInfo() {

  }

  /**
   * Asynchronously loads the list of available bounties.
   * @param {object} contract - Contract instance 
   */
  async loadList(contract) {
    let contractInstance
    return contract.deployed()
      .then(instance => {
        contractInstance = instance
        return instance.getBounties()
      })
      .then(bounties => {
        if (bounties && bounties.length > 0) {
          let loadedBounties = []
          bounties.forEach(val => {
            loadedBounties.push(contractInstance.getBounty(val))
          })
          return Promise.all(loadedBounties)
        }
      })
      .then(loadedBounties => {
        if (loadedBounties && loadedBounties.length > 0) {
          let stateBounties = []
          loadedBounties.forEach((val, idx) => {
            let bounty = {
              userName: val[0],
              repoUrl: val[1],
              issueID: val[2].c[0],
              prize: val[3].c[0],
              duration: val[4].c[0],
              createdOn: val[5].c[0],
              finsihed: val[6]
            }
            if (!bounty.finsihed)
              stateBounties.push(<Grid item xs={4} key={idx} ><BountyCard data={bounty} auth={this.state.accessToken ? this.state.accessToken : {}} /></Grid>)
          })
          return stateBounties
        }
      })
  }

  /**
   * Returns new bounty form
   */
  loadForm() {
    return (<Grid
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

  // Render function
  render() {
    return (
      <div className="App">
        <Grid
          container
          spacing={24}
          justify='center'>
          <Grid item xs={12}>
            <ButtonAppBar loadAccessToken={this.loadToken.bind(this)} />
          </Grid>
          <Grid item xs={8}>
            <ButtonBases onSelect={this.actionSelected.bind(this)} />
          </Grid>
          <Grid item xs={12}>
            <hr />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={24}
          direction='row'
          justify='center'>
          {this.state.currentAction === "add" && this.state.bountyForm}
          {this.state.currentAction === "list" && this.state.bountyList}
        </Grid>
        <ToastContainer />
      </div>
    )
  }
}
export default App
