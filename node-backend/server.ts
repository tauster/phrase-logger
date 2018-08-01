/*
    This webserver handles "phrases" and its database
    "storage.txt". The following routes are availalbe:
    
    /write: POST request that takes in a "phrase" in
            and stores into database the following
            with POST request folloing format:
            {phrase: "phrase"}

            Response follows format:
            {id: <lineNumber>}
    
    /read:  GET request that gives the entire database
            as the following format:
            {phrases: [
                {id: 1, phrase: "phrase1"},
                {id: 2, phrase: "phrase2"},
                ... ,
                {id: N, phrase: “phraseN”}]}
    
    /delete/<lineNumber>:
            Deletes line number requested with response
            following the format:
            {success: <true/false>}
    
    Tausif Sharif
*/

// Importing required packages.
import * as Hapi from "hapi";
import * as fs from "fs";

// Setting up storage database.
var storageTXT: string[];
var storageJSON: any;
const prepareStorage = async () => {
    // Create empty "storage.txt" file if it does not exist.
    if(!fs.existsSync("storage.txt")) {
        const createStorage = async () => {
            await fs.writeFile("storage.txt", "", (err) => {
                if(err) {
                    throw err;
                }
            });
        }
        createStorage();
    }

    // Prepares storage database for webserver use.
    await fs.readFile("storage.txt", "utf8", (err, data) => {
        // Using 2 formats of keeping track, list and object.
        storageTXT = data.toString().split('\r\n');
        storageJSON = {"phrases": []};
        for(var i = 0; i < storageTXT.length; i++) {
            storageJSON.phrases.push({"id": (i + 1).toString(), "phrase": storageTXT[i]});
        }
    });
}

// Setting up webserver.
const server: Hapi.Server = new Hapi.Server({
    port: 8080,
    host: "localhost",
    routes: {
        cors: {
            origin: ["*"],
            credentials: true
        }
    }
});


// RESTful ROUTES.
// /write POST route.
server.route({
    method: "POST",
    path: "/write",
    
    handler: (request, h) => {
        // Storing requested phrase.
        let data: any = request.payload;

        // Append to existing database if not empty.
        const appendStorage = async () => {
            await fs.appendFile('storage.txt', "\r\n" + data.phrase, function (err) {
                if (err) throw err;
                storageTXT.push(data.phrase);
                storageJSON.phrases.push({"id": (storageTXT.length + 1).toString(), "phrase": data.phrase});
            });
        }

        // Write to new database if empty. 
        const writeStorage = async () => {
            await fs.writeFile('storage.txt', data.phrase, function (err) {
                if (err) throw err;
                storageTXT[0] = data.phrase;
                storageJSON.phrases[0] = {"id": (storageTXT.length + 1).toString(), "phrase": data.phrase};
            });
        }
        
        // Choosing whether the database is empty or not
        if(storageTXT[0] !== "") {
            appendStorage();
        }
        else {
            writeStorage();
        }

        // Reindexing storageTXT and storageJSON.
        prepareStorage();
        
        // Returning line number written.
        return {"id": (storageTXT.length + 1).toString()};
    }
});

// /read GET route.
server.route({
    method: 'GET',
    path: '/read',
    handler: function (request, h) {
        // Returing the entire pre-formatted storageJSON object.
        return storageJSON;
    }
});

// /delete/<line_number> DELETE route.
server.route({
    method: 'GET',
    path: '/delete/{line*}',
    handler: function (request, h) {
        // Trying to see if delete line request is a number.
        try{
            let lineNumber: number = parseFloat(request.params.line);

            // If the line number is an in, and positive, and less than current database length delete line.
            if(Number.isInteger(lineNumber) && lineNumber > 0 && lineNumber <= storageTXT.length) {
                const deleteStorage = async () => {
                    // Splice line from storageTXT.
                    await storageTXT.splice((Math.floor(lineNumber) - 1), 1);

                    // Write new storageTXT into file.
                    await fs.writeFile('storage.txt', storageTXT.join("\r\n"), function (err) {
                        if (err) throw err;
                        // Reindex storageTXT and storageJSON.
                        prepareStorage();
                    });
                }
                deleteStorage();

                // Returning delete results.
                return {"success": true};
            }
            else {
                // Returning delete results.
                return {"success": false};
            }
        }
        // If the delete line number request is not a number. 
        catch(err) {
            // Returning delete results.
            return {"success": false};
        }
    }
});


// Default 404 requests.
server.route({
    method: ["GET", "POST"],
    path: "/{any*}",

    handler: (request, h) => {
        return("Whoops. This server only accepts /write, /read, and /delete/<lineNumber>");
    }
});

// STARTING SERVER.
const startServer = async () => {
    // Prepare database from storage.txt
    await prepareStorage();

    // Starting server.
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

// In the event of an error starting server.
process.on("unhandledRejection", (err) => {
    console.log(`Error starting server: ${err}`);
    process.exit(1);
});

// Start server.
startServer();

