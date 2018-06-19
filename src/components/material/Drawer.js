import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { mailFolderListItems, otherMailFolderListItems } from './MenuItems'

const styles = {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    }
}

class LeftDrawer extends React.Component {
    state = {
        left: false
    }

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open
        })
    }

    render() {
        const { classes } = this.props

        const sideList = (
            <div className={classes.list}>
                <List>{mailFolderListItems}</List>
                <Divider />
                <List>{otherMailFolderListItems}</List>
            </div>
        )
        return (
            <div>
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer('left', true)}>
                    <MenuIcon />
                </IconButton>
                <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('left', false)}
                        onKeyDown={this.toggleDrawer('left', false)}>
                        {sideList}
                    </div>
                </Drawer>
            </div>
        )
    }
}

LeftDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(LeftDrawer)

