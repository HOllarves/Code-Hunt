import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
  headline: {
    textAlign: 'center'
  }
})

class PaperSheet extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h1" className={classes.headline}>
            Welcome to The Hunt
        </Typography>
          <Typography component="div">
            <p>If you're here it's probably because one of <strong>two</strong> reasons:</p>

            <p>You may be a legendary coder, thristy for some bugs/features to satisfy your vicious needs of hacking. If so, not only
              you'll probably get access to bounties from all kinds of companies and entrepeneurs, you'll make money while you're doing so. Powered by cryptocurrencies
              The Hunt allow programmers to claim bounties rapidly and safely thanks to smart contracts running in the ethereum network. </p>

            <p>On the other hand, you may also be a company or an entrepeneur looking to pull of that feature you so desperately need, or even worse, you
              might need some heavy duty pest control on your program. Don't worry, The Hunt is a descentralized marketplace of talent, where your issues
              will be available to many programmer around the world. Just set the right bounty and let them do their magic. Only the code that gets merged
              to your codebase is redeemable as bounty. </p>
          </Typography>
        </Paper>
      </div>
    )
  }
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PaperSheet)
