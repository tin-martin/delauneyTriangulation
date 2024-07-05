var vertices = [];

var triangles = [];
var WIDTH = 2400;
var LENGTH = 3200;

//var WIDTH = 848*5;
//var LENGTH = 1003*5;
var sTriangle;
var i = 0;
let pause = false;
var imgArr = [];

function preload(){  
  img = loadImage('skull.jpg');
}

function setup() {
 // vertices.push(new Vertex(0,0, [255,255,255]));
//vertices.push(new Vertex(2400,0, [255,255,255] ));
//vertices.push(new Vertex(2400,3200, [255,255,255] ));
  //noLoop();
  frameRate(200);
  noFill();
  createCanvas(WIDTH,LENGTH);
  
  image(img, 0, 0);
  //filter(GRAY);
  var SPACE = 20;
 
  for(var i=0;i<WIDTH;i+=SPACE){
    imgArr.push([]);

    for(var j=0;j<LENGTH;j+=SPACE){
      var c = get(i,j);
     // console.log(c);
      imgArr[i/SPACE][j/SPACE] = c;
    }
  }

  var count = 0;
  for(var i=0;i<WIDTH;i+=SPACE){
    for(var j=0;j<LENGTH;j+=SPACE){
      
     // stroke(imgArr[i/SPACE][j/SPACE]);
     var grayVal = 0.299*imgArr[i/SPACE][j/SPACE][0] + 0.587*imgArr[i/SPACE][j/SPACE][1] + 0.114*imgArr[i/SPACE][j/SPACE][2];
     if(Math.random(0,100) <= grayVal/255*1.5 && grayVal > 100){
        console.log(count);
        count++;
        vertices.push(new Vertex(i,j, imgArr[i/SPACE][j/SPACE]));
     }
      

    }
  }

  //sdfjdslkjflksdjflksdkjfkldsjfldsjkfsdljlfkdsljflksj SUPER TRIANGEL

  //Create bounding super triangle  
  //COPIED @symbolab.com/solver/step-by-step/%5Cfrac%7Bd%7D%7Bdx%7D%5Cleft(arctan%5Cleft(x%5Cright)%5Cright)?or=input
  var minX = Infinity;
  var minY = Infinity;
  var maxX = -Infinity;
  var maxY = -Infinity;

  vertices.forEach(function(vertex) {
    minX = Math.min(minX, vertex.x);
    minY = Math.min(minY,vertex.y);
    maxX = Math.max(maxX,vertex.x);
    maxY = Math.max(maxY, vertex.y);
   });
   var dX = (maxX - minX) * 10;
   var dY = (maxY - minY) * 10;

   var v0 = new Vertex(minX - dX, minY - dY * 3, [0,0,0]);
   var v1 = new Vertex(minX - dX, maxY + dY, [0,0,0]);
   var v2 = new Vertex(maxX + dX * 3, maxY + dY, [0,0,0]);

  sTriangle = new Triangle(v0,v1,v2);

   triangles.push(sTriangle);

 
}

