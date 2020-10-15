
var langserver = null;

exports.activate = function() {
    // Do work when the extension is activated
    langserver = new ExampleLanguageServer();
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
    if (langserver) {
        langserver.deactivate();
        langserver = null;
    }
}

function parseSpaceSeparated(string) {
    if (string == "" || string == null)  {
        return []
    } else {
        return string.split(/[\s,]+/);
    }
}

function getPreference(string, def) {
    var pref = nova.config.get(string)
    
    if (pref == null) {
        console.log(`${string}: ${pref} is null. Returning ${def}`)
        return def
    } else {
        console.log(`${string}: ${pref}`)
        return pref
    }
}

class ExampleLanguageServer {
    constructor() {
        // Observe the configuration setting for the server's location, and restart the server on change
        nova.config.observe('pyls.executable', function() {
            this.start(getPreference('pyls.executable', '/usr/local/bin/pyls'));
        }, this);
    }
    
    deactivate() {
        this.stop();
    }
    
    start(path) {
        if (this.languageClient) {
            this.languageClient.stop();
            nova.subscriptions.remove(this.languageClient);
        }
        
        // Create the client
        var serverOptions = {
            path: path,
            args: ['-vv', '--log-file', getPreference('pyls.logPath', '/tmp/pyls.log')]
        };
        var clientOptions = {
            // The set of document syntaxes for which the server is valid
            syntaxes: ['python'],
        };
        var client = new LanguageClient('PyLS', 'Python Language Server', serverOptions, clientOptions);
        
        try {
            // Start the client
            client.start();
            
            client.sendNotification("workspace/didChangeConfiguration", {
                settings: {
                    "pyls": {
                        "env": {},
                        "configurationSources": [
                            getPreference('pyls.configurationSources')
                        ],
                        "plugins": {
                            "jedi": {
                                "enabled": getPreference('pyls.plugins.jedi.enabled'),
                                "extra_paths": [],
                            },
                            "jedi_completion": {
                                "enabled": getPreference('pyls.plugins.jedi_completion.enabled'),
                                "fuzzy": true,  // Enable fuzzy when requesting autocomplete
                                "include_params": true
                            },
                            "jedi_definition": {
                                "enabled": getPreference('pyls.plugins.jedi_definition.enabled')
                            },
                            "jedi_hover": {
                                "enabled": getPreference('pyls.plugins.jedi_hover.enabled')
                            },
                            "jedi_references": {
                                "enabled": getPreference('pyls.plugins.jedi_references.enabled')
                            },
                            "jedi_signature_help": {
                                "enabled": getPreference('pyls.plugins.jedi_signature_help.enabled')
                            },
                            "jedi_symbols": {
                                "enabled": getPreference('pyls.plugins.jedi_symbols.enabled')
                            },
                            "preload": {
                                "enabled": getPreference('pyls.plugins.preload.enabled')
                            },
                            "rope_completion": {
                                "enabled": getPreference('pyls.plugins.rope_completion.enabled')
                            },
                            "pydocstyle": {
                                "enabled": getPreference('pyls.plugins.pydocstyle.enabled')
                            },
                            "pyflakes": {
                                "enabled": getPreference('pyls.plugins.pyflakes.enabled')
                            },
                            "pylint": {
                                "enabled": getPreference('pyls.plugins.pylint.enabled')
                            },
                            "yapf": {
                                "enabled": getPreference('pyls.plugins.yapf.enabled')
                            },
                            "mccabe": {
                                "enabled": getPreference('pyls.plugins.mccabe.enabled')
                            },
                            "pycodestyle": {
                                "enabled": getPreference('pyls.plugins.pycodestyle.enabled'),
                                "exclude": [  // Exclude files or directories which match these patterns
                                ],
                                "ignore": [  // Ignore errors and warnings
                                    "E501",  // Line too long (82 &gt; 79 characters)
                                    "W293",
                                    "W292",
                                    "W291"
                                ],
                                // "maxLineLength": 80,  // Set maximum allowed line length
                            },
                            "pydocstyle": {
                                "enabled": getPreference('pyls.plugins.pydocstyle.enabled')
                            },
                            "pylint": {
                                "enabled": getPreference('pyls.plugins.pylint.enabled')
                            },
                            // pyls' 3rd Party Plugins, Mypy type checking for Python 3, Must be installed via pip before enabling
                            "pyls_mypy": {
                                "enabled": false,
                                "live_mode": true
                            }
                        }
                    }
                  }
            });
            // console.log(nova.extension.path);
            // Add the client to the subscriptions to be cleaned up
            nova.subscriptions.add(client);
            this.languageClient = client;
        }
        catch (err) {
            // If the .start() method throws, it's likely because the path to the language server is invalid
            
            if (nova.inDevMode()) {
                console.error(err);
            }
        }
    }
    
    stop() {
        if (this.languageClient) {
            this.languageClient.stop();
            nova.subscriptions.remove(this.languageClient);
            this.languageClient = null;
        }
    }
}

