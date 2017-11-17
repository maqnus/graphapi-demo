Usecase

Si at du jobber med fnugg.no, de ulike anleggene er veldig fornøyde siden man kan sitte i tråkkemaskinen og publisere info på egen nettside og på fnugg.no
Men de synes det er klønete at man må kopiere lenker, og skrive egne tekster for å poste til anleggets egne facebook side. (gjøre så mye manuelt arbeid)
Hvorfor ikke bare publisere info om gode forhold direkte til facebook i samme håndvending?





Poste til facebook
    manuelt eller programmatisk

For å kunne poste til en facebook side kan man logge inn på facebook.com, finne frem til siden og manuelt skrive innholdet i posten.  Det man også kan gjøre er å automatisere den manuelle prosessen, og det er det jeg skal prøve å vise dere hvordan man kan gjøre i dag ved å benytte facebook sitt Graph API



BTW. Graph API vs GraphQL



Planen min i dag er å sette opp en liten facebook app, en web-app som serves av en express server på heroku. 




### Legge til i componentDidMount

``` javascript
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
```
