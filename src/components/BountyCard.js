import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Github from 'github-api'

const styles = theme => ({
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
})

class BountyCard extends React.Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            repoUrl: this.props.data.repoUrl,
            issueID: this.props.data.issueID,
            prize: this.props.data.prize,
            duration: this.props.data.duration,
            createdOn: this.props.data.createdOn,
            finished: this.props.data.finished,
            accessToken: this.props.auth.token
        }
        console.log(this.state)
        let requestObj = {}
        if(this.props.access_token) {
            requestObj.access_token = this.props.access_token
        } else {
            let credentials = require('../secrets/credential')
            requestObj.username = credentials.username
            requestObj.password = credentials.password
        }
        var gh = new Github(requestObj)
        var user = gh.getUser()
        var repo = gh.getRepo('HOllarves', 'Ethereum-Test-Repo')
        repo.getPullRequest(2)
            .then(data => { console.log(data)})
    }


    render() {
        const { classes } = this.props
        const bull = <span className={classes.bullet}>•</span>
        return (
            <div>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary">
                            {this.state.repoUrl}
                        </Typography>
                        <Typography variant="headline" component="h2">
                            {this.state.issueID}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            {this.state.createdOn}
                        </Typography>
                        <Typography component="p">
                            {this.state.prize}
                        </Typography>
                        <Typography component="p">
                            {this.state.issueID}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Accept!</Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

BountyCard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(BountyCard)