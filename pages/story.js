import React, { Component } from "react";

import 'isomorphic-fetch'

export default class Story extends Component {
    static async getInitialProps({ query }) {
        console.log(query);
        const req = await fetch(`https://api.hackerwebapp.com/item/${query.id}`);
        const story = await req.json();
        return { story };
    }
    render() {
        return <div>
            <h1>{ this.props.story.title }</h1>

            { this.props.story.comments.map((comment) => (
                <div key={comment.id} className="comment">
                    <div dangerouslySetInnerHTML={ { __html: comment.content } } />
                    <div>By { comment.user }</div>
                </div>
            )) }

            <style jsx>{``}</style>
        </div>
    }
}