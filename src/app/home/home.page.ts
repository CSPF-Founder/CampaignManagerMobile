import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {Platform, NavController,ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  ref : any;
  username : string;
  password : string;
  rememberMe : boolean;
  
  

  constructor(private browser:InAppBrowser, private http:HttpClient,private platform:Platform, private toastCtrl:ToastController, private storage:Storage){


     this.rememberMe = true;
     this. username = null;
     this.password= null;
    let temp = "";
    console.log(" i am before check store value");
    this.storage.get("remember").then((val)=>{
      console.log("here the username token is saved:"+val);
      temp = val;
      if(temp == "yes"){
        console.log("i am getting values");
        this.storage.get("username").then((val)=>{
              console.log("here the username token is saved:"+val);
              this.username = val;
            });
            this.storage.get("password").then((val)=>{
              console.log("here the username token is saved:"+val);
              this.password = val;
            });
            // this.getIntoApp();
      }
    });

    // if(temp == "yes"){
    //   this.storage.get("username").then((val)=>{
    //     console.log("here the username token is saved:"+val);
    //     this.username = val;
    //   });
    //   this.storage.get("password").then((val)=>{
    //     console.log("here the username token is saved:"+val);
    //     this.password = val;
    //   });
    // }
    // else{
    //   this.username="";
    //   this.password="";
    // }
    
   
  }
  
  closeApp(){

    navigator['app'].exit();
    
  }
  ngOnInit() {
    
   
  }

  getIntoApp() {
    
    // this.username="feeder1";
    // this.password = "feeder1@1234";

  //   if (this.rememberMe==true){
      
  //   this.storage.get("username").then((val)=>{
  //     console.log("here the username token is saved:"+val);
  //     this.username = val;
  //   });
  //   this.storage.get("password").then((val)=>{
  //     console.log("here the password token is saved:"+val);
  //     this.password=val;
  //   });
    

  // }

  console.log("username: "+this.username);
  console.log("password:"+this.password);

    var pageContent = '<html><head></head><body><form id="loginForm" action="http://[SERVER_IP]/user/login" method="post">' +
'<input type="hidden" name="username" value="' + this.username + '">' +
'<input type="hidden" name="password" value="' + this.password + '">' +
'<input type="hidden" name="login" value="Login">' +
'</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';
var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
    
    //this.ref = this.browser.create('http://[SERVER_IP]/feed/add','_blank',{toolbar:'no',location:'no',zoom:'no',clearcache:'yes'});
    this.ref = this.browser.create(pageContentUrl,'_blank',{toolbar:'no',location:'no',zoom:'no',clearcache:'yes'});
    
    
  }

  login(){
    console.log("username:"+this.username);
    console.log("password:"+this.password);
    console.log("rememberMe:"+this.rememberMe);

    

    if(this.rememberMe == true){
      this.storage.set("username",this.username);
      this.storage.set("password", this.password);
      this.storage.set("remember","yes");
    }else{
      this.storage.set("remember","no");
    }
    this.getIntoApp();
    //this.validation();
  }

  async showToast(toastMessage: string) {

    console.log("i am reached the show toast method");
    const toast = await this.toastCtrl.create({
      message: toastMessage,
      duration: 2000
    });
    toast.present();
  }

  validation(){
    if(this.username == null || this.username =="" || this.password== null || this.password=="" ){
      this.showToast('Username and Password should not be empty');
      console.log("username and pasword is empty");
    }else{
      console.log("reached here validation else");
      this.postdata(this.username,this.password);
    }
  }
  
  
  async postdata(usernameVal: string, passwordVal: string){
    
  
    let formData= new FormData();
    formData.append("username",usernameVal);
    formData.append("password",passwordVal);
    formData.append("login","Login");
  
    let body = 'username=' + usernameVal + '&password=' + passwordVal;
    
    const header = {
      //'X-Requested-With' :'XMLHttpRequest'
      };
      const httpOptions = new HttpHeaders(header);
    
    let response = await this.http.post('http://[SERVER_IP]/user/login',formData).subscribe((res) =>{
      console.log("res is "+  res);
      
      if(res['error'] == "Invalid Credentials"){
     
        this.showToast('Invalid credentials, Try Again!');
        console.log("error from the response");
  
       }else if(res['success']== "Logged In"){
  
        if(this.rememberMe==true){
        console.log("session is:"+res['Cookie']);
        
        this.storage.set("username",usernameVal);
        this.storage.set("password",passwordVal);
        
       }
        
        
        this.showToast('You are Logged In!');
  
        console.log("success from the response");
        this.getIntoApp();
        // this.navCtrl.navigateRoot('/input-feeder');
       }else {
         console.log("i am in final else");
  
         this.showToast('try again later!');
       }
      return res;
    }
  
  , (error:any )=>{
    console.log("error is=>"+error);
    
  });
  
console.log("here response is="+response);
}


}
