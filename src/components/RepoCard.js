import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CardMedia from '@material-ui/core/CardMedia'

const styles = theme => ({
    card: {
        maxWidth: 400,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
})

class RepoCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            repoName: this.props.info.repoName,
            userName: this.props.info.userName,
            image: this.props.info.image,
            userLink: this.props.info.userLink,
            openIssues: this.props.info.openIssues,
            description: this.props.info.description
        }
    }

    componentWillReceiveProps(props) {
        console.log(props)
    }

    render() {
        console.log(this.state)
        const { classes } = this.props;
        return (
            <div>
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.media}
                        image={this.props.info.image}
                        title="User image"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="headline" component="h2">
                            {this.props.info.repoName}
                        </Typography>
                        <Typography component="p">
                            <strong>Description:</strong>
                            {this.props.info.description}
                        </Typography>
                        <Typography component="p">
                            <strong>Open Issues:</strong>
                            {this.props.info.openIssues}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary">
                            Accept
                            </Button>
                        <Button size="small" color="primary">
                            Issue
                            </Button>
                    </CardActions>
                </Card>
            </div>
        );
    }

}

RepoCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RepoCard);