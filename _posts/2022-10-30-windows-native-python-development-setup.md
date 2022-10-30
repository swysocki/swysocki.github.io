______________________________________________________________________

layout: post title: Windows Native Python Development Setup tags:

- python
- development
- windows

______________________________________________________________________

I recently set out to test my
[Python GPT imaging application](https://github.com/swysocki/gpt-image) on Windows. I have a laptop
running Windows 11, fresh as fallen snow, and want to get it set up to test and develop Python on
Windows. Sure, I could have opted for WSL and I am _very_ tempted to do that because I have
[Ansible automation](https://github.com/swysocki/dotfiles/tree/master/ansible) that would set up the
entire environment for me. But that would just be testing on Linux, I want to use the Windows OS
itself!

This post is bound to be lengthy, so I am going to add links to each section as I write it. Feel
free to skip to the section that interests you.

- [Package Management](#package-management)
- [Git Client Installation](#git-client-installation)
- [Python Installation](#python-installation)

## Package Management

I'm admittedly more comfortable with Homebrew, Apt, and Yum for installing development tools. I
don't have a lot of experience with what tool to use for Windows but I know I *want* a command line
tool so I can codify and reproduce my setup. I only need to install a handful of packages, but I
want their installation to be scriptable and thus it would be convenient to use a package manager.
Windows has some options in this space, which is great. Here's a quick list of the ones that stand
out.

- [WinGet](https://github.com/microsoft/winget-cli): Built into Windows 11. Has multiple sources
  including the Windows Store.
- [Scoop](https://scoop.sh): Third party. Has a mountain of packages and minimizes the `PATH`
  environment variable entries.
- [Chocolatey](http://chocoloatey.org): Third party, extensive package list, also seems to have an
  enterprise focus.

I really want to use WinGet because it is built into the OS already. The only issue I have is that
its package selection isn't as thorough as Scoop or Chocolatey. It also uses the Windows Store as a
source for some packages, which isn't exactly what I had in mind. But I'm going to give it a go
anyway! My needs are really simple, I just need a small set of packages to develop and run my Python
application.

## Git Client Installation

First stop, install a Git client. I'll admit, there are many. I frankly have no need for a GUI
client or anything beyond the traditional Git CLI. This is challenging because
[Git For Windows](https://gitforwindows.org) comes with Git Bash, Git GUI and Shell Integration
(right-click in Windows Explorer modal). What I _want_ is
[MinGit](https://devblogs.microsoft.com/devops/whats-new-in-git-for-windows-2-10/#mingit-git-for-windows-applications)
because it strips away all the things I don't need. However; WinGet does not contain the MinGit
package so we are stuck with it or crafting an alternate installation mechanism. So the full
Git-for-Windows it shall be.

```
winget install -e --id Git.Git
```

Restart Powershell after the installation completes and you will have `git` command available.
Running `$env:Path` showed me that `C:\Program Files\Git\cmd` had been inserted in my Path.

## Python Installation

This is a bit clumsy but also quite interesting. If you type `python` or `python3` in Powershell, it
doesn't run Python. It opens the Microsoft Store with the dialog to the Python installation page.
This is a bit strange, but I understand how this can be helpful for newcomers.\
Luckily the Store's
Description field in the store gives us a clue about what is happening:

```
==========
Expected your existing copy of Python to run? Either update your PATH to raise its priority, 
or open "Manage App Execution Aliases" from Start to disable the shortcuts.
==========
```

Windows uses
[AppExecutionAlias](https://learn.microsoft.com/en-us/windows/apps/desktop/modernize/desktop-to-uwp-extensions)
to direct the `python` command to the Microsoft store. The instructions above give us two options to
disable the behavior, modify the `$env:Path` or disable the aliases in the Setting UI. I that
installing Python will place its Path variable at a higher priority than the alias.

### Python Installation (for real this time)

My Python application uses Python 3.8 as its minimal version so that is what I will set out to
install. There are a couple of options with WinGet for this. You can either install from the
`winget` source or the `msstore` source. It would be convenient to install from the Microsoft Store
because you would receive updates through the store's mechanism and it would turn the aforementioned
aliases into something useful. I have seen some Stackoverflow questions about quirks with Python
installed from the Microsoft Store, but I will have to see for myself.

```
winget install -d --name "Python 3.8"
```

Excellent! Now when I type `python` or `python3` I receive the Python interactive interpreter.

### Test Driving Python

I typically work from a Python Virtual Environment so my first stop with our new Python is to create
a virtual environment, activate it and install some packages.

```
PS C:\Users\scott> python3 -m venv test-venv
PS C:\Users\scott> .\test-venv\Scripts\Activate.ps1
.\test-venv\Scripts\Activate.ps1 : File C:\Users\scott\test-venv\Scripts\Activate.ps1 cannot be loaded because running
scripts is disabled on this system. For more information, see about_Execution_Policies at
https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:1
+ .\test-venv\Scripts\Activate.ps1
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess

```

If you receive this error, it's because PowerShell's Execution Policy is set too strictly. It is set
to `Restricted` out of the box, so executing the activation script will be blocked. To fix this,
open PowerShell as an Administrator (hold the `ctrl` key while clicking on PowerShell) and execute
the following command:

```
Set-ExecutionPolicy RemoteSigned
```

Now you can activate your virtual environment and install packages.

### Additional Python Packages

I use [pipx](https://github.com/pypa/pipx) to install Python CLI applications that I want available
system-wide. For example, I want the [yamllint](https://github.com/adrienverge/yamllint) utility
available globally on the CLI. So now I am setting up Pipx to install those types of packages.

```
PS C:\Users\scott> python3 -m pip install --no-cache-dir pipx
Collecting pipx
  Downloading pipx-1.1.0-py3-none-any.whl (55 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 55.4/55.4 kB 960.8 kB/s eta 0:00:00
Requirement already satisfied: packaging>=20.0 in c:\users\scott\appdata\local\packages\pythonsoftwarefoundation.python.3.8_qbz5n2kfra8p0\localcache\local-packages\python38\site-packages (from pipx) (21.3)
Collecting argcomplete>=1.9.4
  Downloading argcomplete-2.0.0-py2.py3-none-any.whl (37 kB)
Collecting colorama>=0.4.4
  Downloading colorama-0.4.6-py2.py3-none-any.whl (25 kB)
Requirement already satisfied: userpath>=1.6.0 in c:\users\scott\appdata\local\packages\pythonsoftwarefoundation.python.3.8_qbz5n2kfra8p0\localcache\local-packages\python38\site-packages (from pipx) (1.8.0)
Requirement already satisfied: pyparsing!=3.0.5,>=2.0.2 in c:\users\scott\appdata\local\packages\pythonsoftwarefoundation.python.3.8_qbz5n2kfra8p0\localcache\local-packages\python38\site-packages (from packaging>=20.0->pipx) (3.0.9)
Collecting click
  Downloading click-8.1.3-py3-none-any.whl (96 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 96.6/96.6 kB 918.6 kB/s eta 0:00:00
Installing collected packages: colorama, argcomplete, click, pipx
  WARNING: The script pipx.exe is installed in 'C:\Users\scott\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.8_qbz5n2kfra8p0\LocalCache\local-packages\Python38\Scripts' which is not on PATH.
  Consider adding this directory to PATH or, if you prefer to suppress this warning, use --no-warn-script-location.
Successfully installed argcomplete-2.0.0 click-8.1.3 colorama-0.4.6 pipx-1.1.0
```

The pipx utility is kind enough to warn us that its executable is not in our system's path, but it
also includes a command that will fix it.

```
PS C:\Users\scott> python3 -m pipx ensurepath
Success! Added C:\Users\scott\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.8_qbz5n2kfra8p0\LocalCache\loca
    l-packages\Python38\Scripts to the PATH environment variable.
Success! Added C:\Users\scott\.local\bin to the PATH environment variable.

Consider adding shell completions for pipx. Run 'pipx completions' for instructions.

You will need to open a new terminal or re-login for the PATH changes to take effect.

Otherwise pipx is ready to go! ✨ 🌟 ✨
```

> I have grown tired of closing my terminal to get my updated path so I looked up a command that
> will reload it with the new variables:

```
PS C:\Users\scott> $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Now pipx is in our path and we can install all the Python CLI apps we regularly use!

### Multiple Python Versions (living dangerously)

I also want to test my application in Python 3.10 and I don't want to uninstall my base version of
3.8. I was concerned that using WinGet to install an updated version of Python would render all of
my previous work useless. For the sake of science, I did it anyway.

```
winget install -e --name "Python 3.10"
```

Now my current Python remains the default and the new Python can be accessed explicitly. This is the
behavior I wanted but honestly didn't expect.

```
PS C:\Users\scott> python --version
Python 3.8.10
PS C:\Users\scott> python3.10 --version
Python 3.10.8
```

### Summary

Bottom line: pick an install mechanism and stick with it. If you use the Microsoft Store to install
Python, stick with that. The same goes for the official Python installer package. Mixing them breaks
the paths that get set up and can be quite a headache.
