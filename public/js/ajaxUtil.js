(function(global) {

//namespace to attach things to global
var ajaxScatola = {};
var isJsonResponse;

//return HTTP Request Obj/ not avail to global
function getRequestObject() {
   if(window.XMLHttpRequest) {
      return new XMLHttpRequest();
   }//if
   else if(window.ActiveXObject) {
      //old IE
      return new ActiveXObject("Microsoft.XMLHTTP");
   }//else
   else {
      global.alert("Ajax is not supported");
      return null;
   }

}//getRequestObject

//Ajax GET request 
ajaxScatola.sendGetRequest = function(requestUrl, responseHandler,isJsonResponse) {
      //get request obj
      var request = getRequestObject();
      //onreadystate - when server comesback with response we call handleResponse
      request.onreadystatechange =
         function() {
            handleResponse(request, responseHandler, isJsonResponse);
         };
         //then open GET
         request.open("GET", requestUrl, true);
         request.send(null);  //for POST only
};//fn

//Only calls user provided responseHandler
function handleResponse(request, responseHandler) {
   if((request.readyState == 4) &&
      (request.status == 200)) {
      
      //default-to-true
      if(isJsonResponse == undefined) {
         isJsonResponse = true;

      }//isJson

      if(isJsonResponse) {
         responseHandler(JSON.parse(request.responseText));

      }
      else {
         responseHandler(request.responseText);
      }

   }//if-readyState-status

}//fn
 
//Expose utility to global object
global.FacingOutAjax = ajaxScatola;

})(window);