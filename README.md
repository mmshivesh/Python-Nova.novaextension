# Python for Nova
<p align="center">
    <img src="https://raw.githubusercontent.com/mmshivesh/PyLS-Nova.novaextension/master/extension.png" height="128" width="128">
</p>

![](https://img.shields.io/badge/dynamic/json?color=brightgreen&label=Latest%20Version&query=%24.version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fmmshivesh%2FPython-Nova.novaextension%2Fmaster%2Fextension.json)

Full featured Python Language Server Plugin (implements [PyLS](https://github.com/palantir/python-language-server)) for Nova, supports Jedi Autocomplete, PyFlakes, PyLint, YAPF, Rope, McCabe, PyDoc and CodeStyles.

Also supports all the Python Language Server plugins → `mypy`, `isort` and `black`

## Working Features

- [x] Auto-completion (including snippet fills-- Turn on `Include Function and Class Parameters`, Fixed in Nova 2.0)
- [x] Follow imports (Fixed in Nova 2.0)
- [x] Full Function hover tooltips with syntax highlighting
- [x] Module and function docstrings
- [x] PyDocStyle and PyCodeStyle flags
- [x] McCabe Cyclomatic Complexity

## Known Issues

- [ ] Slow auto completion
- [ ] Plugin reload required for changes to apply (probably related to `workspace/didChangeConfiguration`)
- [ ] Last line auto complete broken (Line number reporting is off)

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

## Contributing

Feel free to open PRs and Issues
