
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


class ExampleLanguageServer {
    constructor() {
        // Observe the configuration setting for the server's location, and restart the server on change
        nova.config.observe('pyls.executable', function(path) {
            this.start(path);
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
        
        // Use the default server path
        if (!path) {
            // path = nova.extension.path + '/run.sh';
            path = '/usr/local/bin/pyls';
            // console.log(path);
        }
        
        // Create the client
        var serverOptions = {
            path: path,
            args: ['-vv', '--log-file', '/tmp/pyls.log']
        };
        var clientOptions = {
            // The set of document syntaxes for which the server is valid
            syntaxes: ['python'],
        };
        var client = new LanguageClient('JediLS', 'Jedi Language Server', serverOptions, clientOptions);
        
        
        
        try {
            // Start the client
            client.start();
            
            client.sendNotification("workspace/didChangeConfiguration", {
                // settings: {
                //     "initializationOptions": {
                //         "markupKindPreferred": null,
                //         "jediSettings": {
                //           "autoImportModules": []
                //         },
                //         "completion": {
                //           "disableSnippets": false
                //         }
                //     }
                // }
                settings: {
                    "pyls": {
                        "plugins": {
                          "pycodestyle": {
                            "enabled": true,
                            "ignore": [
                              "E501"
                            ]
                          }
                        },
                        "configurationSources": [
                          "pycodestyle",
                          "flake8"
                        ]
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

