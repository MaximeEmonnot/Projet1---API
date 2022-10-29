//definition de la classe utilisateur ici
class User {
  constructor(userName, email, firstName, lastName, password) {
    this.userName = userName;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
  }
}

module.exports = { User };
