//Getting the html elements

let frndUL=document.getElementById('frndUL')
let friendSection=document.getElementById('friendDiv')
let chatSection=document.getElementById('chatDiv')
let inviteButton=document.getElementById('inviteFr')
let chatContainer=document.getElementById('chatContainer')
let searchButton=document.getElementById('searchButt')
let frndName=document.getElementById('frnd-name')
let frndLI=document.getElementsByClassName('frndli')
let online_Users=document.getElementById('onlineCount')
let all_Users=document.getElementById('userCount')
let letestChat=document.getElementById('latest-chats')
let chatList=document.getElementById('chat-list')


//Enabling share the site



setTimeout(()=>{

    all_Users.innerHTML=allUsers.length
    online_Users.innerHTML=onlineUsers.length
    for(let i=0;i<frndLI.length;i++){
        //Clicking any username
        frndLI[i].addEventListener('click',()=>{
    
    
        let name=frndLI[i].textContent
    
        let username=document.getElementById('username')
        let type=document.getElementById('type')
    
        username.textContent +=name
        friendSection.style.display='none'
        chatSection.style.display='block'
        let chat=[user.username,name]
    
       socket.emit('startChat',chat)
    
       function printDate(date){
        let hours=date.getHours()
        let minutes=date.getMinutes()
        if(minutes< 10){
            minutes=`0${minutes}`
        }
    
        if(hours === 00){
            hours=12
            return `${hours}:${minutes} AM`
        }else if(hours === 12){
            return `${hours}:${minutes} PM`
        }else if(hours > 12){
            hours= hours - 12
            return `${hours}:${minutes} PM`
        }else{
            return `${hours}:${minutes} AM`
    
        }
    
    }
    
    
    
                //retrive the chat history
                socket.on('savedChat',(data)=>{
                for(let i=0;i<data.length;i++){
                    var para=document.createElement('p')
                    if(data[i].from==user.username){
                        para.classList.add('me')
                    para.innerHTML=` ${data[i].msg} <br>`;
                    }else{
                        para.classList.add('otherUser')
    
                    para.innerHTML=`${data[i].msg} <br> `;
    
                    }
                    let timeSpan=document.createElement('span')
                    timeSpan.classList.add('time')
    
                    
                    let time=data[i].time
                    let date=new Date(time)
    
                    timeSpan.textContent=printDate(date)
                    para.appendChild(timeSpan)
                    div.appendChild(para)
                    chatContainer.scrollTop=chatContainer.scrollHeight
    
    
                }
                })
                //Saved chat Done
    
                //Sending message to the backend
                var send=document.getElementById('send')
                send.addEventListener('click',(e)=>{
                    e.preventDefault()
                                    
                    var msg=document.getElementById('msg').value;
                    socket.emit('newMsg',{msg:msg,user:user.username})
    
                    document.getElementById('msg').value=''
                    document.getElementById('msg').focus();
                    chatContainer.scrollTop=chatContainer.scrollHeight
    
                })
    
    
                      
                //Someone is typing
                let msg_box=document.getElementById('msg')
    
    
                msg_box.addEventListener('keyup',(e)=>{
                    socket.emit('typing',user)
                })
    
    
                socket.on('notifyTyping',(user)=>{
                    type.innerHTML=`${user.username} is typing`
                })
    
                msg_box.addEventListener('mouseleave',()=>{
                    type.innerHTML=``
                })      
                //Recieving the msg from the back-end and printing it on the client
                socket.on('newMsg',(info)=>{
                    var para=document.createElement('p')
                    if(info.from==user.username){
                        para.classList.add('me')
                    para.innerHTML=` ${info.msg} <br>`;
                    }else{
                    
                    para.classList.add('otherUser')
    
                    para.innerHTML=` ${info.msg} <br>`;
    
                    }
                    let timeSpan=document.createElement('span')
                    timeSpan.classList.add('time')
                    
                    let time=info.time
                    let date=new Date(time)
    
                    timeSpan.textContent=printDate(date)
                    para.appendChild(timeSpan)
                    div.appendChild(para)
                    chatContainer.scrollTop=chatContainer.scrollHeight
                  
                })
                
                
        })
    } 
},700)


    
//When users Search for a friend

