import React, {Component} from 'react'
import './splash-screen.css'

function LoadingMessage() {
    return (
        <div className="splash-screen">
            <img alt='PaWash Logo' src='/assets/logo.svg' /> Welcome! <br/><br/>
            <div className="loading-dot">.</div>
        </div>
    )
}

function withSplashScreen(WrappedComponent) {
    return class withSplashScreen extends Component {
        constructor(props) {
            super(props)
            this.state = {
                loading: true,
            }
        }

        async componentDidMount() {
            setTimeout(() => {
                this.setState({
                    loading: false,
                })
            }, 1500)
        }

        render() {
            if (this.state.loading) return LoadingMessage()
            return <WrappedComponent {...this.props} />
        }
    }
}

export default withSplashScreen
