// MongoDB initialization script
db = db.getSiblingDB('trade_journal');

// Create a user for the application
db.createUser({
  user: 'trade_user',
  pwd: 'trade_password',
  roles: [
    {
      role: 'readWrite',
      db: 'trade_journal'
    }
  ]
});

// Create initial collections
db.createCollection('users');
db.createCollection('trades');
db.createCollection('stocks');
db.createCollection('accounts');
db.createCollection('notes');

print('Trade Journal database initialized successfully!');
