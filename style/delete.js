$(document).ready(function(){
    $('#delete').on('click',function(e){
        var prompt=confirm('Are you sure ??')
        if(prompt){
            $target=$(e.target)
         const id =$target.attr('data-id')

        $.ajax({
            type:'delete',
            url:'account/delete/'+id,
            success:function(response){
                window.location.href='/Login'
            },
            error:function(err){
                console.log(err)
            }
        })
        }
    })
})






let shareButton=document.getElementById('share')


shareButton.addEventListener('click',async()=>{
        
        
    try{
        let data={
            title:'CHATAPP',
            text:`INSTANT CHAT MESSAGES`,
            url:'https://realtimechatt.herokuapp.com/'
        }
        await navigator.share(data)
        console.log('shared successfully')
    }catch(err){
        console.log(err)
    }
})

