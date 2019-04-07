import React, { Proptypes } from 'react'
import { connect } from 'react-redux'

class Social extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='socialframe'>
                <a className="icon"  href="https://smoptechnologies.wordpress.com/">
                    <i className="fa fa-wordpress"></i>
                </a>
                <a className="icon" href="https://www.instagram.com/smoptechnologies/">
                    <i className="fa fa-instagram"></i>
                </a>
                <a className="icon" href="https://www.facebook.com/smoptechnologies/">
                    <i className="fa fa-facebook"></i>
                </a>
                <a className="icon" href="https://www.linkedin.com/company/smop_technologies/">
                    <i className="fa fa-linkedin"></i>
                </a>
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

const app = connect(mapStateToProps, mapDispatchToProps)(Social)

export default app;