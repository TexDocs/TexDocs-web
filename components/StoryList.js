import React, { Component } from "react";

// import Link from 'next/link';
import {Link} from '../routes'

export default class StoryList extends Component {
    render() {
        return <div>

            { this.props.stories.map((story) => (
                <div key={story.id} >
                    <h2><a href={ story.url }>{ story.title }</a></h2>
                    <p><Link prefetch route="story" params={{ id: story.id }}><a>
                        { story.comments_count } comments
                    </a></Link></p>
                </div>
            )) }

            <style jsx>{`
               h1 {
                 font-family: system-ui;
                 font-weight: 300;
                 color: #333;
               }
             `}</style>
        </div>
    }
}