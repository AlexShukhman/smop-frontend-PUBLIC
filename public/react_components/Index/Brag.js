import React, { Proptypes } from 'react'
import { connect } from 'react-redux'

class Brag extends React.Component {
    render() {
        return (
            <div className='brag'>
                <br/>
                <br/>
                <h2>What we do for <b><bl>you</bl></b>:</h2>
                <p>Smop puts the exact software freelance jobs you want to see right at your fingertips.</p>
                <br/>
                <h2>The deal:</h2>
                <p>A software <b><gr>owner</gr></b> will post the short task they need done and tag it with a set bounty. The first three <b><bl>coders</bl></b> to press the submit button and pass all the automated tests equally win the first half of the bounty. The best code (chosen by the owner) wins the second half.</p>
            </div>
        )
    }
}

export default Brag;