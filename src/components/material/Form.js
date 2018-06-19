import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import validator from 'validator'
import toast from 'react-toastify'

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
    }
})

class Form extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            repoUrl: { value: '', valid: true },
            issueID: { value: '', valid: true },
            prize: { value: '', valid: true },
            duration: { value: '', valid: true },
            username: { value: '', valid: true }
        }
    }

    submitForm(e) {
        e.preventDefault()
        if (this.state.repoUrl.value
            && this.state.username.value
            && this.state.issueID.value
            && this.state.prize.value
            && this.state.duration.value) {
            let newBounty = {
                repoUrl: this.state.repoUrl.value,
                issueID: parseInt(this.state.issueID.value, 10),
                prize: parseFloat(this.state.prize.value, 10),
                duration: parseInt(this.state.duration.value, 10)
            }
            this.props.newBounty(newBounty)
        } else {
            toast.error("Oops! Invalid form.")
        }

    }

    handleChange = name => event => {
        let newState = {
            value: '',
            valid: null
        }
        if (name === "repoUrl") {
            newState.value = event.target.value
            newState.valid = validator.isURL(event.target.value)
        }
        if (name === "issueID") {
            newState.value = event.target.value
            newState.valid = validator.isInt(event.target.value)
        }
        if (name === "userName") {
            newState.value = event.target.value
            newState.valid = validator.isLength(event.target.value, { min: 2 })
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

    render() {

        const { classes } = this.props

        let error = true,
            canSubmit = true,
            submitButton = <Button variant="contained" type="submit" color="primary" className={classes.button}> Submit </Button>

        Object.keys(this.state).map(key => {
            if (!this.state[key].value) { canSubmit = false }
            return true

        })

        return (
            <form className={classes.container} onSubmit={this.submitForm.bind(this)} noValidate autoComplete="off">
                <TextField
                    id="RepoUrl"
                    label="Repository URL"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    placeholder="https://github.com/YourUsername/YourRepository"
                    fullWidth
                    {...(!this.state.repoUrl.valid && { error })}
                    value={this.state.repoUrl.value}
                    onChange={this.handleChange('repoUrl')}
                    margin="normal"
                />
                <TextField
                    id="UserName"
                    label="Username"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    {...(!this.state.repoUrl.valid && { error })}
                    value={this.state.repoUrl.value}
                    onChange={this.handleChange('userName')}
                    margin="normal"
                />
                <TextField
                    id="IssueID"
                    label="IssueID"
                    {...(!this.state.issueID.valid && { error })}
                    className={classes.textField}
                    value={this.state.issueID.value}
                    onChange={this.handleChange('issueID')}
                    margin="normal"
                />
                <TextField
                    id="Prize"
                    label="Prize"
                    {...(!this.state.prize.valid && { error })}
                    className={classes.textField}
                    value={this.state.prize.value}
                    onChange={this.handleChange('prize')}
                    margin="normal"
                />
                <TextField
                    id="Duration"
                    label="duration"
                    {...(!this.state.duration.valid && { error })}
                    value={this.state.duration.value}
                    onChange={this.handleChange('duration')}
                    className={classes.textField}
                    margin="normal"
                />
                {canSubmit ? submitButton : null}
            </form>
        )
    }
}

Form.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Form)