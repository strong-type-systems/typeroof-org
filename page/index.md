---
eleventyNavigation:
  key: Home
  order: 1
---

# Welcome to the TypeRoof Project

<div class="directions">
    <a class="button application-shell" target="_blank"
      href="https://app.typeroof.org/shell.html">
      <span class="material-symbols-outlined">insert_text</span>
      Application Shell</a>
    <a class="button community-forum" target="_blank"
      href="https://forum.typeroof.org">
      <span class="material-symbols-outlined">diversity_1</span>
      Community Forum</a>
    <a class="button documentation" target="_blank"
      href="https://app.typeroof.org/docs">
      <span class="material-symbols-outlined">help</span>
      Documentation</a>
    <a class="button source-code" target="_blank"
      href="https://github.com/FontBureau/TypeRoof">
      <span class="material-symbols-outlined">code</span>
      Source Code</a>
    <a class="button wikipedia-demo" target="_blank"
      href="https://app.typeroof.org/app/wikipedia">
      <span class="material-symbols-outlined">two_pager</span>
      Wikipedia Demo</a>


</div>



<article>
{% heading 'h1', 'Latest News', 'latest-news' %}

{% news collections.news, 3 %}

[… all news]({{rootPath}}news)
</article>
