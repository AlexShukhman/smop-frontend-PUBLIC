import React, { Proptypes } from 'react'
import { connect } from 'react-redux'

class Footer extends React.Component {
    render() {
        return (
            <div className='footer'>
                <div className="copyright">&copy; 2018, Smop Technologies</div>
                <div className="tcppdiv"><a className='tcpp' href="https://s3.amazonaws.com/smop-public/Smop+Privacy+Policy.pdf">Privacy</a>&nbsp;&nbsp;&nbsp;&nbsp;
                <a className='tcpp' href="https://s3.amazonaws.com/smop-public/Smop+Terms+and+Conditions.pdf">Terms</a></div>
            </div>
        )
    }
}

export default Footer;