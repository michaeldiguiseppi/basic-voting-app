// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/voting_app'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
