import postcss from 'postcss';
import postcssNesting from 'postcss-nesting';
import path from 'node:path';
import fs from 'node:fs';

// take only /page/css/main.raw.css
// transform it
// output as /css/main.css
// the next two lines seem lke bad design in eleventy to me.

export default class {
  data () {
    return {
      layout: '',
      permalink: '/css/main.css',
      eleventyExcludeFromCollections: true
    }
  }
  async render () {
    const cssRawData = fs.readFileSync(`${import.meta.dirname}/main.raw.css`)
      ,  processed = postcss([postcssNesting]).process(cssRawData, {})
      ;
    return processed.css;
  }
}
