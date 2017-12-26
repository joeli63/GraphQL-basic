import React, {
    Component
} from 'react'
import {
    Switch,
    Route
} from 'react-router-dom'
import Home from './Home'
import PageA from './PageA'
import PageB from './PageB'

export default class Main extends Component {
    render() {
        return(
            <main>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/page_a' component={PageA} />
                    <Route path='/page_b' component={PageB} />
                </Switch>
            </main>
        )
    }
}