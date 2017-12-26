import React, { Component } from "react";

import 'isomorphic-fetch';

import {Toolbar, Typography} from "material-ui";
// import SplitterLayout from 'react-splitter-layout';

import Editor from "../components/Editor";

export default class Story extends Component {
    render() {
        return <div>
            <Toolbar>
                <Typography type="title">This will be the workspace!</Typography>
            </Toolbar>

            {/*<SplitterLayout>*/}
                <Editor projectID={this.props.url.query.id} />
                <div>
                    Here will be the PDF viewer!
                </div>
            {/*</SplitterLayout>*/}

            <style jsx>{``}</style>
        </div>
    }
}