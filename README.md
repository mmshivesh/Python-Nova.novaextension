# Python for Nova

![](https://img.shields.io/badge/dynamic/json?color=brightgreen&label=Latest%20Version&query=%24.version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fmmshivesh%2FPyLS-Nova.novaextension%2Fmaster%2Fextension.json)

Full featured Python Language Server Plugin (implements [PyLs](https://github.com/palantir/python-language-server)) for Nova, supports Jedi Autocomplete, PyFlakes, PyLint, YAPF, Rope, McCabe, PyDoc and CodeStyles.

Also supports all the Python Language Server plugins → `mypy`, `isort` and `black`

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


## Working

- All Features that PyLS supports.
- Snippet fills are broken because of a Nova [Bug](https://github.com/mmshivesh/PyLS-Nova.novaextension/issues/1) in v1.2

## TODO

- Verify for `virtualenv` based setups.
- Test framework

## Contributing

Feel free to open PRs and Issues