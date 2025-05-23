import Converter from '#utils/converter'

class Formatter {
  static objectToMarkdown(obj: any, indentLevel = 0) {
    let markdown = ''
    const indent = '  '.repeat(indentLevel) // Mengatur level indentasi untuk sub-objek

    if (typeof obj === 'object' && !Array.isArray(obj)) {
      Object.keys(obj).forEach((key) => {
        const value = obj[key]

        if (typeof value === 'object' && value !== null) {
          markdown += `${indent}- **${Converter.capitalize(key)}**:\n`
          markdown += this.objectToMarkdown(value, indentLevel + 1) // Rekursi dengan level indentasi lebih dalam
        } else {
          markdown += `${indent}- **${Converter.capitalize(key)}**: ${value}\n`
        }
      })
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        markdown += `${indent}- **Item ${index + 1}**:\n`
        markdown += this.objectToMarkdown(item, indentLevel + 1) // Rekursi untuk setiap item dalam array
      })
    }

    return markdown
  }
}

export default Formatter
