var canvas = document.getElementById("Canvas1")
var sliderDis = document.getElementById("DistanciaSli");
var sliderPas = document.getElementById("PasosSli");
var sliderV = document.getElementById("Vsli");
var sliderR1 = document.getElementById("R1Sli");
var sliderR2 = document.getElementById("R2Sli");
var c = canvas.getContext('2d');


var ancho = 1000;
var alto = 450;
canvas.width = ancho;
canvas.height = alto ;
var centroX = ancho/2;
var centroY = alto/2;

var maxCargas = 11;

/*/sliderDis.min = 100;
sliderDis.max = 700;
sliderPas.min = 0;
sliderPas.max = maxCargas-1;
sliderPas.value = 0;
/*/
var numCargas=sliderPas.value;


//NEW 29/01
var largoMed = 100;
var altoMedidor = 50;
var anchoMedidor = 100;
var marcoMedidor = 10;
var medidorGap = 60;


var PixelMet = 20;
var k = 8987551787;

//Valores iniciales (Pixeles)
var dist = sliderDis.value;   //Distancia entre cargas
var rad1 = sliderR1.value ;    //RADIO esfera 1 = con V
var rad2 = sliderR2.value;   //Radio esfer 2 V = 0;
var centro1X = centroX-dist/2;
var centro2X = centroX+dist/2;
/*/sliderDis.value = dist;
sliderR1.value = rad1;
sliderR2.value = rad2;
/*/
//Valores escalados
var d=dist/PixelMet;
var r=rad1/PixelMet;
var R=rad2/PixelMet;
var v1 = sliderV.value;      //Potencial esfera 1
var v2 = 0;        //potencial esfera 2
var qinicial = v1*r/k;
//sliderV.value = v1;

//Primera Carga de datos
drawCircle(centro1X ,centroY,rad1);
drawCircle(centro2X,centroY,rad2);



var arrayCargas =[];
var arrayCargas2=[];

//NEW 2901
var arrayMedidores =[];
arrayMedidores.push(new medidor(centro1X-rad1,centroY,largoMed));
arrayMedidores.push(new medidor(centro1X+rad1,centroY,largoMed+ medidorGap));
arrayMedidores.push(new medidor(centro2X-rad2,centroY,largoMed));
arrayMedidores.push(new medidor(centro2X+rad2,centroY,largoMed+ medidorGap));

actualizarFrame();

refresh.onclick = function(){
  dist = sliderDis.value;
  v1 = sliderV.value;
  rad1 = sliderR1.value;
  rad2 = sliderR2.value;
  numCargas=sliderPas.value;
  R=rad2/PixelMet;
  r = rad1/PixelMet;
  qinicial = v1*r/k;
  actualizarDatos();
  actualizarFrame();
}

/*/Se actualiza cada vez que el mouse pasa por el slider de Distancias
sliderDis.addEventListener("mousemove",function()
{ dist = sliderDis.value;
  actualizarDatos();
  actualizarFrame();
})


//Se actualiza cada vez que el mouse pasa por el slider de Cargas
sliderPas.addEventListener("mousemove",function()
{  actualizarDatos();
  actualizarFrame();
})

sliderV.addEventListener("mousemove",function()
{ v1 = sliderV.value;
  qinicial = v1*r;
  actualizarDatos();
  actualizarFrame();
})
sliderR1.addEventListener("mousemove",function()
{ rad1 = sliderR1.value;
  r = rad1/PixelMet;
  actualizarDatos();
  actualizarFrame();
})
sliderR2.addEventListener("mousemove",function()
{ rad2 = sliderR2.value;
  R=rad2/PixelMet;
  actualizarDatos();
  actualizarFrame();
})

sliderMode.addEventListener("mousemove",function()
{ Mode = sliderMode.value;
  actualizarDatos();
  actualizarFrame();
})
/*/



//Actualiza todos los datos,
function actualizarDatos(){
  centro1X = centroX-dist/2;
  centro2X = centroX +dist/2;
  arrayMedidores[0].x = centro1X-rad1;
  arrayMedidores[1].x = centro1X-(-rad1);
  arrayMedidores[2].x = centro2X-rad2;
  arrayMedidores[3].x = centro2X-(-rad2);
  d=dist/PixelMet;

  arrayCargas=[];
  arrayCargas2=[];
  for(var i = 0;i < numCargas ; i++){
    var posicion = calPosUno(i);
    var q = calCargaUno(i);
     arrayCargas.push(new CargaP(centro1X+posicion*PixelMet,centroY,4,q))
  }
  for(var i = 1;i < numCargas ; i++){
    var posicion = calPosDos(i);
    var q = calCargaDos(i);
    arrayCargas2.push(new CargaP(centro2X-posicion*PixelMet,centroY,4,q))
  }

 /*/ var conta = sliderPas.value;
    for(var i = 0 ;i<arrayCargas.length;i++){
      if(i<conta){
      arrayCargas[i].Boolshow = 1;
      }
      else {
      arrayCargas[i].Boolshow = 0;
      }
    }

    for(var i = 0 ;i<arrayCargas2.length;i++){
      if(i<conta){
  	arrayCargas2[i].Boolshow = 1;	}
      else {
  	arrayCargas2[i].Boolshow = 0; }
    }/*/
}

