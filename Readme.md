# Repo Readme

Note: This project now uses the `staffsergeant` package (installed via
the pinned GitHub release in `requirements.txt`) instead of the local
`ssg.py` script. Install dependencies with:

```
py -3 -m pip install --upgrade -r requirements.txt
```

If you want to run the command-line tool directly, add Python's Scripts
folder to your PATH (example for the current user):

```
setx PATH "%USERPROFILE%\AppData\Local\Programs\Python\Python311\Scripts;%%PATH%%"
```

Or run the tool via the module interface:

```
py -3 -m ssg
```

