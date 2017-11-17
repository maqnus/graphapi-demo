import React, { Component } from 'react';

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            devmode: false,
            user_logged_in: false,
            user_id: '',
            user_access_token: '',
            user_name: '',
            pages: null,
            selected_page_id: '',
            page_access_token: '',
            message: '',
            post_link: '',
            single_photo_url: '',
            single_photo_caption: ''
        }
    }
    componentDidMount() {
      new Promise((resolve, reject) => {
            return FB.getLoginStatus(response => {
                console.log('checking login status...');
                if (response.status === 'connected') {
                    //console.log(response, response.authResponse.userID);
                    resolve(response.authResponse.userID);
                } else {
                    console.log('failed to get user access token', response);
                    reject();
                }
            })
        })
        .then(response => {
            console.log(`user ${response} is logged in`);
            this.setState({
                user_id: response.userID,
                user_access_token: response.accessToken,
                user_logged_in: true
            });
        }).catch(() => {
          console.log('user is not logged in');
        })
    }

    logIn() {
      new Promise((resolve, reject) => {
        FB.login(response => {
          if (response.authResponse) {
           console.log('Welcome!  Fetching your information.... ');
           FB.api('/me', response => {
             console.log('Good to see you, ' + response.name + '.');
             resolve(response);
           });
          } else {
           console.log('User cancelled login or did not fully authorize.');
           reject(response);
          }
        });
      }).then(response => this.main(response));
    }

    logOut() {
      new Promise((resolve, reject) => {
          FB.logout(function(response) {
            console.log('Goodbye.')
            resolve();
          });
      }).then(() => {
        this.setState({user_logged_in: false});
      });
    }

    getUserAccessToken() {
        return new Promise((resolve, reject) => {
            return FB.getLoginStatus(response => {
                console.log('waiting for user access token...');
                if (response.status === 'connected') {
                    const accessToken = response.authResponse.accessToken;
                    console.log('got user access token', accessToken);
                    resolve(accessToken)
                } else {
                    console.log('failed to get user access token', response);
                    reject(response)
                }
            })
        }).then(response => this.setState({user_access_token: response}));
    }

    getPagesWhereUserIsAdmin() {
        return new Promise((resolve, reject) => {
            return FB.api('/me/accounts', {
                fields: 'manage_pages,name',
            }, (response) => {
                if (!response || response.error) {
                    console.log('failed to get pages where user is admin: ', response);
                    reject(response)
                } else {
                    console.log('got pages where user is admin: ', response);
                    resolve(response.data)
                }
            })
        }).then(pages => {
            this.setState({
                "pages": pages,
                "selected_page_id": pages[0].id
            });
        });
    }

    getPageAccessToken() {
        return new Promise((resolve, reject) => {
            return FB.api( this.state.selected_page_id, 'GET', {
                    fields: 'access_token'
                }, response => {
                    console.log('waiting for page access token...');
                    if (!response || response.error) {
                        console.log('failed to get page access token', response);
                        reject(response)
                    } else {
                        console.log('current pages access token', response.access_token);
                        resolve(response.access_token)
                    }
                }
              );
        });
    }

    postToPage() {
        this.getPageAccessToken()
            .then(token => this.setState({"page_access_token": token}))
            .then(() => new Promise((resolve, reject) => {
                const data = {
                    message: this.state.message,
                    link: this.state.post_link,
                    access_token: this.state.page_access_token,
                    scope: 'publish_actions'
                };
                console.log('trying to post', data);
                return FB.api( `v2.11/${this.state.selected_page_id}/feed`,'POST', data, response => {
                        if (!response || response.error) {
                            alert('Error occured');
                            reject(response)
                        } else {
                            this.setState({"message": ''});
                            console.log('Post ID: ' + response.id);
                            alert('Post ID: ' + response.id);
                            resolve(response)
                        }
                    }
                  );
            }));
    }

    renderSelectGroupId() {
        const options = this.state.pages.map(opt => {
            return <option key={opt.id} value={opt.id}>{opt.name}</option>
        });
        return (
            <select id="pageIdSelect" onChange={ e => {
                  this.setState({
                    "selected_page_id": e.target.selectedOptions[0].value
                  });
                  this.getPageAccessToken()
                    .then(token => this.setState({
                      "page_access_token": token
                    })
                  );
                }}>
                { options }
            </select>
        )
    }

    main(loginResponse) {
        this.setState({
            user_id: loginResponse.id,
            user_name: loginResponse.name,
            user_logged_in: true
        });
        this.getUserAccessToken();
        this.getPagesWhereUserIsAdmin().then(() => {
            this.getPageAccessToken().then(token => this.setState({
                "page_access_token": token
              })
            );
        })
    }

    getUserId() {
        return new Promise((resolve, reject) => {
            return FB.getLoginStatus(response => {
                console.log('waiting for user id...');
                if (response.status === 'connected') {
                    const id = response.authResponse.userID;
                    console.log('got user id', response, response.authResponse.userID);
                    resolve(id)
                } else {
                    console.log('failed to get user access token', response);
                    reject(response)
                }
            })
        }).then(id => this.setState({user_id: id}))
    }

    render() {
      return(
        <div className="container">
            <h1>Post to facebook</h1>

            <button onClick={() => this.setState({devmode: !this.state.devmode})} >Toggle devmode</button>
            {(this.state.user_logged_in) && (
                <button onClick={() => this.logOut()} type="button" >Logout</button>
            )}
            {(!this.state.user_logged_in) && (
                <button onClick={() => this.logIn()} type="button" >Login</button>
            )}

            {(this.state.user_logged_in) && (
                <form onSubmit={(event) => event.preventDefault()} >
                    <p>Start by selecting which page you want to post to</p>
                    <ul>
                        {this.state.devmode && (
                            <li>
                                <label htmlFor="userIdInput">User ID</label>
                                <input type="text" id="userIdInput" value={this.state.user_id} onChange={e => this.setState({user_access_token: e.target.value})} />
                            </li>
                        )}
                        {this.state.devmode && (
                            <li>
                                <label htmlFor="userAccessTokenInput">User Access Token</label>
                                <input type="text" id="userAccessTokenInput" value={this.state.user_access_token} onChange={e => this.setState({user_access_token: e.target.value})} />
                            </li>
                        )}
                        {this.state.pages && (
                            <li>
                                <label htmlFor="pageIdSelect">Your pages:</label>
                                {(this.state.selected_page_id && this.state.devmode) && (
                                    <input type="text" id="pageIdInput" value={this.state.selected_page_id} onChange={e => this.setState({selected_page_id: e.target.value})} />
                                )}
                                { this.renderSelectGroupId() }
                            </li>
                        )}
                        <li>
                            <label htmlFor="postLink">postLink</label>
                            <input type="text" id="postLink" value={this.state.post_link} onChange={e => this.setState({post_link: e.target.value})} />
                        </li>
                        {this.state.devmode && (
                            <li>
                                <label htmlFor="pageAccessTokenInput">Page Access Token</label>
                                <input type="text" id="pageAccessTokenInput" value={this.state.page_access_token} onChange={e => this.setState({page_access_token: e.target.value})} />
                                <button onClick={() => this.getPageAccessToken().then(token => this.setState({"page_access_token": token}))}>getPageAccessToken</button>
                            </li>
                        )}
                        <li>
                            <label htmlFor="messageInput">Message</label>
                            <textarea id="messageInput" defaultValue={this.state.message} onChange={(e) => this.setState({message: e.target.value})} />
                        </li>
                    </ul>
                    <button onClick={() => this.postToPage()} >Post message</button>
                </form>
            )}

            {this.state.devmode && (<div><code>{JSON.stringify(this.state, null, 2)}</code></div>)}
        </div>
      )
    }
}
