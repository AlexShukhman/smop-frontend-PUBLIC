import React, { Proptypes } from 'react'
import Footer from './Footer';

class MainComponent extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
                <Footer />
            </div>
        )
    }
}

export default MainComponent;