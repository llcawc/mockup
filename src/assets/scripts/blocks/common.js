// common.js

const year = document.querySelector('.year')
year ? year.innerHTML = new Date().getFullYear() : console.log('chek selector ".year"')
console.log('process is running ...')
