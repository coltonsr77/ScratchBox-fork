import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { full as emoji } from "markdown-it-emoji";

const md = new MarkdownIt({
  html: false,
  linkify: true,
}).use(emoji);

md.renderer.rules.html_block = () => "";
md.renderer.rules.html_inline = () => "";

const originalRender = md.render;
md.render = (markdown, env) =>
  sanitizeHtml(originalRender.call(md, markdown, env), {
    allowedTags: ["em", "strong", "del", "a"],
    allowedAttributes: { "a": ["href", "target"] },
    transformTags: {
      "a": (tagName, attribs) => {
        if (attribs.href && attribs.href.startsWith("http")) {
          attribs.target = "_blank";
          attribs.rel = "noopener noreferrer";
        }
        return { tagName, attribs };
      },
    },
  });

export default md;
