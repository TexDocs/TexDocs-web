import React, { Component } from 'react';

/// Utils
import { injectState } from "freactal";

/// External components
import {Button, Icon, TextField, Toolbar, Typography, withStyles} from "material-ui";

export const MENUBAR_HEIGHT = 51;

const styles = theme => ({
    menubar: {
        height: `${MENUBAR_HEIGHT}pt`,
        minHeight: "auto",
        backgroundColor: "#fff",
        paddingLeft: 0
    },
    texdocsButton: {
        width: "39pt",
        height: "100%",
        backgroundColor: theme.palette.primary[500],
        textAlign: "center"
    },
    texdocsButtonIcon: {
        width: "60%",
        height: "100%",
        fontSize: "24pt",
        lineHeight: `${MENUBAR_HEIGHT}pt`
    },
    submenubar: {
        height: "100%"
    },
    titleBar: {
        minHeight: "auto",
        height: "50%"
    },
    buttonBar: {
        minHeight: "auto",
        height: "50%",
        paddingLeft: "1.5pt"
    },
    projectTitle: {
        fontSize: "15.5pt",
        fontWeight: 400,
        paddingTop: "8pt"
    },
    buttonBarButton: {
        fontSize: "10pt",
        fontWeight: "400",
        textTransform: "capitalize",
        color: "rgb(117, 117, 117)",
    }
});

class Menubar extends Component {
    render() {
        const { state, classes } = this.props;

        const buttonProps = {
            disabled: !state.project,
            dense: true,
            className: classes.buttonBarButton
        };

        return (
            <Toolbar className={classes.menubar}>
                <div className={classes.texdocsButton}><Icon className={classes.texdocsButtonIcon} color="contrast">list</Icon></div>
                <div className={classes.submenubar}>
                    <Toolbar className={classes.titleBar}>
                        <Typography type="headline" className={classes.projectTitle} noWrap>{state.project ? state.project.name : "Unnamed"}</Typography>
                    </Toolbar>
                    <Toolbar className={classes.buttonBar}>
                        <Button {...buttonProps} >File</Button>
                        <Button {...buttonProps} >Edit</Button>
                        <Button {...buttonProps} >View</Button>
                        <Button {...buttonProps} >Insert</Button>
                        <Button {...buttonProps} >Format</Button>
                    </Toolbar>
                </div>
            </Toolbar>
        )
    }
}

export default injectState(withStyles(styles)(Menubar));