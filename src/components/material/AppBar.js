import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import GitHubLogin from 'react-github-login'
import * as secret from '../../oauth/secret'
import Github from '../../services/github'
import Octokit from '@octokit/rest'
import LeftDrawer from './Drawer'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  }
});

class ButtonAppBar extends React.Component {
  constructor(props) {
    super(props)
    this.isLoggedIn = false;
    this.githubHandler = new Github()
    this.octokit = new Octokit({ headers: { accept: 'application/vnd.github.v3+json', 'user-agent': 'octokit/rest.js v1.2.3' } })
    this.localStorageLabel = 'user-app-bar'
    this.state = {
      userName: '',
      pic: '',
      access_token: ''
    }
  }

  componentDidMount() {
    const storedData = JSON.parse(localStorage.getItem(this.localStorageLabel))
    if (storedData) {
      this.isLoggedIn = true
      this.loadUserInfo(storedData)
    }
  }

  onSuccess(response) {
    this.githubHandler.sendUserCode(response.code)
      .then(githubResponse => {
        this.octokit.authenticate({ type: 'oauth', token: githubResponse.access_token })
        this.octokit.users.get({})
          .then(userRespose => {
            let userData = {
              userName: userRespose.data.login,
              pic: userRespose.data.avatar_url,
              access_token: githubResponse.access_token
            }
            this.loadUserInfo(userData, githubResponse.access_token)
            this.props.loadAccessToken(githubResponse.access_token)
          })
      })
  }

  loadUserInfo(user, access_token) {
    this.octokit.authenticate({ type: 'oauth', token: access_token ? access_token : user.access_token })
    this.octokit.users.get({})
      .then(userRespose => {
        let userData = {
          userName: userRespose.data.login,
          pic: userRespose.data.avatar_url,
          access_token: access_token ? access_token : user.access_token
        }
        this.isLoggedIn = true
        localStorage.setItem(this.localStorageLabel, JSON.stringify(userData))
        this.setState(userData)
      })
      .catch(err => {
        this.isLoggedIn = false;
      })
  }

  onFailure(response) { this.isLoggedIn = false }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <LeftDrawer />

            <Typography variant="title" color="inherit" className={classes.flex}>
              Code Hunt
            </Typography>
            {!this.isLoggedIn ? <GitHubLogin clientId={secret.default.id}
              onSuccess={this.onSuccess.bind(this)}
              onFailure={this.onFailure.bind(this)}
              redirectUri=''
              className="github-btn" /> : null}
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
