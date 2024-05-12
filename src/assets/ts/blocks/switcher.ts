// switcher.js
// скрипт работы переключателя цветовых тем

const getStoredTheme = () => localStorage.getItem('color-mode') // считать тему из локального хранилища
const setStoredTheme = (theme: string) => localStorage.setItem('color-mode', theme) // записать тему в локальное хранилище

// Получить текущую цветовую тему
const getPreferredTheme = () => {
  const storedTheme = getStoredTheme()
  if (storedTheme) {
    return storedTheme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Установить цветовую тему в атрибуте тега 'html'
const setTheme = (theme: string): void => {
  if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  } else if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-bs-theme', 'light')
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }
}

// Отобразить переключение на пульте управления цветовыми темами
const showActiveTheme = (theme: string, focus = false) => {
  const themeSwitcher: HTMLButtonElement | null = document.querySelector('#switcher-desktop')
  if (!themeSwitcher) {
    console.log(`The node "#switcher-desktop" is missing! `)
    return
  }

  const btnToActive: HTMLButtonElement | null = document.querySelector(`[data-theme-value="${theme}"]`)
  if (!btnToActive) {
    console.log(`The node "[data-theme-value="${theme}"]" is missing! `)
    return
  }

  const svgOfActive = btnToActive.querySelector('svg use')
  if (!svgOfActive) {
    console.log(`The node "svg use" is missing! `)
    return
  }
  const svgOfActiveBtn = svgOfActive.getAttribute('href')
  if (!svgOfActiveBtn) {
    console.log(`The node "svg use" is missing! `)
    return
  }

  const activeThemeIcon = document.querySelector('.theme-icon-active use')
  if (!activeThemeIcon) {
    console.log(`The node ".theme-icon-active use" is missing! `)
    return
  }

  document.querySelectorAll('[data-theme-value]').forEach((element) => {
    element.classList.remove('active')
    element.setAttribute('aria-pressed', 'false')
  })

  btnToActive.classList.add('active')
  btnToActive.setAttribute('aria-pressed', 'true')

  activeThemeIcon.setAttribute('href', svgOfActiveBtn)

  const themeSwitcherLabel = `Color mode is ${btnToActive.dataset.themeValue}`
  themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

  if (focus) {
    themeSwitcher.focus()
  }
}

// установка обработчика смены тем в системе
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const storedTheme = getStoredTheme()
  if (storedTheme !== 'light' && storedTheme !== 'dark') {
    setTheme(getPreferredTheme())
  }
})

// установка темы после полной загрузки страницы
window.addEventListener('DOMContentLoaded', () => {
  setTheme(getPreferredTheme())
  showActiveTheme(getPreferredTheme())

  document.querySelectorAll('[data-theme-value]').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      let theme = toggle.getAttribute('data-theme-value')
      if (!theme) theme = 'auto'
      setStoredTheme(theme)
      setTheme(theme)
      showActiveTheme(theme, true)
    })
  })
})
