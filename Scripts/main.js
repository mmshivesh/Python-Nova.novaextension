
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

function parseJSON(string) {
    if (string == undefined) {
        return null
    }
    return JSON.parse(String(string).trim().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"'));
}

function parseSpaceSeparated(string) {
    // console.log(String(string).replace(/(^\s*,)|(,\s*$)/g, '').trim().split(/[\s,]+/));
    if (string == "" || string == null)  {
        return []
    } else {
        return String(string).replace(/(^\s*,)|(,\s*$)/g, '').trim().split(/[\s,]+/);
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
                        "rope": {
                            "extensionModules": getPreference('pyls.rope.extensionModules'),
                            "ropeFolder": parseSpaceSeparated(getPreference('pyls.rope.ropeFolder'))
                        },
                        "plugins": {
                            "jedi": {
                                "enabled": getPreference('pyls.plugins.jedi.enabled'),
                                "extra_paths": parseSpaceSeparated(getPreference('pyls.plugins.jedi.extra_paths')),
                                "env_vars": parseJSON(getPreference('pyls.plugins.jedi.env_vars')),
                                "environment": getPreference('pyls.plugins.jedi.environment')
                            },
                            "jedi_completion": {
                                "enabled": getPreference('pyls.plugins.jedi_completion.enabled'),
                                "fuzzy": getPreference('pyls.plugins.jedi_completion.fuzzy'),
                                "include_params": getPreference('pyls.plugins.jedi_completion.include_params'),
                                "include_class_objects": getPreference('pyls.plugins.jedi_completion.include_class_objects')
                            },
                            "jedi_definition": {
                                "enabled": getPreference('pyls.plugins.jedi_definition.enabled'),
                                "follow_imports": getPreference('pyls.plugins.jedi_definition.follow_imports'),
                                "follow_builtin_imports": getPreference('pyls.plugins.jedi_definition.follow_builtin_imports')
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
                                "enabled": getPreference('pyls.plugins.jedi_symbols.enabled'),
                                "all_scopes": getPreference('pyls.plugins.jedi_symbols.all_scopes')
                            },
                            "mccabe": {
                                "enabled": getPreference('pyls.plugins.mccabe.enabled'),
                                "threshold": getPreference('pyls.plugins.mccabe.threshold')
                            },
                            "preload": {
                                "enabled": getPreference('pyls.plugins.preload.enabled'),
                                "modules": parseSpaceSeparated(getPreference('pyls.plugins.preload.modules'))
                            },
                            "pycodestyle": {
                                "enabled": getPreference('pyls.plugins.pycodestyle.enabled'),
                                "exclude": parseSpaceSeparated(getPreference('pyls.plugins.pycodestyle.exclude')),
                                "filename": parseSpaceSeparated(getPreference('pyls.plugins.pycodestyle.filename')),
                                "select": parseSpaceSeparated(getPreference('pyls.plugins.pycodestyle.select')),
                                "ignore": parseSpaceSeparated(getPreference('pyls.plugins.pycodestyle.ignore')),
                                "hangClosing": getPreference('pyls.plugins.pycodestyle.hangClosing'),
                                "maxLineLength": getPreference('pyls.plugins.pycodestyle.maxLineLength')
                            },
                            "pydocstyle": {
                                "enabled": getPreference('pyls.plugins.pydocstyle.enabled'),
                                "convention": parseSpaceSeparated(getPreference('pyls.plugins.pydocstyle.convention')),
                                "addIgnore": parseSpaceSeparated(getPreference('pyls.plugins.pydocstyle.addIgnore')),
                                "addSelect": parseSpaceSeparated(getPreference('pyls.plugins.pydocstyle.addSelect')),
                                "ignore": parseSpaceSeparated(getPreference('pyls.plugins.pydocstyle.ignore')),
                                "select": parseSpaceSeparated(getPreference('pyls.plugins.pydocstyle.select')),
                                "match": parseSpaceSeparated(getPreference('pyls.plugins.pydocstyle.match')),
                                "matchDir": parseSpaceSeparated(getPreference('pyls.plugins.pydocstyle.matchDir'))
                            },
                            "pylint": {
                                "enabled": getPreference('pyls.plugins.pylint.enabled'),
                                "args": parseSpaceSeparated(getPreference('pyls.plugins.pylint.args')),
                                "executable": getPreference('pyls.plugins.pylint.executable')
                                
                            },
                            "rope_completion": {
                                "enabled": getPreference('pyls.plugins.rope_completion.enabled')
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
                            "pydocstyle": {
                                "enabled": getPreference('pyls.plugins.pydocstyle.enabled')
                            },
                            
                            // Additional Plugin Preferences
                            "pyls_mypy": {
                                "enabled": getPreference('pyls.plugins.pyls_mypy.enabled'),
                                "live_mode": getPreference('pyls.plugins.pyls_mypy.live_mode')
                            },
                            "pyls_black": {
                                "enabled": getPreference('pyls.plugins.pyls_black.enabled')
                            },
                            "pyls_isort": {
                                "enabled": getPreference('pyls.plugins.pyls_isort.enabled')
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

