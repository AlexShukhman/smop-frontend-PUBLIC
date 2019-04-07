import React, { Proptypes } from 'react'

class Hero extends React.Component {
    getTime() {
        var date = new Date();
        var hour = +date.getHours();
        if (hour <= 4 || hour > 18) {
            return 'evening';
        }
        else if (hour <= 11) {
            return 'morning';
        }
        else {
            return 'afternoon';
        }
    }

    render() {
        return (
            <div className="Basic-Text-Frame">
                    <div className="Basic-Paragraph para-style-override-1" id='heroImage'>Good {this.getTime()}, <bl>coder</bl>.</div>
                </div>
        )
    }
}

export default Hero;