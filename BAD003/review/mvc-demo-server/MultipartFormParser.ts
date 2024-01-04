import { Request } from 'express'
import formidable, { Fields, Files, Options } from 'formidable'

export type MultipartFormData = {
  fields: Fields
  files: Files
}

export interface MultipartFormParser {
  parse(req: Request): Promise<MultipartFormData>
}

export class FormidableParser implements MultipartFormParser {
  constructor(public options: Options) {}

  parse(req: Request): Promise<MultipartFormData> {
    return new Promise<MultipartFormData>((resolve, reject) => {
      let form = new formidable.Formidable(this.options)
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })
  }
}