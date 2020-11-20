//Create variables here
var dog, happyDog, database
var Dog, foodStock, anything, lastFed, feedTime
var feed, restock, foods
var Dead, Sleeping, Bathing, Playing, Vaccine
var currentTime
var gameState=0
function preload()
{
  //load images here
  dog=loadImage("images/dogImg.png")
  happyDog=loadImage("images/dogImg1.png")
  Dead=loadImage("images/deadDog.png")
  Sleeping=loadImage("images/Bed Room.png")
  Bathing=loadImage("images/Wash Room.png")
  Playing=loadImage("images/Garden.png")
}
function setup() {
	createCanvas(500, 500);
  Dog=createSprite(250,250,10,10)
  Dog.addImage( dog)
  Dog.scale=0.17
  database=firebase.database()
  foodStock=database.ref("foodStock")
  //foodStock.on("value", function(data){
    //foodStock=data.val()
  //}) 
  foodStock.on("value", readStock)
  anything= new Food()
  feed=createButton("Feed the Dog")
  feed.position(700,100)
  feed.mousePressed(feedDog)
  restock=createButton("Restock Food")
  restock.position(700,150)
  restock.mousePressed(RestockSupply)
  feedTime=database.ref("feedTime")
  feedTime.on("value",function(data){
    lastFed=data.val()
  })
}


function draw() {  
  background(46,139,87)
  currentTime=hour()
  if(currentTime==(lastFed+1)){
    update(1)
    anything.changeBG3()
    //3 is garden
  }
  else if(currentTime==(lastFed+2)){
    update(2)
    anything.changeBG2()
    //2 is washroom
  }
  else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
    update(3)
    anything.changeBG1()
    //1 is bedroom
  }
  else {
    
    update(4)
    anything.display()
  }
  fill("black")
  textSize(20)
  text("Food Stock: "+foods,200, 150)
 
  if(lastFed>=12){
    text("Last Fed: "+ lastFed%12+"PM",50,50)
  }
  else if(lastFed==0){
    text("Last Fed: 12 AM",50,50)
  }
  else{
    text("LastFed: "+lastFed+"AM",50,50)
  }
  if(gameState==1||gameState==2||gameState==3){
    feed.hide()
    restock.hide()
    Dog.remove()
  }
  else{
    Dog.addImage("dog", dog)
    restock.show()
    feed.show()
  }

  
  drawSprites()
  
}

  
  
function readStock(data){
  foods=data.val()
  anything.updateFoodStock(foods)
}

function RestockSupply(){
  foods++
  database.ref("/").update({
    foodStock:foods
  })
}
function feedDog(){
  Dog.addImage( happyDog)
  //anything.deductFoodStock()
  anything.updateFoodStock(anything.getFoodStock()-1)
  database.ref("/").update({
    foodStock:anything.getFoodStock(),
    feedTime:hour()
  })
}
function update(state){
  database.ref("/").update({
    gameState:state
  })
}