searchButton.addEventListener('click',()=>{
    frndUL.innerHTML=''

    let content=frndName.value;
    for(let i=0;i<allUsers.length;i++){
        if(content == allUsers[i].username || content == allUsers[i].email){
            frndUL.innerHTML=''

           let list=document.createElement('li')
            list.innerHTML=`${allUsers[i].username}`
            list.classList.add('frndli')
            frndUL.appendChild(list)
            i=allUsers.length
            
for(let i=0;i<frndLI.length;i++){
    //Clicking any username
    frndLI[i].addEventListener('click',()=>{



    let name=frndLI[i].textContent

    let username=document.getElementById('username')
    let type=document.getElementById('type')

    username.textContent +=name
    
    friendSection.style.display='none'
    chatSection.style.display='block'
    let chat=[user.username,name]


    //When Someone want to start Chat

   socket.emit('startChat',chat)

   //To Print the time with messages
   function printDate(date){
    let hours=date.getHours()
    let minutes=date.getMinutes()
    if(minutes< 10){
        minutes=`0${minutes}`
    }

    if(hours === 00){
        hours=12
        return `${hours}:${minutes} AM`
    }else if(hours === 12){
        return `${hours}:${minutes} PM`
    }else if(hours > 12){
        hours= hours - 12
        return `${hours}:${minutes} PM`
    }else{
        return `${hours}:${minutes} AM`

    }

}



            //retrive the chat history
            socket.on('savedChat',(data)=>{
            for(let i=0;i<data.length;i++){
                var para=document.createElement('p')
                if(data[i].from==user.username){
                    para.classList.add('me')
                para.innerHTML=` ${data[i].msg} <br>`;
                }else{
                    para.classList.add('otherUser')

                para.innerHTML=`${data[i].msg} <br> `;

                }
                let timeSpan=document.createElement('span')
                timeSpan.classList.add('time')

                
                let time=data[i].time
                let date=new Date(time)

                timeSpan.textContent=printDate(date)
                para.appendChild(timeSpan)
                div.appendChild(para)
                chatContainer.scrollTop=chatContainer.scrollHeight


            }
            })

            //Chat history Printed and Done
            
            //Sending message to the backend
            var send=document.getElementById('send')
            send.addEventListener('click',(e)=>{
                e.preventDefault()
                                
                var msg=document.getElementById('msg').value;
                socket.emit('newMsg',{msg:msg,user:user.username})

                document.getElementById('msg').value=''
                document.getElementById('msg').focus();
                chatContainer.scrollTop=chatContainer.scrollHeight

            })


                  
            //Someone is typing
            let msg_box=document.getElementById('msg')


            msg_box.addEventListener('keyup',(e)=>{
                socket.emit('typing',user)
            })


            socket.on('notifyTyping',(user)=>{
                type.innerHTML=`${user.username} is typing`
            })

            msg_box.addEventListener('mouseleave',()=>{
                type.innerHTML=``
            })      
            //Recieving the msg from the back-end and printing it on the client
            socket.on('newMsg',(info)=>{
                var para=document.createElement('p')
                if(info.from==user.username){
                    para.classList.add('me')
                para.innerHTML=` ${info.msg} <br>`;
                }else{
                
                para.classList.add('otherUser')

                para.innerHTML=` ${info.msg} <br>`;

                }
                let timeSpan=document.createElement('span')
                timeSpan.classList.add('time')
                
                let time=info.time
                let date=new Date(time)

                timeSpan.textContent=printDate(date)
                para.appendChild(timeSpan)
                div.appendChild(para)
                chatContainer.scrollTop=chatContainer.scrollHeight
              
            })
            
            //New Message Printed
})
}
        }else{
            frndUL.innerHTML='No friend found with this name,Please try correct name or Search by Email'
            console.log('No match')
        }
    }
})



inviteButton.addEventListener('click',async()=>{
    
    try{
        let data={
            title:'CHATAPP',
            text:`${user.username} has invited you to CHATHERE`,
            url:'https://realtimechatt.herokuapp.com/'
        }
        

        await navigator.share(data)
        console.log('shared successfully')
    }catch(err){
        console.log(err)
    }
})



    
    
    