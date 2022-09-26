/*
    This code deals with the user's interaction on a website:
    - Press Ctrl+Alt to highlight the element under the cursor.
    - Scroll while they're still pressed to resize the element.
*/



// Prevent normal scrolling when Ctrl & Alt are pressed
window.addEventListener("wheel", e => (e.ctrlKey && e.altKey)? e.preventDefault() : e, { passive:false })



// HIGHLIGHT
// While Ctrl&Alt are pressed, the deepest element under the cursor is highlighted to show what will be resized if we scroll.
// When Ctrl&Alt are pressed, the element underneath is highlighted, and when they are depressed, it is un-highlighted.
// When moving the cursor from an element to another, the 1st one is un-highlitghted and the 2nd is highlighted. 


// Track which element(s) are highlighted. onmouseout is not reliable and sometimes leaves multiple elements highlighted.
// Instead of just un-highliting the element we just moved out of (onmouseout's e.target), we keep track of the elements
// we highlight and un-highlight them all when needed.
var highlightedElements = []    

// When pressing the key combination, highlight the element under the cursor which will be resized if we scroll
document.onkeydown = function(e){
    if (!(e.ctrlKey && e.altKey)) return;   // Do nothing if Ctrl & Alt aren't pressed
    var deepestNode = GetDeepestNodeUnderCursor();
    highlightElement(deepestNode);
}

document.onkeyup = function(e){
    if (e.ctrlKey && e.altKey) return;   // Do nothing if both Ctrl & Alt are still pressed
    unhighlightElements();
}


// When mouse cursor moves from one element to another, un-highlight the first and highlight the second
document.onmouseover = function(e){
    if (!(e.ctrlKey && e.altKey)) return;   // Do nothing if Ctrl & Alt aren't pressed
    highlightElement(e.target);
}

document.onmouseout = function(e){
    if (!(e.ctrlKey && e.altKey)) return;   // Do nothing if Ctrl & Alt aren't pressed
    unhighlightElements();
}



function highlightElement(element){
    element.style.outline = 'red solid 1px';   // Highlight with a red border
    highlightedElements.push(element);
}

function unhighlightElements(){
    for (let i=0; i<highlightedElements.length; i++)
        highlightedElements[i].style.outline = '';

    highlightedElements = [];
}


// Called when scroll wheel is scrolled
document.onwheel = function (e){

    if (!(e.ctrlKey && e.altKey)) return;   // Only scale when Ctrl & Alt are pressed

    var deepestNode = GetDeepestNodeUnderCursor();

    // Get element's current scale (it works because offsetWidth returns the original width no matter how much the element is scaled)
    var currScale = deepestNode.getBoundingClientRect().width / deepestNode.offsetWidth;

    if(e.deltaY > 0) deepestNode.style.transform = 'scale(' + (currScale-0.1) + ')';   // Scroll down
    else             deepestNode.style.transform = 'scale(' + (currScale+0.1) + ')';   // Scroll up
        
    e.preventDefault(); // Prevent page from scrolling
}



// Return the deepest node under the mouse cursor
function GetDeepestNodeUnderCursor(){
    var nodesUnderCursor = document.querySelectorAll(":hover");   // Returns list of all nodes present under the cursor, from top to bottom
    var deepestNode = GetDeepestNode(nodesUnderCursor);
    return(deepestNode);
}


// Given a list of nested nodes (e.g. [body, div, div, a, img]) returns the deepest one (img)
function GetDeepestNode(nodeList){
    return( nodeList[nodeList.length-1] )   // Return last element in the array
}


// Given a list nested nodes (e.g. [body, div, h3.title, a]) returns the deepest one that has a class (h3.title)
function GetDeepestNodeWithClass(nodeList){
    for (var i=nodeList.length-1; i>=0; i--) {    // Loop from the end
        var node = nodeList[i];

        if (node.className){    // If it has a class (or more than one)
            return(node);
        }
    }
    return("");
}
