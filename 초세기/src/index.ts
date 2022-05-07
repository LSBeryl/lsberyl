const span1 = document.querySelector('#a')
const span2 = document.querySelector('#b')
const btn = document.querySelector('button')
let num1 = 0
let num2 = 0

setInterval(() =>{
    num2++
    if(num2 == 10){
        num2 = 0
        num1++
        span1.innerHTML = String(num1)
    }
    span2.innerHTML = String(num2)
}, 100)

btn.addEventListener('click', () =>{
    const div = document.createElement('div')
    div.innerHTML = `${num1}.${num2}`
    document.querySelector('body').appendChild(div)
})