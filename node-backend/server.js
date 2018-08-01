"use strict";
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
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
// Importing required packages.
var Hapi = __importStar(require("hapi"));
var fs = __importStar(require("fs"));
// Setting up storage database.
var storageTXT;
var storageJSON;
var prepareStorage = function () { return __awaiter(_this, void 0, void 0, function () {
    var createStorage;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Create empty "storage.txt" file if it does not exist.
                if (!fs.existsSync("storage.txt")) {
                    createStorage = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fs.writeFile("storage.txt", "", function (err) {
                                        if (err) {
                                            throw err;
                                        }
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    createStorage();
                }
                // Prepares storage database for webserver use.
                return [4 /*yield*/, fs.readFile("storage.txt", "utf8", function (err, data) {
                        // Using 2 formats of keeping track, list and object.
                        storageTXT = data.toString().split('\r\n');
                        storageJSON = { "phrases": [] };
                        for (var i = 0; i < storageTXT.length; i++) {
                            storageJSON.phrases.push({ "id": (i + 1).toString(), "phrase": storageTXT[i] });
                        }
                    })];
            case 1:
                // Prepares storage database for webserver use.
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Setting up webserver.
var server = new Hapi.Server({
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
    handler: function (request, h) {
        // Storing requested phrase.
        var data = request.payload;
        // Append to existing database if not empty.
        var appendStorage = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.appendFile('storage.txt', "\r\n" + data.phrase, function (err) {
                            if (err)
                                throw err;
                            storageTXT.push(data.phrase);
                            storageJSON.phrases.push({ "id": (storageTXT.length + 1).toString(), "phrase": data.phrase });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        // Write to new database if empty. 
        var writeStorage = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.writeFile('storage.txt', data.phrase, function (err) {
                            if (err)
                                throw err;
                            storageTXT[0] = data.phrase;
                            storageJSON.phrases[0] = { "id": (storageTXT.length + 1).toString(), "phrase": data.phrase };
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        // Choosing whether the database is empty or not
        if (storageTXT[0] !== "") {
            appendStorage();
        }
        else {
            writeStorage();
        }
        // Reindexing storageTXT and storageJSON.
        prepareStorage();
        // Returning line number written.
        return { "id": (storageTXT.length + 1).toString() };
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
        var _this = this;
        // Trying to see if delete line request is a number.
        try {
            var lineNumber_1 = parseFloat(request.params.line);
            // If the line number is an in, and positive, and less than current database length delete line.
            if (Number.isInteger(lineNumber_1) && lineNumber_1 > 0 && lineNumber_1 <= storageTXT.length) {
                var deleteStorage = function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Splice line from storageTXT.
                            return [4 /*yield*/, storageTXT.splice((Math.floor(lineNumber_1) - 1), 1)];
                            case 1:
                                // Splice line from storageTXT.
                                _a.sent();
                                // Write new storageTXT into file.
                                return [4 /*yield*/, fs.writeFile('storage.txt', storageTXT.join("\r\n"), function (err) {
                                        if (err)
                                            throw err;
                                        // Reindex storageTXT and storageJSON.
                                        prepareStorage();
                                    })];
                            case 2:
                                // Write new storageTXT into file.
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                deleteStorage();
                // Returning delete results.
                return { "success": true };
            }
            else {
                // Returning delete results.
                return { "success": false };
            }
        }
        // If the delete line number request is not a number. 
        catch (err) {
            // Returning delete results.
            return { "success": false };
        }
    }
});
// Default 404 requests.
server.route({
    method: ["GET", "POST"],
    path: "/{any*}",
    handler: function (request, h) {
        return ("Whoops. This server only accepts /write, /read, and /delete/<lineNumber>");
    }
});
// STARTING SERVER.
var startServer = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Prepare database from storage.txt
            return [4 /*yield*/, prepareStorage()];
            case 1:
                // Prepare database from storage.txt
                _a.sent();
                // Starting server.
                return [4 /*yield*/, server.start()];
            case 2:
                // Starting server.
                _a.sent();
                console.log("Server running at: " + server.info.uri);
                return [2 /*return*/];
        }
    });
}); };
// In the event of an error starting server.
process.on("unhandledRejection", function (err) {
    console.log("Error starting server: " + err);
    process.exit(1);
});
// Start server.
startServer();
