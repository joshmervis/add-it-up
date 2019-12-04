const TaskFlow = {
    TOPICS: {
        TRIAL: "TASK.TOPIC.TRIAL",
        TASK: "TASK.TOPIC.TASK"
    },
    MESSAGETYPE: {
        ACTION: "MESSAGETYPE.ACTION",
        CONFIGURATION: "MESSAGETYPE.CONFIGURATION",
        DATA: "MESSAGETYPE.DATA",
        INFO: "MESSAGETYPE.INFO",
        WARN: "MESSAGETYPE.WARN"
    },
    CHANNELS: {
        ERROR: "CHANNELS.ERROR",
        DEBUG: "CHANNELS.DEBUG",
        INFO: "CHANNELS.INFO",
        MODULE: "CHANNELS.MODULE",
        STIM: "CHANNELS.STIM",
        TASK: "CHANNELS.TASK"
    },
    Client: {
        endTask: () => {
            let message = {
                _channel: TaskFlow.CHANNELS.TASK,
                _guid: "",
                _topic: TaskFlow.TOPICS.TASK,
                _type: TaskFlow.MESSAGETYPE.ACTION,
                _value: ""
            };

            window.parent.postMessage(JSON.stringify(message), '*');
        },
        getConfiguration: async () => {
            let xhr = new XMLHttpRequest();

            return new Promise((resolve, reject) => {
                xhr.open('GET', window.parent.location.href + '/UserConfiguration', true);
                xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    
                xhr.onload = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(JSON.parse(xhr.responseText));
                        }
                    }
                    reject("Error, status code = " + xhr.status);
                };

                xhr.send();
            });
        },
        pauseTask: () => {
            jsPsych.pauseExperiment();

            let message = {
                _channel: TaskFlow.CHANNELS.TASK,
                _guid: "",
                _topic: TaskFlow.TOPICS.TASK,
                _type: TaskFlow.MESSAGETYPE.DATA,
                _value: data
            };

            window.parent.postMessage(JSON.stringify(message), '*');
        },
        resumeTask: () => {
            jsPsych.resumeExperiment();
        },
        sendTaskData: (data) => {
            let message = {
                _channel: TaskFlow.CHANNELS.TASK,
                _guid: "",
                _topic: TaskFlow.TOPICS.TASK,
                _type: TaskFlow.MESSAGETYPE.DATA,
                _value: data
            };

            window.parent.postMessage(JSON.stringify(message), '*');
        },
        sendTrialData: (data) => {
            let message = {
                _channel: TaskFlow.CHANNELS.TRIAL,
                _guid: "",
                _topic: TaskFlow.TOPICS.TRIAL,
                _type: TaskFlow.MESSAGETYPE.DATA,
                _value: data
            };

            window.parent.postMessage(JSON.stringify(message), '*');
        },
        setConfigurationValue: async (task_guid, key, value) => {
            let xhr = new XMLHttpRequest();
            
            return new Promise((resolve, reject) => {
                let value_object = {
                    GUID: task_guid,
                    VALUE: value
                };
                
                let obj = {
                    KEY: key,
                    VALUE: JSON.stringify(value_object)
                };
    
                xhr.open('POST', window.parent.location.href + '/UserConfiguration', true);
                xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    
                xhr.onload = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(xhr.responseText);
                        }
                    }
                    reject("Error, status code = " + xhr.status);
                };
    
                xhr.send(JSON.stringify(JSON.stringify(obj)));
            });
        }
    }
};