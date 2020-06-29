//Getting the html elements

let chatButton=document.getElementById('chatButton')
let friendButton=document.getElementById('friendButton')
let friendSection=document.getElementById('friendDiv')
let chatSection=document.getElementById('chatDiv')
let shareButton=document.getElementById('share')
let inivte=document.getElementById('invite')
let chatContainer=document.getElementById('chatContainer')


//Enabling share the site
let data={
    title:'CHATAPP',
    text:'Instant Text Messages',
    url:'https://realtimechatt.herokuapp.com/'
}

shareButton.addEventListener('click',async()=>{
    try{
        await navigator.share(data)
        console.log('shared successfully')
    }catch(err){
        console.log(err)
    }
})

let inviteData={
    
    title:'CHATAPP',
    text:`${user.username} has invited you to CHATHERE`,
    url:'https://realtimechatt.herokuapp.com/'
}

inivte.addEventListener('click',async()=>{
    try{
        await navigator.share(inviteData)
    }catch(err){
        console.log(err)
 }
})



//Clicking the chat button/link
chatButton.addEventListener('click',(e)=>{
    e.preventDefault()
    friendSection.style.display='none'
    friendButton.style.fontSize='20px'
    friendButton.style.color='rgb(114, 112, 97)'
    chatButton.style.fontSize='22px'
    chatButton.style.color='blue'



    chatSection.style.display='block'
})



//Clicking the Friend button/link
friendButton.addEventListener('click',(e)=>{
    e.preventDefault()
    chatButton.style.fontSize='20px'
    chatButton.style.color='rgb(114, 112, 97)'
    friendButton.style.fontSize='22px'
    friendButton.style.color='blue'
    friendSection.style.display='block'

    
let frndLI=document.getElementsByClassName('frndli')
for(let i=0;i<frndLI.length;i++){

    //Clicking any username
    frndLI[i].addEventListener('click',()=>{
    friendSection.style.display='none'
    chatButton.style.display='none'
    friendButton.style.display='none'
    friendSection.style.display='none'

    let name=frndLI[i].textContent

    let username=document.getElementById('username')
    let type=document.getElementById('type')

    username.textContent +=name
    
    username.style.display='block'
    type.style.display='block'
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

})


