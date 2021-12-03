
var Rectangles=[];// 2D Array containing all the rectangles added to the canvas(x,y,width,height,color,dragged)
var prevRect=[0,0,0,0];
// get canvas and context
const canvasEle = document.getElementById( 'canvas' );
canvasEle.width= window.innerWidth-100;
canvasEle.height= window.innerHeight-120;
const drawingContext = canvasEle.getContext( '2d' );
let startPos = {x:0,y:0};
let paint = false;
let drag = -1;
setupListeners();

function setupListeners() {
    // event listeners
    canvasEle.addEventListener( 'pointerdown', function ( e ) {
        // check if cursor position(cx,cy) is on any previous rectangle
        cx=e.offsetX;
        cy=e.offsetY;
        startPos={x:cx,y:cy};        
        for (let i=0;i<Rectangles.length;i++){
            r=Rectangles[i];
            if(cx>r[0] && cx<r[2]+r[0] && cy<r[1] && cy>r[3]+r[1])
            {
                drag=i;
            }
        };
        if (drag==-1) {
            paint = true;
        }
    } );

    canvasEle.addEventListener( 'pointermove', function ( e ) {
        if ( paint ) drawOutline(  e.offsetX, e.offsetY );
        else if(drag>-1) dragRect(e.offsetX,e.offsetY,drag);
    } );

    canvasEle.addEventListener( 'pointerup', function (e) {
        if ( paint ){
            draw(  e.offsetX, e.offsetY );
            paint = false;
            drag=-1;
        }
        else if(drag>-1){
            dragRect(e.offsetX,e.offsetY,drag);
            drag= -1;
        }
    } );
    canvasEle.addEventListener( 'pointerleave', function () {
        paint = false;
        drag= -1;
    } );
    canvasEle.addEventListener( 'dblclick', function (e) {
        cx=e.offsetX;
        cy=e.offsetY;
        for (let i=0;i<Rectangles.length;i++){
            r=Rectangles[i];
            if(cx>r[0] && cx<r[2]+r[0] && cy<r[1] && cy>r[3]+r[1])
            {
                Rectangles.splice(i,1);
            }
        };
        redrawCanvas();
    } );
}

function dragRect(currX,currY) {
    xDis=startPos.x-currX;
    yDis=startPos.y-currY;
    startPos={x:currX,y:currY};    
    Rectangles[drag][0]-=xDis;
    Rectangles[drag][1]-=yDis;
    Rectangles.push(Rectangles.splice(drag,1)[0]);//Making the current rect come to the top
    drag=Rectangles.length-1;
    redrawCanvas();
}

function draw(  xx, yy ) {
    
    // draw a new rect from the start position 
    // to the final mouse position
    var endx = (xx - startPos.x);
    var endy = (yy - startPos.y);
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    console.log(randomColor)
    drawingContext.globalAlpha = 1;
    drawingContext.fillStyle = '#'+randomColor+'';
    drawingContext.fillRect(startPos.x,startPos.y,endx,endy);
    drawingContext.strokeRect(startPos.x,startPos.y,endx,endy);
    
    //adding drawn rectangles to array
    Rectangles.push([startPos.x,startPos.y,endx,endy,randomColor,0]);
    // startPos={x:0,y:0};

}

function drawOutline(xx, yy ) {

    redrawCanvas();
    //clearing overlaps
    drawingContext.clearRect(prevRect[0],prevRect[1],prevRect[2],prevRect[3]);
    
    // draw a new rect from the start position 
    // to the current mouse position
    var endx = (xx - startPos.x);
    var endy = (yy - startPos.y);
    drawingContext.fillStyle = '#cce6ff';
    drawingContext.fillRect(startPos.x,startPos.y,endx,endy);
    prevRect=[startPos.x,startPos.y,endx,endy];
}

function redrawCanvas() {
    // Make sure that all previous rectangles are not erased
    drawingContext.fillStyle = '#f1eeee';
    drawingContext.fillRect( 0, 0, canvasEle.width,canvasEle.height  );
    Rectangles.forEach(rectangle => {
        drawingContext.fillStyle = '#'+rectangle[4];
        drawingContext.fillRect(rectangle[0],rectangle[1],rectangle[2],rectangle[3]);
        drawingContext.strokeRect(rectangle[0],rectangle[1],rectangle[2],rectangle[3]);
    });
}

function resetCanvas() {
    drawingContext.fillStyle = '#f1eeee';
    drawingContext.fillRect( 0, 0, canvasEle.width,canvasEle.height  );
    Rectangles=[];         
}