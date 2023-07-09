// common.js

const year = document.querySelector('.year')
year ? year.innerHTML = new Date().getFullYear() : console.log('Error! Selector ".year" not found!')

console.log('process is running ...')
