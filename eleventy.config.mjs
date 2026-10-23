// import path from 'path'
import markdownIt from "markdown-it";
import markdownItGitHubHeadings from "markdown-it-github-headings";

import fs from 'fs';
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import Nunjucks from "nunjucks";

import { createHash } from 'node:crypto';

function cacheBusterUrl(dir, rootPath, file) {
    const rewriteSource = {
            'css/main.css': 'css/main.raw.css'
        }
      , sourceFile = Object.hasOwn(rewriteSource, file)
                ? rewriteSource[file]
                : file
      ;
    const key = `file:${sourceFile}`;
    if(!Object.hasOwn(this, key)) {
        const data = fs.readFileSync(`${dir}/${sourceFile}`);
        this[key] = createHash('sha256').update(data).digest('hex');
    }
    return `${rootPath}${file}?cacheBuster=${this[key]}`;
}

function newsDate(page) {
    const [y, m, d] =page.fileSlug.split('-', 3).map(i=>parseFloat(i))
      , date = new Date(y, m-1, d)
      ;
    return `<time datetime="${date.toISOString()}">${date.toDateString()}</time>`;
}

function renderNews(items, limit=Infinity) {
    const result = ['<ol class="news">']
      , posts = (items || []).toSorted((a,b)=>a.page.fileSlug.localeCompare(
                    b.page.fileSlug, 'en', { sensitivity: 'base' }))
                .reverse()
                .slice(0, limit)
      ;
    for(const post of posts) {
    result.push(`<li><article>
        <span class="date"></span>
        ${newsDate(post.page)}
        <h1><a href="${post.url}">${post.data.title}</a></h1>
        <p class="lead">${post.data.lead ? post.data.lead : ''} <a href="${post.url}">(…\xa0full\xa0announcement)</a></p>
        </article></li>\n`);
    }
    result.push('</ol>');
    return result.join('');
}

function wrapShortcode(fn) {
    return (...args)=> {
        try {
            return fn(...args);
        }
        catch(e) {
            // eleventy error reporting is bad when called as a shortcode...
            console.error(e);
            throw e;
        }
    }
};

export default function (eleventyConfig) {
    // Output directory: _site
    const dir = {
            input: 'page'
        }
      , rootDir = '/'
      , rootPath = `${rootDir}`
      ;


    const nunjucksEnvironment = new Nunjucks.Environment(
        new Nunjucks.FileSystemLoader(`${dir.input}/_includes`)
        );
    eleventyConfig.setLibrary('njk', nunjucksEnvironment);
    eleventyConfig.setIncludesDirectory(`_includes`);
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

    // use this as the default layout.
    eleventyConfig.addGlobalData("layout", "typeroof");
    // This requires dir.input as that setting is not passed to addPassthroughCopy.
    eleventyConfig.addPassthroughCopy(`${dir.input}${rootPath}css`);
    eleventyConfig.addPassthroughCopy(`${dir.input}${rootPath}js`);
    eleventyConfig.addPassthroughCopy(`${dir.input}${rootPath}img`);

    let mdOptions = {
        html: true,
        // breaks: true,
        linkify: true,
        typographer: true,
    };
    const md = markdownIt(mdOptions);
    const headingsOptions = {
        // NOTE: I support the cause of adding prefixes to heading ids,
        // as described in the docs of markdown-it-github-headings, but
        // the hrefs created here do not contain the prefixes. The suggestion
        // is to handle this by listening to hash changes and intercept
        // these, I'm not interested in that approach, I could live with
        // links to e.g. #section-introduction but I also think the risk
        // is in this case not really high, so I just don't use prefixes.
          prefixHeadingIds: false
        //, prefix: 'section-'
        , linkIcon: '#'
        , className: 'heading_anchor'
    };
    md.use(markdownItGitHubHeadings, headingsOptions)
    eleventyConfig.setLibrary("md", md);


    eleventyConfig.addFilter('Date', (str)=>{
        return new Date(str);
    })

    // This replicates (part of) the behavior of markdownItGitHubHeadings
    // to be used as a shortcode.
    eleventyConfig.addShortcode('heading', (tag, text, achor=null)=>{
        const {prefixHeadingIds, prefix, linkIcon, className} = headingsOptions
          , rawId = achor === null ? encodeURIComponent(text) : achor
          , id = prefixHeadingIds
                ? `${prefix}${rawId}`
                : rawId
                ;
        return `<${tag}><a
            id="${id}"
            href="#${id}"
            class="${className}"
            aria-hidden="true"
            >${linkIcon}</a>${text}</${tag}>`;
    });


    eleventyConfig.addGlobalData('eleventyComputed.rootPath', ()=>{
        // not sure if computation is required in this case
        //return data=>data.page.url
        //        .split('/')
        //        .filter(x=>x)
        //        .map(()=>'../')
        //        .join('');
        //}
        return rootPath;
    });

    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addShortcode('newsDate', wrapShortcode(newsDate));
    eleventyConfig.addShortcode('news', wrapShortcode(renderNews));


    // I use this for the css and js files. Especially IPhone seems
    // to have trouble to update these when they have changed. Looks
    // like a server configuration thing, but I can't do much in that
    // regard from here. I'd prefer to remove this again at some point.
    // This version hashes the file contents, so the cache will only
    // refresh when the file content changes.
    eleventyConfig.addShortcode('cacheBusterUrl', wrapShortcode(
        cacheBusterUrl.bind({}/* cache */, `${dir.input}${rootPath}`, rootPath)));


    return {
        dir
      , markdownTemplateEngine: 'njk'
    }
};
