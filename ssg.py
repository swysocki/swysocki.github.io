"""Minimal Python SSG

Does just enough to generate a static website
- Generate HTML from a folder of Markdown files
- Insert the files into a template so they can be found
"""
import glob
import os
import pathlib
from markdown_it import MarkdownIt
from mdit_py_plugins.front_matter import front_matter_plugin


POST_EXTENSION = ".html"


class BlogPost:
    html_out_dir = "posts"

    def __init__(self, markdown_post: str):
        self.md_path = pathlib.Path(markdown_post)
        self.html_path = os.path.abspath(self.html_out_dir)
        self.filename = pathlib.Path(self.html_path, self.md_path.stem).with_suffix(
            ".html"
        )

    def convert(self):
        md = (
            MarkdownIt("commonmark", {"breaks": True, "html": True})
            .use(front_matter_plugin)
            .enable("table")
        )
        

def convert_posts(input_dir: str, output_dir: str) -> None:
    posts_path = os.path.abspath(input_dir)
    md_files = [file for file in glob.glob(os.path.join(posts_path, "*.md"))]

    md = (
        MarkdownIt("commonmark", {"breaks": True, "html": True})
        .use(front_matter_plugin)
        .enable("table")
    )

    for file in md_files:
        md_post = pathlib.Path(file)
        html_text = md.render(md_post.read_text())

        html_path = pathlib.Path(
            os.path.join(os.path.abspath(output_dir), md_post.stem)
        ).with_suffix(POST_EXTENSION)

        html_path.write_text(html_text)


def create_index(post_links: List) -> str:
    """Create the index.html file

    The index is a list of links to our posts_out pages
    """


if __name__ == "__main__":
    convert_posts("_posts", "posts_out")
