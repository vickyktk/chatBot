
// Review.js


let ratings1=document.getElementById('val-1')
let ratings2=document.getElementById('val-2')
let ratings3=document.getElementById('val-3')
let ratings4=document.getElementById('val-4')
let ratings5=document.getElementById('val-5')

let rate=document.getElementById('rate')


ratings1.addEventListener('click',()=>{
    rate.value=1;
    ratings1.style.color='red'
})
ratings2.addEventListener('click',()=>{
    rate.value=2;
    ratings1.style.color='yellow'
    ratings2.style.color='yellow' 

})
ratings3.addEventListener('click',()=>{
    rate.value=3;
    ratings1.style.color='pink'
    ratings2.style.color='pink'
    ratings3.style.color='pink'

})
ratings4.addEventListener('click',()=>{
    rate.value=4;
    ratings1.style.color='blue'
    ratings2.style.color='blue'
    ratings3.style.color='blue'
    ratings4.style.color='blue'

})
ratings5.addEventListener('click',()=>{
    rate.value=5;
    ratings1.style.color='rgb(23, 240, 23)'
    ratings2.style.color='rgb(23, 240, 23)'
    ratings3.style.color='rgb(23, 240, 23)'
    ratings4.style.color='rgb(23, 240, 23)'
    ratings5.style.color='rgb(23, 240, 23)'

})
