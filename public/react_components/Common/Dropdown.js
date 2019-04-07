import React, { Proptypes } from 'react'
import { connect } from 'react-redux';


class DropDown extends React.Component {
    render() {
        return (
            <div className="dropdown">
                <img src="../images/smopblack.png" alt="options" className="imagedropdown" href="/" />
                <div id="myDropdown" className="dropdown-content">
                    <a href="/">Home</a>
                    <a href="/logout">Logout</a>
                </div>
            </div>
        )
    }
}

export default DropDown;