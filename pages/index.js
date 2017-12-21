import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Router } from '../routes';

import 'isomorphic-unfetch'

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import {Link} from '../routes'
import withRoot from '../components/withRoot';
import StoryList from "../components/StoryList";

const styles = {
    root: {
        textAlign: 'center',
        paddingTop: 200,
    },
};

class Index extends Component {
    static async getInitialProps() {
        const req = await fetch(`https://api.hackerwebapp.com/news`);
        const stories = await req.json();
        return { stories };
    }

    componentDidMount () {
        if ('serviceWorker' in navigator) {
            console.log("installing service worker");
            navigator.serviceWorker
                .register('/service-worker.js')
                .then(registration => {
                    console.log('service worker registration successful')
                })
                .catch(err => {
                    console.warn('service worker registration failed', err.message)
                })
        }
    }

    render() {
        return <div>

            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography type="title" color="inherit">
                        Latest news!
                    </Typography>
                </Toolbar>
            </AppBar>

            <StoryList stories={this.props.stories} />


        </div>
    }
}

Index.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));