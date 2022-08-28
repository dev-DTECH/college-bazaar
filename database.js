const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "sg1.inferno.land",
    port: "3306",
    user: "u54_fm3TFaPONa",
    password: "R3l0kQBt=+HSPk!64Q^D9qDk",
    database: "s54_dtech_sql"
});
function handleDisconnect() {
 // Recreate the connection, since
                                                    // the old one cannot be reused.

    connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }
        console.log('MySQL Database is connected Successfully');
        connection.query('create table if not exists user (email varchar(256) primary key ,pass varchar(256),name varchar(256), admin bool,blacklist bool)',(err, result) => {
            if (err) throw err;
            console.log("User Table created");
        })
        connection.query('create table if not exists product (name varchar(256),id varchar(256) primary key ,`desc` varchar(256),price int,owner varchar(256),foreign key (owner) references user(email))',(err, result) => {
            if (err) throw err;
            console.log("Product Table created");
        })

    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();
// connection.connect(function(error){
//     if(error)
//     {
//         throw error;
//     }
//     else
//     {
//         console.log('MySQL Database is connected Successfully');
//         connection.query('create table if not exists user (email varchar(256) primary key ,pass varchar(256),name varchar(256), admin bool,blacklist bool)',(err, result) => {
//             if (err) throw err;
//             console.log("Table created");
//         })
//     }
// });

module.exports = connection;