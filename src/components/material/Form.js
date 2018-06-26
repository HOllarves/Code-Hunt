//React
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

//Materialize
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import NextIcon from '@material-ui/icons/KeyboardArrowRight'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'
import Grid from '@material-ui/core/Grid'

//3rd party libs
import validator from 'validator'
import Octokit from '@octokit/rest'
import toast from 'react-toastify'
import isGitUrl from 'is-git-url'
import githubUrlParser from 'parse-github-url'

//Internal components
import RepoCard from '../RepoCard'
import IssueCard from '../IssueCard'

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    menu: {
        width: 200,
    },
    button: {
        margin: theme.spacing.unit,
    },
    bountyCardTitle: {
        textAlign: 'center'
    }
})

class Form extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            repoUrl: { value: '', valid: false },
            issueID: { value: '', valid: false },
            prize: { value: '', valid: false },
            duration: { value: '', valid: false },
            selectedRepo: {},
            selectedIssue: {},
            repoOwner: '',
            wizIndex: 0,
            ghParsedObj: {},
            loadCards: false
        }
        this.loadCards = false;
        this.octokit = new Octokit({ headers: { accept: 'application/vnd.github.v3+json', 'user-agent': 'octokit/rest.js v1.2.3' } })
    }

    submitForm() {
        if (this.state.repoUrl.value
            && this.state.ghParsedObj.owner
            && this.state.issueID.value
            && this.state.prize.value
            && this.state.duration.value) {
            let newBounty = {
                repoUrl: this.state.repoUrl.value,
                userName: this.state.ghParsedObj.owner,
                issueID: parseInt(this.state.issueID.value, 10),
                prize: parseFloat(this.state.prize.value, 10),
                duration: parseInt(this.state.duration.value, 10)
            }
            this.props.newBounty(newBounty)
        } else {
            toast.error("Oops! Invalid form.")
        }
    }

    next() {
        if (this.state.wizIndex === 0 && this.state.repoUrl.valid) {
            let ghObject = githubUrlParser(this.state.repoUrl.value)
            if (ghObject
                && ghObject.owner
                && ghObject.name
                && ghObject.repo) {
                this.octokit.repos.get({ owner: ghObject.owner, repo: ghObject.name })
                    .then(response => {
                        if (response && response.data) {
                            this.selectIssue = true;
                            this.setState({
                                selectedRepo: response.data,
                                repoOwner: ghObject.owner,
                                wizIndex: ++this.state.wizIndex,
                                ghParsedObj: ghObject,
                            })
                        }
                    })
                    .catch(error => {
                        // Error display
                        console.log(error)
                    })
            }

        }

        if (this.state.wizIndex === 1 && this.state.issueID.valid) {
            this.octokit.issues.get({
                owner: this.state.ghParsedObj.owner,
                repo: this.state.ghParsedObj.name,
                number: this.state.issueID.value
            }).then(response => {
                if (response
                    && response.status === 200
                    && response.data) {
                    this.setState({
                        selectedIssue: response.data,
                        wizIndex: ++this.state.wizIndex,
                        loadCards: true
                    })
                }
            }).catch(error => {
                // Error display
                console.log(error)
            })
        }

        if (this.state.wizIndex === 2 && this.state.prize.valid) {
            this.setState({ wizIndex: ++this.state.wizIndex })
        }

        if (this.state.wizIndex === 3 && this.state.duration.valid) {
            this.submitForm()
        }
    }

    back() {
        this.state.wizIndex > 0 ? this.setState({ wizIndex: --this.state.wizIndex }) : this.setState({ wizIndex: 0 })
    }

    handleChange = name => event => {
        let newState = {
            value: '',
            valid: false
        }
        if (name === "repoUrl") {
            newState.value = event.target.value
            newState.valid = isGitUrl(event.target.value)
        }
        if (name === "issueID") {
            newState.value = event.target.value
            newState.valid = validator.isInt(event.target.value)
            // Get info on issue. If the issue exists load issue info.
        }
        if (name === "prize") {
            newState.value = event.target.value
            newState.valid = validator.isInt(event.target.value)
        }
        if (name === "duration") {
            newState.value = event.target.value
            newState.valid = validator.isInt(event.target.value)
        }
        this.setState({
            [name]: newState
        })
    }

    getRepoInfo(repo) {

        //Validate repoUrl input is valid
        // Then look for the specific issue set by the user
        // Load issue info to the state so we can show it to the user.

        // The idea is to only ask for repoName and issueID. We could infer username and
        // show all issue related information after the user inputs that data. This to help
        // the user make sure he/she is selecting the correct issue. (One would hate setting up a bounty for the wrong repo)
    }

    render() {
        const { classes } = this.props

        let error = true,
            wizard = []

        wizard[0] = <TextField
            id="RepoUrl"
            label="Repository URL"
            InputLabelProps={{
                shrink: true,
            }}
            placeholder="https://github.com/YourUsername/YourRepository.git"
            fullWidth
            {...(!this.state.repoUrl.valid && { error })}
            value={this.state.repoUrl.value}
            onChange={this.handleChange('repoUrl')}
            margin="normal" />

        wizard[1] = <TextField
            id="IssueID"
            label="IssueID"
            {...(!this.state.issueID.valid && { error })}
            className={classes.textField}
            value={this.state.issueID.value}
            onChange={this.handleChange('issueID')}
            margin="normal" />

        wizard[2] = <TextField
            id="Prize"
            label="Prize"
            {...(!this.state.prize.valid && { error })}
            className={classes.textField}
            value={this.state.prize.value}
            onChange={this.handleChange('prize')}
            margin="normal" />

        wizard[3] = <TextField
            id="Duration"
            label="duration"
            {...(!this.state.duration.valid && { error })}
            value={this.state.duration.value}
            onChange={this.handleChange('duration')}
            className={classes.textField}
            margin="normal" />

        let repoCardInfo = {
            repoName: Object.keys(this.state.ghParsedObj).length !== 0 ? this.state.ghParsedObj.name : '',
            userName: Object.keys(this.state.ghParsedObj).length !== 0 ? this.state.ghParsedObj.owner : '',
            image: Object.keys(this.state.selectedRepo).length !== 0 ? this.state.selectedRepo.owner.avatar_url : '',
            userLink: Object.keys(this.state.selectedRepo).length !== 0 ? this.state.selectedRepo.owner.html_url : '',
            openIssues: Object.keys(this.state.selectedRepo).length !== 0 ? this.state.selectedRepo.open_issues_count : '',
            description: Object.keys(this.state.selectedRepo).length !== 0 ? this.state.selectedRepo.description : ''
        }

        let issueCardInfo = {
            title: Object.keys(this.state.selectedIssue).length !== 0 ? this.state.selectedIssue.title : '',
            createdAt: Object.keys(this.state.selectedIssue).length !== 0 ? this.state.selectedIssue.created_at : '',
            body: Object.keys(this.state.selectedIssue).length !== 0 ? this.state.selectedIssue.body : '',
            issueId: Object.keys(this.state.selectedIssue).length !== 0 ? this.state.selectedIssue.number : ''
        }

        let cards =
            <Grid container
                spacing={16}
                justify='center' >
                <Grid item xs={12}>
                    <h3 className={classes.bountyCardTitle}>My Bounty</h3>
                </Grid>
                <Grid item xs={6}>
                    <RepoCard info={repoCardInfo} />
                </Grid>
                <Grid item xs={6}>
                    <IssueCard info={issueCardInfo} />
                </Grid>
            </Grid >

        let selection =
            <Grid
                container
                spacing={16}
                direction='row'>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={this.back.bind(this)} color="secondary" className={classes.button}>
                        Back
                        <BackIcon className={classes.button}>Back</BackIcon>
                    </Button>
                    <Button variant="contained" onClick={this.next.bind(this)} color="primary" className={classes.button}>
                        Next
                    <NextIcon className={classes.button}>Next</NextIcon>
                    </Button>
                </Grid>
            </Grid>

        return (
            <form className={classes.container} noValidate autoComplete="off">
                {wizard[this.state.wizIndex]}
                {selection}
                {this.state.loadCards && cards}
            </form>
        )
    }
}

Form.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Form)