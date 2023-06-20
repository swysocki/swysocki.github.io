"""Minimal Python SSG

Does just enough to generate a static website
- Generate HTML from a folder of Markdown files
- Insert the files into a template so they can be found
"""
import glob
import os
import pathlib

from jinja2 import Environment, FileSystemLoader
import yaml
from markdown_it import MarkdownIt
from mdit_py_plugins.front_matter import front_matter_plugin

POST_EXTENSION = ".html"


class BlogPost:
    html_out_dir = "posts"

    def __init__(self, markdown_post: str):
        self.md_path = pathlib.Path(markdown_post)
        self.html_path = pathlib.Path(self.html_out_dir, self.md_path.stem).with_suffix(
            ".html"
        )
        self.post_text = self.md_path.read_text()
        self._md = (
            MarkdownIt("commonmark", {"breaks": True, "html": True})
            .use(front_matter_plugin)
            .enable("table")
        )

    @property
    def front_matter(self):
        tokens = self._md.parse(self.post_text)
        for token in tokens:
            if token.type == "front_matter":
                fm = yaml.safe_load(token.content)
                return fm

    @property
    def html(self):
        return self._md.render(self.post_text)


def get_posts(input_dir: str):
    posts_path = os.path.abspath(input_dir)
    return [file for file in glob.glob(os.path.join(posts_path, "*.md"))]


def create_index(post_list: list[str]) -> str:
    """Create the index.html file

    The index is a list of links to our posts_out pages
    """
    index_list = []
    for page in post_list:
        pg = BlogPost(page)
        title = pg.front_matter.get("title")
        href = str(pg.html_path)
        d = {"post_title": title, "post_link": href}
        index_list.append(d)

    env = Environment(loader=FileSystemLoader('.'))
    template = env.get_template('index.html.j2')
    content = template.render(post_list=index_list)
    print(content)

if __name__ == "__main__":
    post_list = get_posts("_posts")

    pp = []
    for post in post_list:
        pp.append(post)

    create_index(pp)
