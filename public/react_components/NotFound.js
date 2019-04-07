import React, { Proptypes } from 'react'
import paolo_sad from '../images/paolo_sad.png'

class NotFound extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <img src={ paolo_sad } style={{width:"65vmin", margin: "auto", display: "block"}}/>
                <h1 style={{textAlign:'center'}}>404: Page Not Found</h1>
            </div>
        )
    }
}

export default NotFound;