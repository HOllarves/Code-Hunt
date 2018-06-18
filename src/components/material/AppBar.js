import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import GitHubLogin from 'react-github-login'
import * as secret from '../../oauth/secret'
import Github from '../../services/github'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class ButtonAppBar extends React.Component {
  constructor(props) {
    super(props)
    this.githubHandler = new Github()
  }

  onSuccess(response) {
    this.githubHandler.sendUserCode(response.code)
      .then(response => {
        this.props.loadAccessToken(response.access_token)
      })
  }

  onFailure(response) { console.log(response) }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Code Hunt
            </Typography>
            <GitHubLogin clientId={secret.default.id}
              onSuccess={this.onSuccess.bind(this)}
              onFailure={this.onFailure.bind(this)}
              redirectUri=''
              className="github-btn" />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
