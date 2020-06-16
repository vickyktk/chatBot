//Getting the html elements

let chatButton=document.getElementById('chatButton')
let friendButton=document.getElementById('friendButton')
let friendSection=document.getElementById('friendDiv')
let chatSection=document.getElementById('chatDiv')
let shareButton=document.getElementById('share')


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
    chatSection.style.display='none'
    chatButton.style.fontSize='20px'
    chatButton.style.color='rgb(114, 112, 97)'
    friendButton.style.fontSize='22px'
    friendButton.style.color='blue'

    friendSection.style.display='block'

})