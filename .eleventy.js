const { DateTime } = require("luxon");
const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("images");

  // Gallery shortcode: reads images from static/images/posts/<slug>/
  // and generates thumbnails + full-size versions for a GLightbox gallery.
  eleventyConfig.addAsyncShortcode("gallery", async function() {
    const stem = path.basename(this.page.inputPath, path.extname(this.page.inputPath));
    const dir = path.join("static", "images", "posts", stem);
    if (!fs.existsSync(dir)) return "";

    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    const files = fs.readdirSync(dir)
      .filter(f => allowed.includes(path.extname(f).toLowerCase()))
      .sort();
    if (!files.length) return "";

    const Image = (await import("@11ty/eleventy-img")).default;
    const items = [];

    for (const file of files) {
      const src = path.join(dir, file);
      const stats = await Image(src, {
        widths: [400, 1200],
        formats: ["webp"],
        outputDir: path.join("docs", "static", "images", "posts", stem),
        urlPath: `/static/images/posts/${stem}/`,
        filenameFormat: function(id, src, width, format) {
          const name = path.basename(src, path.extname(src));
          return `${name}-${width}w.${format}`;
        }
      });

      const thumb = stats.webp[0]; // 400w
      const full = stats.webp[stats.webp.length - 1]; // 1200w
      items.push(
        `<a class="glightbox" href="${full.url}" data-gallery="post">` +
        `<img src="${thumb.url}" width="${thumb.width}" height="${thumb.height}" alt="" loading="lazy">` +
        `</a>`
      );
    }

    return `<div class="post-gallery">${items.join("\n")}</div>`;
  });

  function byCategory(collectionApi, category) {
    return collectionApi.getFilteredByGlob("posts/*.md")
      .filter(function(post) {
        return post.data.category === category;
      })
      .sort(function(a, b) {
        return b.date - a.date;
      });
  }

  // Combined feed for the main page: only garage + fabrication posts.
  eleventyConfig.addCollection("categorized", function(collectionApi) {
    return byCategory(collectionApi, "garage")
      .concat(byCategory(collectionApi, "fabrication"))
      .sort(function(a, b) {
        return b.date - a.date;
      });
  });

  eleventyConfig.addCollection("garage", function(collectionApi) {
    return byCategory(collectionApi, "garage");
  });

  eleventyConfig.addCollection("fabrication", function(collectionApi) {
    return byCategory(collectionApi, "fabrication");
  });

  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "yyyy-LL-dd");
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter("slugify", (str) => {
    return String(str || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "docs"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};