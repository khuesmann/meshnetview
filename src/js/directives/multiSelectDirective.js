export default {
  // When the bound element is inserted into the DOM...
  inserted: (el) => {
    $(el).selectpicker()

  },
  update: (el) => {
    setTimeout(() => {
      $(el).selectpicker('refresh')
    }, 0)
  },
  componentUpdated: (el) => {
    $(el).selectpicker('refresh')
  }
}