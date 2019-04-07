import React, { Proptypes } from 'react'
import { connect } from 'react-redux'

class MiniLogo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='MiniLogo'>
                <img src="images/smopblack.png" />
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {};
}

const mapStateToProps = (state) => {
    return state;
}

const app = connect(mapStateToProps, mapDispatchToProps)(MiniLogo)

export default app;