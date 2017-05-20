//Localisation object which strings for multi language support take it to another file later
Language = {}
Language.enum = {}
Language.enum.languages = {
  EN : 0
}
function Language() {
  this.languageStrings = {}
  this.languageStrings[this.enum.languages.EN] = {}
}