async function actualizarFrame(){
  c.clearRect(0,0,ancho,alto);
  DrawGrid();
  drawCircle(centro1X,centroY,rad1);
  drawCircle(centro2X,centroY,rad2);
  for (var i = 0;i<arrayCargas.length;i++){
    arrayCargas[i].show();
    await sleep(300);
    if(i<arrayCargas2.length){
      arrayCargas2[i].show();
      await sleep(300);
    }
    for(var j=0;j<arrayMedidores.length;j++){
      arrayMedidores[j].actualizarValor(i,0);
      arrayMedidores[j].show();
      sleep(300);
    }
    await sleep(500); 
  }
}




function CargaP(x, y , r , q){
  this.x = x;
  this.y = y;
  this.r = r;
  this.q = q;
  this.Boolshow = 1;
  this.show = function(){
    if(this.Boolshow == 0){   return;   }

    c.beginPath();
    c.arc(this.x ,this.y,this.r,0,Math.PI*2,false);
    if(this.q >=0){
      c.strokeStyle = 'rgba(200,0,0,1)';
      c.fillStyle = 'rgba(200,0,0,1)';}
    else{
      c.strokeStyle = 'rgba(0,0,200,1)';
      c.fillStyle = 'rgba(0,0,200,1)';}
    c.stroke();
    c.fill();
    c.beginPath();
    c.arc(this.x,this.y,this.r*0.75,0,Math.PI*2,false);
    if(this.q>=0){
      c.fillStyle = 'rgba(255,0,0,1)';}
    else{
        c.fillStyle = 'rgba(0,0,255,1)';}
    c.stroke();
    c.fill();
    c.fillStyle = 'rgba(0,0,0,1)';
    //Texto indicador
    c.textAlign = "center";
    c.font = "15px Arial";
    c.fillText((this.q*Math.pow(10,9)).toPrecision(3)+"nC", this.x, this.y+25+Math.random()*95*Math.floor((Math.random()*2-1)));
  }

  //NEW 29/01
  this.CalcPotencial = function(xr,yr){
    distR = Math.sqrt((this.x-xr)*(this.x-xr)+(this.y-yr)*(this.y-yr));
    distMet = distR/PixelMet;
    return k*this.q/distMet;
  }
}

//NEW 29/01
function medidor(ix,iy,id){
  this.x = ix;
  this.y = iy;
  this.d = id;
  this.ValorV = 0;


  this.show = function(){
    c.beginPath();
    c.moveTo(this.x,this.y);
    c.lineTo(this.x,this.y+this.d);
    c.strokeStyle = 'rgba(0,0,0,1)';
    c.stroke();
    c.fillStyle = 'rgba(0,180,200,1)'
    c.fillRect(this.x-anchoMedidor/2  , this.y+this.d  ,anchoMedidor, altoMedidor);
    c.fillStyle = 'rgba(255,255,255,1)'
    c.fillRect(this.x-anchoMedidor/2 + marcoMedidor ,this.y+this.d+marcoMedidor, anchoMedidor-2*marcoMedidor ,altoMedidor-2*marcoMedidor);
    c.fillStyle = 'rgba(0,0,0,1)'
    c.textAlign = "center";
    c.font = "15px Arial";
    if(Math.abs(this.ValorV)<0.0000000000001){
      c.fillText((this.ValorV*(Math.pow(10,12))).toFixed(3)+"pV", this.x, this.y + this.d + altoMedidor/2 + 7); 
    }
    else{
      c.fillText((this.ValorV).toFixed(3)+"V", this.x, this.y + this.d + altoMedidor/2 + 7);
    }
    
  }

  this.actualizarValor = function(conta,modo){
    this.ValorV = 0;
      for(var i=0;i<conta;i++){
        this.ValorV+= arrayCargas[i].CalcPotencial(this.x,this.y);
        if(i<arrayCargas2.length){
          this.ValorV+= arrayCargas2[i].CalcPotencial(this.x,this.y);
        }
      }
  }
}

function drawCircle(x,y,r){
  c.strokeStyle = 'rgba(0,0,0,1)';
  c.beginPath();
  c.arc(x,y,r,0,Math.PI*2,false);
  c.stroke();
}

//Iba a ser una calculadora grafica pero F :c
function Graficador(eti1,eti2,step1,step2,canv){
  canv.width = 500;
  canv.height = 500;
  var ctx = canv.getContext('2d');
  ctx.moveTo(5,5);
  ctx.lineTo(5,300);
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.stroke();
};

function calCargaDos(s){
	if(s==0){return 0;}
	var x = calPosUno(s-1);
	var q = calCargaUno(s-1);
	var q2 = -q*R/(d-x);
	return q2;
}

function calPosDos(s){
	if(s==0){return 0;}
	var x1 = calPosUno(s-1);
	var x2 = R*R/(d-x1);
	return x2;
}

function calCargaUno(s){
	if(s==0){return qinicial;}
	var q2 = calCargaDos(s);
	var x2 = calPosDos(s);
	var q = -(q2)*r/(d-x2);
	return q;
}

function calPosUno(s){
	if(s==0){return 0;}
	var x2 = calPosDos(s);
	var x = r*r/(d-x2);
	return x;
}

function DrawVertical(posX){
  c.moveTo(posX,0);
  c.lineTo(posX,alto);
  c.stroke();
}
function DrawHorizontal(posY){
  c.moveTo(0,posY);
  c.lineTo(ancho,posY);
  c.stroke();
}

function DrawGrid(){
  c.strokeStyle = 'rgba(200,200,200,1)';
  for(var i = 0; i*PixelMet < ancho;i++){
    DrawVertical(i*PixelMet);
  }
  for(var i = 0; i*PixelMet < alto;i++){
    DrawHorizontal(i*PixelMet);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
