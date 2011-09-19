var basex  = require("basex"),
    client = basex.createClient();

// This command is magical.  Client stashes the password and will issue on every connect.
client.auth("somepass");
