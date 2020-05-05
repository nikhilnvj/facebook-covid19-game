import React from 'react';
import './App.scss';
import html2canvas from 'html2canvas'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {fbInstant: null, showLoadingSpinner: false};
        this.share = this.share.bind(this);
    }

    componentDidMount() {
        const script1 = document.createElement('script');
        script1.src = 'https://www.facebook.com/assets.php/en_US/fbinstant.latest.js';
        script1.id = 'fbinstant';
        document.head.appendChild(script1);

        script1.onload = async () => {
            await window.FBInstant.initializeAsync()
            await window.FBInstant.startGameAsync()
            this.setState({fbInstant: window.FBInstant})
        }
        const script2 = document.createElement('script');
        script2.src = 'https://connect.facebook.net/en_US/sdk.js';
        script2.setAttribute("defer", "defer");
        script2.setAttribute("async", "async");
        script2.id = 'fb-api';
        document.head.appendChild(script2);

        window.fbAsyncInit = async () => {
            window.FB.init({
                appId: '551766515485935',
                autoLogAppEvents: true,
                version: 'v6.0',
                status: true
            });
            this.setState({fbApi: window.FB})

            await new Promise((resolve, reject) => {
                window.FB.getLoginStatus((response) => {
                    if (response && response.status === 'connected') {
                        this.setState({accessToken: response.authResponse.accessToken})
                        resolve();
                    } else {
                        reject();
                    }
                })
            });

            const friends = await new Promise((resolve) => {
                window.FB.api(
                    '/me/friends',
                    'GET',
                    {
                        access_token: this.state.accessToken
                    },
                    function (response) {
                        resolve(response.data ? response.data.map(({name}) => name) : []);
                    }
                );
            });
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const nameStartsWithRandom = characters.charAt(Math.floor(Math.random() * characters.length));
            this.setState({friends})
            this.setState({nameStartsWithRandom})
        };
    }

    render() {
        const {player} = this.state.fbInstant || {};
        const {showLoadingSpinner, nameStartsWithRandom} = this.state;
        let messagePart1 = 'Your friends whose names start with';
        let messagePart2 = 'will throw you a party after the COVID lockdown.';
        let friendName;
        if (this.state.friends && !friendName && this.state.friends.length >= 10) {
            const [fName, , lName] = this.state.friends[Math.floor(Math.random() * this.state.friends.length)].split(" ");
            friendName = fName;
            if (lName) {
                friendName += ` ${lName}`
            }
        }
        return (
            <div className="App">
                {player && <React.Fragment>
                    <div className="share-button-container">
                        <button className="btn btn-share" onClick={this.share} disabled={showLoadingSpinner}>
                            {!showLoadingSpinner && (<React.Fragment><i></i> <span>Share</span></React.Fragment>)}
                        </button>
                        {showLoadingSpinner && <div className="spinner"/>}
                    </div>
                    <div className="container" id="container">
                        <header>
                            <h1>Who will throw you a party after COVID-19 ends?</h1>
                        </header>

                        <section id="info-section">
                            <div className="pictures">
                                <div className="profile-picture">
                                    <img src={player && player.getPhoto()} crossOrigin="anonymous" alt="profile-pic"/>
                                </div>
                                <div className="party-picture">
                                    <img src='img/party.jpg' crossOrigin="anonymous" alt="party-pic"/>
                                </div>
                            </div>
                            <div className="message-box">
                                <div className="message-box--main">
                                    {friendName &&
                                    <React.Fragment>
                                        <h3 className="message">Hello {player.getName()},</h3>
                                        <h2 className="friend-name">{friendName}</h2>
                                        <h3 className="message">{messagePart2}</h3>
                                    </React.Fragment>
                                    }
                                    {!friendName && (
                                        <React.Fragment>
                                            <h3 className="message-box--main--1">{`Hello ${player.getName()}, ${messagePart1}`}</h3>
                                            <h3 className="message-box--main--2"><b>{nameStartsWithRandom}</b></h3>
                                            <h3 className="message-box--main--3">{messagePart2}</h3>
                                        </React.Fragment>
                                    )}
                                </div>
                                <h2>Tag them & demand a treat.</h2>
                                <h1 className="emojis"><span role="img" aria-label="sheep"> 😃 🥳 🎉</span></h1>
                            </div>
                        </section>
                    </div>
                    <div className="share-button-container">
                        <button className="btn btn-share" onClick={this.share} disabled={showLoadingSpinner}>
                            {!showLoadingSpinner && (<React.Fragment><i></i> <span>Share</span></React.Fragment>)}
                        </button>
                        {showLoadingSpinner && <div className="spinner"/>}
                    </div>
                </React.Fragment>}
            </div>
        );
    }

    async share() {
        this.setState({showLoadingSpinner: true});
        const {shareAsync} = this.state.fbInstant;
        const canvas = await html2canvas(document.querySelector("#container"), {
            useCORS: true,
            // width: 450,
            // height: 390,
            scrollX: 0,
            scrollY: -window.scrollY,
            margin: 0,
            padding: 0

        });
        // document.body.appendChild(canvas);
        shareAsync({
            intent: 'REQUEST',
            text: 'Post COVID-19 Party.',
            image: canvas.toDataURL('image/jpeg', 1.0)
        })
            .catch(e => console.log(e))
            .finally(() => this.setState({showLoadingSpinner: false}))
    }

    getRandomPokemon() {
        const index = Math.floor(Math.random() * this.pokemons.length);
        return this.pokemons[index];
    }
}

export default App;
