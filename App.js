const https = require('https');
const fs = require('fs');


//this sends a get request to the the hostname
https.get('https://coderbyte.com/api/challenges/json/json-cleaning', (res) => {
    console.log('statuscode:', res.statusCode);
    //used to store the parsed data
    var parsedObj;
    //used to store data obtained
    let obj = '';

    //this receives the data from the get request made and carry out required logic
    res.on('data', (d) => {
        //converts data into a valid json object
        obj = JSON.parse(d);
        
        //collects all keys of the object and returns them as an array
        let keyArr = Object.keys(obj);
        //here we iterate over the items of the array to loop over properties of the object
        for (let item = 0; item < keyArr.length; item++) {
            // this checks if the values of each contains either either of -, N/A or '' and delete if true
            if (obj[keyArr[item]] == "-"||obj[keyArr[item]] == "N/A"||obj[keyArr[item]] == "") {
                delete obj[keyArr[item]];
                
            // this checks if the value of the key is an array and saves the value as a new array
            } else if (Array.isArray(obj[keyArr[item]])){
                let iArr = obj[keyArr[item]];
                // loops through the array to check unwanted values and removes them
                for (var x = 0; x < iArr.length; x++) {
                    if (iArr[x] === ""||iArr[x] === "-"||iArr[x] === "N/A") {
                        iArr.splice(x, 1)
                        
                    };
                };
            };
            
            // loops through second level objects to filter unwanted values
            for (let i in obj[keyArr[item]]) {
                
                if (obj[keyArr[item]][i] === "" || obj[keyArr[item]][i]==="N/A" || obj[keyArr[item]][i] === "-") {
                    delete obj[keyArr[item]][i];
                    
                    
                };
            };
            
            
        };

        // convert object tostring to be able to print to a file
        parsedObj = JSON.stringify(obj);
    });

    // on end of the operation, it writes to a new file
    res.on('end', () => {
        fs.writeFile('info.json', parsedObj + '\n', { flag: 'a' }, (err) => {
            if (err) {
                console.error(err.message);
            }
        })
        
    });
    
    

}).on('error', (e) => {
    console.error(e);
});
