import React, { Component } from 'react';
import {Link} from "react-router-dom";

class PDFView extends Component {
    render() {
        return (
            <div>
                Here shall be a PDF file!
                <Link to="/project/deadbeef-dead-beef-dead-beefdeadbeef">Deadbeaf button</Link>
                <Link to="/project/00000000-0000-0000-0000-000000000000">Null button</Link>
                <Link to="/project/00000000-0000-0000-0000-000000000001">Evil button</Link>
            </div>
        );
    }
}

export default PDFView;