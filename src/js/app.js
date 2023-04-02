import swal from 'sweetalert';
import axios from 'axios';

window.scrollTo({
  top: document.body.scrollHeight,
  behavior: 'instant'
});


let userEmail = document.getElementsByClassName("chatBox")[0].dataset?.user;
let chatWrapper = document.getElementsByClassName("chatBox-wrapper")[0];
chatWrapper.scrollTo({
  top: chatWrapper.scrollHeight,
  behavior: 'instant'
});



userEmail = JSON.parse(userEmail);





function msg(user,email,message){
    
    let mainChatbox = document.getElementsByClassName("chatBox")[document.getElementsByClassName("chatBox").length-1];
    let chatbox = document.createElement("div");
    chatbox.className="chatBox w-full h-fit my-2.5 ";
    let textbox = document.createElement("div");
    textbox.className="textBox text-xs md:text-base p-2 max-w-sm  ";
    if(user ==userEmail){
        textbox.classList.add("sent")
    }else{
        textbox.classList.add("received")
    }
    textbox.innerHTML = ` <p>From : ${user}</p>
                            <p> To : ${email}</p>
                            ${message}
                        `
    chatbox.appendChild(textbox)
    mainChatbox.insertAdjacentElement("afterend",chatbox);

   

}





let send = document.getElementById("send");
  

send.addEventListener('click',(e)=>{
    e.preventDefault();
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

         axios.post('/', {
            email: email,
            message: message
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then(function(response) {
            if(response.data.redirect =="/"){
              window.location ="/"
            }else{
              let {sender,receiver,message} ={...response.data};
              msg(sender,receiver,message);
              
              document.getElementById('message').value = '';
              chatWrapper.scrollTo({
                  top: chatWrapper.scrollHeight,
                  behavior: 'smooth'
              });
            }
          })
          .catch(function(error) {
            console.error(error);
          });
    
});

let receiverBtn = document.getElementById("receiverBtn");

receiverBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    let email = document.getElementById("email").value;
    axios.post("/setReceiver",{
      email
    },{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response)=>{
      let {receiver,message}=response.data;
      if(message){
        swal(`${message}`)
      }else if(receiver){
        swal("Receiver has been set").then((value)=>{
          window.location = "/"
        })
      }

    }).catch((error)=>{
      console.log(error)
    })
})

const socket = io();
// This socket will create a div called chatbox every time any sender creates send 
socket.on("message",(user,email,message)=>{
    msg(user,email,message);
    chatWrapper.scrollTo({
        top: chatWrapper.scrollHeight,
        behavior: 'smooth'
    });
})

socket.emit("join",userEmail);

