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

const styles = {
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
};

function ButtonAppBar(props) {

  const { classes } = props;

  const githubHandler = new Github()

  const onSuccess = response => {
    githubHandler.sendUserCode(response.code)
      .then(response => {
        props.loadAccessToken(response.access_token)
      })
  };

  const onFailure = response => console.error(response);

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
            onSuccess={onSuccess}
            onFailure={onFailure}
            redirectUri=''
            className="github-btn" />
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
