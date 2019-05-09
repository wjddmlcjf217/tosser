export default class LoginScene extends Phaser.Scene {
    constructor () {
        super('Login');
    }

    create () {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
    }
}