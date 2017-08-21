document.addEventListener('DOMContentLoaded', function() {

/*
¡   Globals:
¡   timestamp,base,rates,count
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞*/
var ts = document.querySelectorAll('.timestamp');
var ba = document.querySelectorAll('.base');
var ras = document.getElementById('main');
var count = 0;
var date,day,base,rate,purchasevalue,dchange;
var rates = [];
/*
¡ uses ajaxUtil.js
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞*/
FacingOutAjax.sendGetRequest("js/data.json", function(res) {
   
   //¡» data.json file
   days = ["2017-01-01","2017-01-02","2017-01-03","2017-01-04","2017-01-05","2017-01-06",
           "2017-01-07","2017-01-08","2017-01-09","2017-01-10"];
      
      for(var i=0; i < res.length; i++) {
         date = res[i][days[i]].timestamp;
         date = new Date(date*1000);
         date = date.toDateString();
         base = res[i][days[i]].base;
         rates.push(res[i][days[i]].rates);
         ts[i].textContent = date;
         ba[i].textContent = base;
      }//for


}); //¡» FacingOutAjax


/*
¡ openPopup fn
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞*/
function openPopup(asof,rate,value,purchasevalue,pvday,pchange){
      var popup = document.createElement('div');
      popup.className = "popup";
      width = 300;
      height = 200;
      var message = document.getElementById('tmessage');
      //»¡ counts tables & sets its positioning
      count += 1;
      console.log(count);
      //¡» checkifitexists
      if(document.getElementById('stefano') == null) {
          //¡» first table has an id
          popup.id = 'stefano';  
      }
      //»¡ displays message if 5 tables already exists
      else if(count >= 7) {
          message.innerHTML = '<p>Please close one or more tables before continuing!<span id="x">X</span></p>';
          message.style.display = "block";
          //¡» remove sidemenu
          document.querySelector('.sidever').style.display = 'none';

          return true;
      }

      //¡» inserting popup
      var handle = document.querySelector('.sidever');
      popup.innerHTML = ' <table id="popwrapper' + count + '"' + ' class="main" align="center" id="main" width="300" height="200" align="center" border="0" cellpadding="0" cellspacing="0"> <tr> <td valign="top" class="header">Currency: ' + rate +  '<div class="isX">x</div></td></tr><tr> <td valign="top" class="subheading">As of ' + asof  + '</td></tr><tr> <td valign="top" id="innerContainer"> <table cellpadding="0" cellspacing="0" border="1" width="100% bg="#f3f2f2"> <tr> <td valign="top" class="cktd"><label for="xchange">Exchange rate:</label><input name="xchange" type="text" value="'+ value +'" class="txbox"/></td><td valign="top" class="cktd"><label for="percent">$1USD:</label><input name="percentage" type="text" value="'+ purchasevalue +'"' + ' class="txbox"/></td><td valign="top" class="cktd"><label for="pday">Previous day:</label><input name="pday" value="'+  pvday  + '" type="text" class="txbox"/></td><td valign="top" class="cktd"><label for="pday">Day change:</label><input name="pday" value="'+  dchange  + '" type="text" class="txbox"/></td></tr></table> </td></tr></table> ';
      handle.parentElement.appendChild(popup);
      var victim;
      document.getElementById('sidebar').
        addEventListener('click',function(e) { 
            if(e.target.classList.length == 1) {
              victim = e.target.parentElement.parentElement.parentElement.parentElement;
              console.log(victim);
              e.target.classList.remove('isX');
              victim.parentElement.removeChild(victim);
              count -= 1;
              console.log(count);         
            }
         
         

        },false);
        
}//¡» openPopup fn


/*
¡ message-X evt
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞*/
document.getElementById('sidebar').addEventListener('click',function(e) {
      if(e.target.tagName =='SPAN') {
        //¡» removes message
        document.getElementById('x').parentElement.style.display = "none";
        //¡» removes tables
        var pisout = document.querySelectorAll('.popup');
        for(var i=0; i<pisout.length; i++) {
          pisout[i].style.display = 'none';
        }
        //¡» bring-back sidemenu
        document.querySelector('.sidever').style.display = 'block';
        //¡» resets count
        count = 0;
      }
},false); //¡» message evt

/*
¡ calls openPopup fn
∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞*/
ras.addEventListener('click',function(e) {
  var pre = e.target.parentElement.parentElement.parentElement.parentElement;
  //whatever-it-takes-approach
  var abrate =  pre.previousElementSibling.innerText;
  var arr = rates;
  var key,value, pchange,asof,prevday,pvday;
  //asof
  asof = pre.firstElementChild.outerText;
  asof = asof.replace(/ *\b\S*?timestamp\S*\b/g, '');
  //01,02,03..
  abrate = abrate.substr(abrate.length-2,abrate.length);
  //remove leading zeros 1,2,3
  abrate = abrate.replace(/^0+/, '');
  abrate = Number(abrate);
  //rates
  key = arr[abrate - 1];
 //hashless AED,AFN
  rate = e.target.innerText;
  // rate = rate.substr(1,rate.length);-nohash
  console.log(rate);
  value = key[rate];
  value = value.toFixed(2);
  console.log(value);
  //purchasevalue
  purchasevalue = (1 / value);
  purchasevalue = Math.round(purchasevalue*10000)/10000;
  console.log(purchasevalue);

  //previous day
  prevday = arr[abrate - 2];
  if(prevday == undefined) {
    pvday = 'no data available';
    dchange = 'no data available';
  }
  else {
    pvday =prevday[rate];
    pvday = pvday.toFixed(2);
    console.log(pvday);
    //change
    pchange = value - pvday;
    pchange = value - pvday;
    dchange = pchange.toFixed(2);
    
   
    
  }


  openPopup(asof,rate,value,purchasevalue,pvday,dchange);
},false);




});  //•.DOMContentLoaded
