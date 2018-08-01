# -*- coding: utf-8 -*-
"""
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
"""

# Importing required packages.
from flask import Flask, request
from flask_cors import CORS, cross_origin
import os.path
import json

# Setting up Flask server properties.
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Importing required packages.
storageTXT = []
storageJSON = {}
def prepareStorage():
    global storageTXT
    global storageJSON
    # Create empty "storage.txt" file if it does not exist.
    if(not os.path.isfile("storage.txt")):
        open("storage.txt", 'a').close()
    
    # Prepares storage database for webserver use.
    storageTXT = open("storage.txt", 'r').read().split('\n')
    storageJSON = {"phrases": []}
    for i in range(0, len(storageTXT)):
        storageJSON["phrases"].append({"id": str(i + 1), "phrase": storageTXT[i]})
    

# RESTful ROUTES.
# /write POST route.
@app.route("/write", methods=["POST"])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def write():
    global storageTXT
    global storageJSON

    # Storing requested phrase.
    data = request.form["phrase"]

    # Append to existing database if not empty.
    if(storageTXT[0] != ""):
        with open("storage.txt", "a") as storageFile:
            storageFile.write("\n" + data)
        
        storageTXT.append(data)
        storageJSON["phrases"].append({"id": str(len(storageTXT) + 1), "phrase": data})
        print("Saved!")
    
    # Write to new database if empty.
    else:
        with open("storage.txt", "a") as storageFile:
            storageFile.write(data)
        
        storageTXT[0] = data
        storageJSON["phrases"][0] = {"id": str(len(storageTXT) + 1), "phrase": data}
        print("Saved!")
    
    # Reindexing storageTXT and storageJSON.
    prepareStorage()

    # Returning line number written.
    return json.dumps({"id": str(len(storageTXT) + 1)})


# /read GET route.
@app.route("/read", methods=["GET"])
def read():
    # Returing the entire pre-formatted storageJSON object.
    return json.dumps(storageJSON)

# /delete/<line_number> DELETE route.
@app.route("/delete/<line>", methods=["GET"])
def delete(line):
    global storageTXT
    global storageJSON

    # Trying to see if delete line request is a number.
    try:
        int(line)
        # If the line number is positive, and less than current database length delete line.
        if(0 < int(line) <= len(storageTXT)):
            # Checking is not last phrase.
            if(len(storageTXT) > 1):
                del storageTXT[int(line) - 1]
            
            # If deleting last entry.
            else:
                storageTXT = [""]

            # Write new storageTXT into file.
            with open("storage.txt", "w") as storageFile:
                for line in storageTXT[:-1]:
                    storageFile.write("%s\n" % line)

                storageFile.write("%s" % storageTXT[-1])
                
            # Reindex storageTXT and storageJSON.
            prepareStorage()

            # Returning delete results.
            return json.dumps({"success": True})
        
        else:
            # Returning delete results.
            return json.dumps({"success": False})

    # If the delete line number request is not a number.
    except ValueError:
        # Returning delete results.
        return json.dumps({"success": False})

# Default 404 requests.
@app.route("/")
def index():
    return "Whoops. This server only accepts /write, /read, and /delete/<lineNumber>"

# STARTING SERVER.
if __name__ == "__main__":
    # Prepare database from storage.txt
    prepareStorage()
    # Starting webserver.
    app.run(
        host='localhost',
        port=8080,
        debug = True)

