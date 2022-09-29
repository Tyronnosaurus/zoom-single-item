/*
This is how we store data:

Domain (Object key) | Map* of CssSelector:ScaleFactor pairs (Object value)
-----------------------------------------
learnjavascript.com | 
iliketurtles.org    |
iloveyoumom.com     |

(*) Actually a string. A javascript map can't be stored, so we serialize it when saving and deserialize it when fetching.

*/


///////////////
//  LOADING  //
///////////////
// When the page loads, immediately fetch data from local storage for the current website's domain.
// For each CSS selector we have, find instances in the page and scale them accordingly.

try     { fetchDictOfResizeValues(); }   // Since this script gets loaded as a content script, this function gets executed whenever a website is loaded
catch(e){ console.log(e); }




// Given the current page, get its domain, and fetch from storage the dict with CssSelector-ResizeValue pairs
function fetchDictOfResizeValues(){
    domain = GetDomainOfCurrentPage()

    browser.storage.local.get(domain)
    .then(
        resizeItemsInPage,  // If successful, run this function (with the fetched map object as its argument)
        (error) => { console.log(`Fetching failed. Error: ${error}`); }   // Failure to retrieve data from storage   // Run if there's an error (key not found is not an error, it just returns an empty object!)
    )
}



// Given a map of (CSS selector & scale) pairs, resize any element in the current website that matches any of the selectors
function resizeItemsInPage(fetchedObj){

    // Fetching 1 key from storage yields an object with a single pair: {key:value}. The value is another map with the actual data we want (Css selectors and scale values)
    let serializedMap = GetFirstValueFromObj(fetchedObj);   // Extract just the data (value of the first key in the object)
    let mapSelSca = DeserializeMap(serializedMap);                // The fetched data is a string, which we deserialize to map (easier to work with)

    for (const [selector, scale] of mapSelSca) {
        instancesToResize = document.querySelectorAll(selector);       // For each selector, find all elements that match it in the page
        instancesToResize.forEach( e => {ResizeElement(e, scale);} );  // Resize each instance        
    }
}


// Given an html element in the document, resize it with the CSS scale() function
function ResizeElement(element, scale){
    element.style.transform = 'scale(' + scale + ')';   // Example: 'scale(1.3)'
}






//////////////
//  SAVING  //
//////////////

// This extension works by saving scale values for CSS selectors.
// The scaling will be applied to the selector in any page of the domain in which it was saved, not one specific page.

// Local Storage can only save key-value pairs. The key is the domain, and the value is a map of (CSS selector-scale) pairs.
// In order to edit the map, we need to fetch it, edit it, and save it again.


//Accessing local storage is an asynchronous operation, so we need to do a sequence of .then()
function SaveSelectorAndScalePair(domain, selector, scale){

    // Fetch data (CssSelectors-ScaleValues map) for this domain from local storage
    // If we give 1 key, it returns an object with 1 key-value pair
    browser.storage.local.get(domain)                               // Fetch data for a domain -> Returns an object: [domain:data]
    .then(
        (fetchedObj) => {
            let serializedMap = GetFirstValueFromObj(fetchedObj);   // Extract just the data (value of the first key in the object)
            let map = DeserializeMap(serializedMap);                // The fetched data is a string, which we deserialize to map (easier to work with)
            let updatedMap = UpdatePairInMap(map, selector, scale); // Add/overwrite/remove the new CssSelector-Scaling pair on the map
            SaveMapInLocalStorage(domain, updatedMap);              // Save the updated map back to local storage
        
        } ,
        (error) => { console.log(`Saving failed. Error: ${error}`); }   // Failure to retrieve data from storage
    );
 
}




function GetFirstValueFromObj(obj){
    // Returns value of the first key-value pair in an object.
    // Note: Order of keys in an object is usually respected by most browsers but not guaranteed. This function is mostly useful for objects with 0 or 1 keys.
    let value = Object.values(obj)[0];
    if(value === undefined) value = '';  // If there were no keys -> value is undefined -> Return an empty string, which is easier to work with.
    return(value);
}





//Given a map and a pair, adds it, edits it, or removes it (if it is 1 since that means no resizing)
function UpdatePairInMap(map, selector, scale){

    // Case 1: Already exists, equal to 1       -> Remove it
    // Case 2: Does not exist, equal to 1       -> Do nothing
    // Case 3: Does not exist, different than 1 -> Add it
    // Case 4: Already exists, different than 1 -> Overwrite it

    if ( floatsAreEqual(scale,1) ){    // Since scale is a float, we can't just do scale==1 due to precision issues
        if (map.has(selector))   map.delete(selector);    // Case 1
    }
    else                         map.set(selector,scale); // Cases 3, 4

    return(map);
}



//Save a map in local storage
function SaveMapInLocalStorage(domain, map){
        
    let serializedMap = SerializeMap(map);

    let objToSave = { [domain]:serializedMap };  //ECMAScript 2015 (ES6) allows dynamic computing of object properties with []

    browser.storage.local.set(objToSave)
    .then(
        Null, //()      => { console.log("Saving successful");              },
        (error) => { console.log(`Saving failed. Error: ${error}`); }   // Failure to retrieve data from storage
    );
}




// String -> map
function DeserializeMap(serializedMap){
    try  { return( new Map(JSON.parse(serializedMap)) ); }
    catch{ return( new Map() ); }  // If for some reason the saved data was invalid, discard it and start with a fresh map 
}


// map -> string
function SerializeMap(map){
    return( JSON.stringify(Array.from(map.entries())) );
}