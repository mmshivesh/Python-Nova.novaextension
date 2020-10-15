



# Python for Nova
<p align="center">
    <img src="https://raw.githubusercontent.com/mmshivesh/PyLS-Nova.novaextension/master/extension.png" height="128" width="128">
</p>

![](https://img.shields.io/badge/dynamic/json?color=brightgreen&label=Latest%20Version&query=%24.version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fmmshivesh%2FPython-Nova.novaextension%2Fmaster%2Fextension.json)

Full featured Python Language Server Plugin (implements [PyLS](https://github.com/palantir/python-language-server)) for Nova, supports Jedi Autocomplete, PyFlakes, PyLint, YAPF, Rope, McCabe, PyDoc and CodeStyles.

Also supports all the Python Language Server plugins → `mypy`, `isort` and `black`

## Known Bugs

- Snippet fills are broken because of a Nova [Bug](https://github.com/mmshivesh/Python-Nova.novaextension/issues/1) in v1.2:

***Workaround***:
    Disable 'Include Function and Class Parameters' under Jedi Completion. This will disable parameter autofilling and will make using the extension more bearable.

- Autocomplete broken while typing on last line because of a bug in Nova that reports the line numbers wrong (offset by 1):

***Workaround***:
Leave a blank line at the end. Sorry for this :/ Hopefully this is fixed with Nova v1.3.

## Installation

1. Install dependencies using:

```bash
pip3 install 'python-language-server[all]'
```

2. Enable required modules from settings.

3. (Optional) Install Python Language Server plugins and enable them from settings:

- `mypy` plugin: `pip3 install pyls-mypy`

- `isort` plugin: `pip3 install pyls-isort`

- `black` plugin: `pip3 install pyls-black`


## Features

- Real time Linting (Pyflakes):

![](https://raw.githubusercontent.com/mmshivesh/Python-Nova.novaextension/master/.github/images/realtimeLinting.png)

- Hover actions on Functions and Modules:

![](https://raw.githubusercontent.com/mmshivesh/Python-Nova.novaextension/master/.github/images/hover.png)

- PyCodeStyle and PyDocStyle hints:

![](https://raw.githubusercontent.com/mmshivesh/Python-Nova.novaextension/master/.github/images/doccode.gif)

- Autocomplete using Jedi:

![](https://raw.githubusercontent.com/mmshivesh/Python-Nova.novaextension/master/.github/images/autoComplete.gif)


## TODO

- Verify for `virtualenv` based setups.
- Test framework
- Localization

## Contributing

Feel free to open PRs and Issues
