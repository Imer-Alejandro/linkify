import * as XLSX from 'xlsx'

export function exportToExcel(data, filename = 'enlaces.xlsx') {
  const exportData = data.map(e => ({
    nombre: e.nombre || '',
    enlace_url: e.enlace_url || '',
    descripcion: e.descripcion || '',
    categoria: e.categoria || '',
    origen: e.origen || '',
    tags: (e.tags || []).join(', '),
    favorito: e.favorito ? 'Si' : 'No'
  }))
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Enlaces')
  XLSX.writeFile(wb, filename)
}

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' })

        const errors = []
        const valid = json.map((row, i) => {
          const rowNum = i + 2
          if (!row.nombre || !row.enlace_url || !row.categoria) {
            errors.push(`Fila ${rowNum}: faltan campos obligatorios (nombre, enlace_url, categoria)`)
          }
          return {
            nombre: String(row.nombre || '').trim(),
            enlace_url: String(row.enlace_url || '').trim(),
            descripcion: String(row.descripcion || '').trim(),
            categoria: String(row.categoria || '').trim(),
            tags: row.tags ? String(row.tags).split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []
          }
        })

        resolve({ data: valid, errors })
      } catch (err) {
        reject(new Error('Error al leer el archivo Excel: ' + err.message))
      }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsArrayBuffer(file)
  })
}

export function downloadTemplate() {
  const template = [{
    nombre: 'Ejemplo',
    enlace_url: 'https://ejemplo.com',
    descripcion: 'Descripción opcional',
    categoria: 'General',
    tags: 'tag1, tag2'
  }]
  exportToExcel(template, 'plantilla_enlaces.xlsx')
}
