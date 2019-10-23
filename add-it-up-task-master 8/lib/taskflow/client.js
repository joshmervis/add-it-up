const TaskFlow = {
    CHANNELS: {
        ERROR: "CHANNELS.ERROR",
        DEBUG: "CHANNELS.DEBUG",
        INFO: "CHANNELS.INFO",
        MODULE: "CHANNELS.MODULE",
        STIM: "CHANNELS.STIM",
        TASK: "CHANNELS.TASK"
    },

    MESSAGETYPE: {
        ACTION: "MESSAGETYPE.ACTION",
        CONFIGURATION: "MESSAGETYPE.CONFIGURATION",
        DATA: "MESSAGETYPE.DATA",
        INFO: "MESSAGETYPE.INFO",
        WARN: "MESSAGETYPE.WARN"
    },

    TOPICS: {
        TRIAL: "TASK.TOPIC.TRIAL",
        TASK: "TASK.TOPIC.TASK"
    },

    Client: {
        endTask: function() {
            let message = {
                _channel: TaskFlow.CHANNELS.TASK,
                _guid: "",
                _topic: TaskFlow.TOPICS.TASK,
                _type: TaskFlow.MESSAGETYPE.ACTION,
                _value: ""
            };

            window.parent.postMessage(JSON.stringify(message), '*');
        },
        pauseTask: function() {
            jsPsych.pauseExperiment();
        },
        resumeTask: function() {
            jsPsych.resumeExperiment();
        },
        sendTaskData: function(data) {
            let message = {
                _channel: TaskFlow.CHANNELS.TASK,
                _guid: "",
                _topic: TaskFlow.TOPICS.TASK,
                _type: TaskFlow.MESSAGETYPE.DATA,
                _value: data
            };

            window.parent.postMessage(JSON.stringify(message), '*');
        },
        sendTrialData: function(data) {
            let message = {
                _channel: TaskFlow.CHANNELS.TRIAL,
                _guid: "",
                _topic: TaskFlow.TOPICS.TRIAL,
                _type: TaskFlow.MESSAGETYPE.DATA,
                _value: data
            };

            window.parent.postMessage(JSON.stringify(message), '*');
        }
    }
};