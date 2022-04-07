interface PathBindParameters {
  [key: string]: {
    token: string
    regex?: string
  }
}

export class PathBind {

  static transform(context: any, base: string, bind: { [key: string]: any } = {}): string {
    let url = base.slice(0)
    const params = this.buildPlaceholder(base)

    for (const [name, phold] of Object.entries(params)) {
      let value = bind[name]
      const token = phold.token
      const regex = phold.regex && new RegExp('^' + phold.regex + '$')
      if (value === undefined) {
        if (name.toLowerCase() === 'userid') {
          value = context.rootState.commons['store-token'].token.userId
        } else {
          throw new Error('Not found a bind value : { name: ' + name + ' }')
        }
      }
      if (regex && !String(value).match(regex)) {
        throw new Error('Regex could not match a bind value : { regex: ' + name + ', value: ' + value + ' }')
      }
      url = url.replace(token, value)
    }

    return url

  }

  static buildPlaceholder(path: string): PathBindParameters {

    const params: PathBindParameters = {}
    let tokName: string[] = []
    let tokRegex: string[] = []
    let tokToken: string[] = []

    let marked = false
    let stickiness = 0

    const toks = path.replace(/^(http:\/\/.*?\/|https:\/\/.*?\/)/gi, '').split('')
    const toksTail = toks.length - 1
    toks.forEach((c, pos) => {
      if (!c.match(/[\x20-\x7E]/)) {
        throw new Error('Syntax error \'' + c + '\' : Invalid path specification.')
      }

      switch (stickiness) {
        case 0:
          if (c === '<') {
            throw new Error('Syntax error \'<\' : Invalid path specification.')
          }
          if (c === '>') {
            throw new Error('Syntax error \'>\' : Invalid path specification.')
          }
          if (c === ':') {
            tokToken.push(c)
            stickiness++
          }
          break
        case 1:
          if (c === '>') {
            throw new Error('Syntax error \'>\' : Invalid path specification.')
          } else if (c === ':') {
            throw new Error('Syntax error \':\' : Placeholder are duplicated registered on same dir.')
          } else if (c === '<') {
            tokToken.push(c)
            stickiness++
          } else if (c === '?') {
            stickiness--
            marked = true
          } else if (c === '&') {
            stickiness--
            marked = true
          } else if (c === '/') {
            stickiness--
            marked = true
          } else {
            tokToken.push(c)
            tokName.push(c)
          }
          break
        case 2:
          if (c === '<') {
            throw new Error('Syntax error \'<\' : Invalid path specification.')
          } else if (c === '>') {
            tokToken.push(c)
            stickiness = 0
            marked = true
          } else {
            tokToken.push(c)
            tokRegex.push(c)
          }
          break
        default:
          throw new Error('Syntax error : Invalid path specification.')
      }

      if ((marked || pos === toksTail) && tokName.length > 0) {
        params[tokName.join('')] = {
          token: tokToken.join(''),
          regex: tokRegex.length ? tokRegex.join('') : undefined
        }
        tokName = []
        tokRegex = []
        tokToken = []
        marked = false
      }
    })

    return params
  }
}
