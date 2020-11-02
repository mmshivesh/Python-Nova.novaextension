
var langserver = null;

exports.activate = function() {
    // Do work when the extension is activated
    langserver = new PythonLanguageServer();
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
    if (langserver) {
        langserver.deactivate();
        langserver = null;
    }
}

// Show a notification with the given title and body when in dev mode.
function showNotification(title, body) {
    if (nova.inDevMode()) {
        let request = new NotificationRequest("python-nova-message");
        
        request.title = nova.localize(title);
        request.body = nova.localize(body);
        nova.notifications.add(request);
    }
}

// Parse JSON from a string and return an JSON object.
function parseJSON(string) {
    if (string == undefined) {
        return null
    }
    return JSON.parse(String(string).trim().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"'));
}

// Parse space or comma separated strings into a list
function parseSpaceSeparated(string) {
    if (string == "" || string == null)  {
        return []
    } else {
        return String(string).replace(/(^\s*,)|(,\s*$)/g, '').trim().split(/[\s,]+/);
    }
}

// Convenience function to parse preferences and optionally return a default value.
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

class PythonLanguageServer {
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
            path: path
        };
        
        // Enable logging.
        if (getPreference("pyls.enableLogging", false)) {
            serverOptions["args"] = ['-vv', '--log-file', getPreference('pyls.logPath', '/tmp/pyls.log')]
        }
        
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
                                "environment": (function(){
                                    if (getPreference('pyls.plugins.jedi.workspace.environment') == undefined) {
                                        console.log("Workspace Jedi environment undefined. Using global value");
                                        return getPreference('pyls.plugins.jedi.environment');
                                    } else {
                                        console.log("Workspace Jedi environment overriden. Using workspace value");
                                        return getPreference('pyls.plugins.jedi.workspace.environment');
                                    }
                                }()) // Override the current jedi environment if a workspace specific environment is defined.
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
            // Add the client to the subscriptions to be cleaned up
            console.log("Added Language Client to subscriptions.");
            nova.subscriptions.add(client);
            this.languageClient = client;
        }
        catch (err) {
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

