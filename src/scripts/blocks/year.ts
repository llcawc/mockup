// year.js

const year: HTMLSpanElement | null = document.querySelector('.year')
year ? (year.innerHTML = new Date().getFullYear().toString()) : console.log('Error! Selector ".year" not found!')
