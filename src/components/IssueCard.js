import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'


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

class IssueCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            issueId: this.props.info.issueId,
            createdAt: this.props.info.createdAt,
            title: this.props.info.title,
            body: this.props.info.body
        }
    }

    componentWillReceiveProps(props) {
        console.log(props)
    }

    render() {
        const { classes } = this.props
        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="headline" component="h2">
                        <strong>{this.props.info.title}</strong>
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {this.props.info.createdOn}
                    </Typography>
                    <Typography component="p">
                        {this.props.info.body}
                    </Typography>
                    <Typography component="p">
                        Issue ID: {this.props.info.issueId}
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}


IssueCard.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(IssueCard)