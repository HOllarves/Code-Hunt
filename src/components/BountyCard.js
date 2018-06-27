// React
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

// Material UI
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CardMedia from '@material-ui/core/CardMedia'

//3rd party libs
import Octokit from '@octokit/rest'
import githubUrlParser from 'parse-github-url'
import Truncate from 'react-truncate'

const styles = theme => ({
    card: {
        minWidth: 275,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
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
    }
})

class BountyCard extends React.Component {
    constructor(props) {

        super(props)
        this.state = {
            repoUrl: this.props.data.repoUrl,
            userName: this.props.data.userName,
            issueID: this.props.data.issueID,
            repoObj: githubUrlParser(props.data.repoUrl),
            prize: this.props.data.prize,
            duration: this.props.data.duration,
            createdOn: this.props.data.createdOn,
            finished: this.props.data.finished,
            accessToken: this.props.auth.token,
            image: 'http://via.placeholder.com/350x150',
            description: '',
            issueDescription: ''

        }
        console.log(this.state)
        this.octokit = new Octokit({ headers: { accept: 'application/vnd.github.v3+json', 'user-agent': 'octokit/rest.js v1.2.3' } })
    }

    componentDidMount() {
        this.octokit.repos.get({ owner: this.state.repoObj.owner, repo: this.state.repoObj.name })
            .then(response => {
                if (response
                    && response.status === 200
                    && response.data) {
                    let data = response.data
                    this.setState({ image: data.owner.avatar_url, description: data.description })
                }
            })
        this.octokit.issues.get({
            owner: this.state.repoObj.owner,
            repo: this.state.repoObj.name,
            number: this.state.issueID
        }).then(response => {
            if (response
                && response.status === 200
                && response.data) {
                let data = response.data
                console.log(data)
                this.setState({ issueDescription: data.body, issueTitle: data.title })
            }
        })
    }

    render() {
        const { classes } = this.props
        return (
            <Card className={classes.card}>
                <CardMedia
                    className={classes.media}
                    image={this.state.image}
                    title="User image"
                />
                <CardContent>
                    <Typography className={classes.title} color="textSecondary">
                        {this.state.repoObj.name}
                    </Typography>
                    <Truncate
                        line={1}
                        truncateText={"..."}
                        children={<Typography variant="headline" component="h2"> {this.state.issueTitle} </Typography>} />
                    <Truncate
                        line={1}
                        truncateText={"..."}
                        children={<Typography component="p">{this.state.issueDescription}</Typography>} />
                    <Typography component="p">
                        Reward: {this.state.prize}
                    </Typography>
                    <Typography component="p">
                        Issue ID: {this.state.issueID}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Accept!</Button>
                </CardActions>
            </Card>
        )
    }
}

BountyCard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(BountyCard)