function draw() {
 
 
  
    /*
    in this software, some particles are created randomly on an image
    the probability of particle creation is a function of the color value of the pixel in that location
    then particles are used as vertices of Delaunay tessellation

    OPTIONAL:
    make a GUI to control parameters such as:
        - number of particles
        - distribution curve of probability
        - color
        etc. 
    */
       if(i<vertices.length){
     // for(var i=0;i<vertices.length;i++){
        console.log(str(i)+ "/" + str(vertices.length));
          background(0);
      
          var u = vertices[i];
           //Update array of triangles by adding a new vertex
      
          // Remove triangles with circumcircles containing the vertex
          var tempArr = [];
          var uniqueEdges = [];
          
          for(var j=0;j<triangles.length;j++){
            if(!triangles[j].containsVertex(u)){
              tempArr.push(triangles[j]);
            }else{
               // Get unique edges 
              uniqueEdges.push( new Edge(triangles[j].v0, triangles[j].v1) );
              uniqueEdges.push( new Edge(triangles[j].v1, triangles[j].v2) );
              uniqueEdges.push( new Edge(triangles[j].v2, triangles[j].v0) );
            }
          }
          uniqueEdges = uniquify(uniqueEdges);
          for(var j=0;j<uniqueEdges.length;j++){
            tempArr.push(new Triangle(uniqueEdges[j].v0, uniqueEdges[j].v1, u));
          }
      
          triangles = tempArr;
      
          for(var j=0;j<triangles.length;j++){
            var t = triangles[j];
            //stroke(255);
            strokeWeight(2.5);
          //
            // v0, v1
            if(sTriangle.v0.equals(t.v0) || sTriangle.v0.equals(t.v1) || sTriangle.v0.equals(t.v2)){
              
            }
            else if(sTriangle.v1.equals(t.v0) || sTriangle.v1.equals(t.v1) || sTriangle.v1.equals(t.v2)){
             
            }
            else if(sTriangle.v2.equals(t.v0) || sTriangle.v2.equals(t.v1) || sTriangle.v2.equals(t.v2)){
             
            }else{
              var maxDist = 150;
              if(findDist(t.v0,t.v1) < maxDist){
                stroke( (t.v0.color[0]+t.v1.color[0])/2, (t.v0.color[1]+t.v1.color[1])/2, (t.v0.color[2]+t.v1.color[2])/2  );
                line(t.v0.x,t.v0.y,t.v1.x, t.v1.y);
              }
              
  
              //v1,v2
              if(findDist(t.v1,t.v2) < maxDist){
                stroke( (t.v1.color[0]+t.v2.color[0])/2, (t.v1.color[1]+t.v2.color[1])/2, (t.v1.color[2]+t.v2.color[2])/2  );
                line(t.v1.x,t.v1.y,t.v2.x, t.v2.y);
              }
              
  
              //v2,v0
              if(findDist(t.v2,t.v0) < maxDist){
                stroke( (t.v0.color[0]+t.v2.color[0])/2, (t.v0.color[1]+t.v2.color[1])/2, (t.v0.color[2]+t.v2.color[2])/2  );
                line(t.v2.x,t.v2.y,t.v0.x, t.v0.y);
              }
              
            }
         
            
          }
          
          strokeWeight(10);
          
          for(var j=0;j<vertices.length;j++){
          stroke(vertices[j].color);
    
           point(vertices[j].x,vertices[j].y);
          }
         strokeWeight(1);
          
        }else{
          for(var j=0;j<triangles.length;j++){
            var t = triangles[j];
            fill(t.v0.color);
            if(Math.random(0,100) <= 0.025){
             // triangle(t.v0.x,t.v0.y,t.v1.x,t.v1.y,t.v2.x,t.v2.y);
            }
            
          }
          saveCanvas('drawing', 'jpg')
          noLoop();
        }
      
       i++;
        //Remove triangles that share edges with super triangles
        

}


class Vertex{
  constructor(x,y,color){
    this.x = x;
    this.y = y;
    this.color = color;
  }

  equals(vertex){
    return this.x == vertex.x && this.y == vertex.y;
  }
}

//non-directional edges
class Edge{
  constructor(v0,v1){
    this.v0 = v0;
    this.v1 = v1;
  }

  equals(edge){
    return (this.v0 == edge.v0 && this.v1 == edge.v1) || (this.v0 == edge.v1 && this.v1 == edge.v0);
  }
}

class Triangle{
  constructor(v0,v1,v2){
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
  }

  //check if given vertex is within circumcircle of triangle
  containsVertex(v){
  
    
    //calculate perpendicular bisectors of two edges
    
    //y - y1 = m(x-x1)

    var x0 = (this.v0.x + this.v2.x)/2;


    var y0 = (this.v0.y + this.v2.y)/2;
    
    var m0 = -1/(  (this.v2.y - this.v0.y)/(this.v2.x - this.v0.x)  );

    var x1 = (this.v1.x + this.v2.x)/2;
    var y1 = (this.v1.y + this.v2.y)/2;
    var m1 = -1/(  (this.v2.y - this.v1.y)/(this.v2.x - this.v1.x)  );
    
    if(m0 == -Infinity){
      m0 = 0;
    }
    if(m1 == -Infinity){
      m1 = 0;
    }

    var xIntersect =  (y0 - y1 - m0*x0 + m1*x1) / (m1 - m0);
  
    var yIntersect = m1*(xIntersect - x1) + y1;

    //calculate radius of cicumcircle
    var radius = sqrt((yIntersect - this.v0.y)**2 + (xIntersect - this.v0.x)**2);

    //calculate distance of vertex to circumcircle origin
    var distToOrigin = sqrt((yIntersect - v.y)**2 + (xIntersect - v.x)**2);

    //  compare to radius to determine if vertex is within or not :)
   
    return distToOrigin <= radius;
  }
}

//copied from @https://www.gorillasun.de/blog/bowyer-watson-algorithm-for-delaunay-triangulation/
function uniquify(edges){
  var uniqueEdges = [];
  for(var i=0;i<edges.length;i++){
    var isUnique = true;
    for(var j=0;j<edges.length;j++){
      if(i != j && edges[i].equals(edges[j])){
        isUnique = false;
        break;
      }
    }
    if(isUnique){
      uniqueEdges.push(edges[i]);
    }
  }
  return uniqueEdges;
}
function mousePressed(){ //bei click Pause, bei 2. click weiter
  if(pause==false){
    noLoop();
    pause=true;
  }else{
    loop();
    pause = false;
  }
}

function findDist(v0,v1){
  return sqrt((v1.y - v0.y)**2+(v1.x - v0.x)**2);
}
