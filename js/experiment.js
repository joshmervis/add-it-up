let timeline = [];

/**
 * GLOBAL VAR
 */
let SESSIONID = uuidv4();

let CURRENT_INDEX = 0;
let NUMBER_OF_CHOICE_TRIALS = 20;
let ORDER = [1, 4, 6, 10, 11, 14, 18];
let CHOSEN = [];
let PAYOUT;

let CORRECT_ANSWERS = {
    11: 69,
    12: 84,
    13: 84,
    14: 70,
    15: 70,
    16: 83,
    17: 83,
    18: 69
};

/**
 * Intro section.
 */
let welcome_page = {
    type: 'html-keyboard-response',
    stimulus: '<h2 style="font-size: 30px; font-weight: bold;">Welcome to the <br><span class="title">Add-It-Up</span><br>Task</h2> <br /><p>Press <kbd>enter</kbd> to continue.</p>',
    choices: [13],
    response_ends_trial: true,
};

timeline.push(welcome_page);

/**
 * Input subject identifier
 */
let subject_identifier = {
    type: 'survey-text',
    questions: [
        {prompt: "Please enter the subject ID", name: 'SubjectID', required: true}
    ],
};
timeline.push(subject_identifier);

/**
 * Input timepoint
 */
let timepoint = {
    type: 'survey-multi-choice',
    questions: [
        {prompt: "Which session is this?", name: 'Timepoint', options: ["Baseline", "Mid test (6 weeks)","Post test (12 weeks)", "Follow up (24 weeks)"], required:true} 
    ],
}
timeline.push(timepoint);

/**
 * Instructions block.
 */
let instructions_node = {
    type: 'instructions',
    pages: [
        '<div class="jumbotron jt-intro">'+
        '<h2>Instructions</h2>'+
            '<p>In this task, you will make choices between easier and harder rounds. Each round contains a series of math problems you do in your head. You will make a several choices, one after another, between easier and harder rounds. Consider your options carefully. You will sometimes be asked to actually do the round you said you would prefer, and at the end of the task you will be paid based on one of your choices.<p>'+
            '<p>Press <b>Next</b> to see an a example...</p>'+ 
            // '<p>In this task, you will choose between easier or harder rounds.</p>'+
            // '<p>You will be offered two amounts of “money” for the round and you should think of this as points you can earn towards your score.</p>'+
        '</div>',

        // '<div class="jumbotron jt-intro">'+
        //     '<p>Press the <kbd>left</kbd> or <kbd>right</kbd> arrows on the keyboard to select between an easy ( <kbd>left arrow</kbd> ) or hard ( <kbd>right arrow</kbd> ) round.</p>'+
        //     '<p><br>Press "Next" to see an example...</p>'+
        // '</div>',

        '<div class="jumbotron jt-intro">'+
        '<h2>Decisions</h2>'+
        '<p>The part of the task where you make the decisions will look like this:</p>'+
        '<div class="container-fluid" style="background-color: white; border: 3px solid dodgerblue; border-radius: 5px; max-width: 30%">'+
        '<div style="padding: 10px;">'+
        '<div class="row">'+
            '<div id="pick" class="col-sm-12"><h2 style="color: black">Pick between:</h2></div>'+
        '</div>'+
        '<div class="row">'+
            '<div id="left_choice" class="jumbotron col-sm-5" style="background-color: lightgrey">$4.75<br>2 Trials</div>'+
            '<div id="or" class="col-sm-2">or</div>'+
            '<div id="right_choice" class="jumbotron col-sm-5" style="background-color: lightgrey">$5<br>12 Trials</div>'+
        '</div>'+
        '<div class="row">'+
            '<div id="left_arrow" class="col-sm-5"><span class="glyphicon glyphicon-arrow-left"></span></div>'+
            '<div id="or" class="col-sm-2"></div>'+
            '<div id="right_arrow" class="col-sm-5"><span class="glyphicon glyphicon-arrow-right"></span></div>'+
        '</div>'+
        '</div>'+
    '</div>'+
    '<br>'+
    '<div class="container-fluid" style="max-width: 75%">'+
            '<div class="row">'+
                '<div id="left_arrow" class="col-sm-5"><span style="color: dodgerblue"> Easy offer on the left </span></div>'+
                '<div id="or" class="col-sm-2">...</div>'+
                '<div id="right_arrow" class="col-sm-5"><span style="color: dodgerblue"> Hard offer on the right </span></div>'+
                '<div id="left_arrow" class="col-sm-5">(You would press <kbd>left arrow</kbd> to select it)</div>'+
                '<div id="or" class="col-sm-2"></div>'+
                '<div id="right_arrow" class="col-sm-5">(You would press <kbd>right arrow</kbd> to select it)</div>'+
            '</div>'+
    '</div>',
        '<div class="jumbotron jt-intro"><h2>Trials</h2><p>During the trials, you will be shown a series of addition equations such as...</p>'+
        '<div style="background-color: white; border: 3px solid dodgerblue; border-radius: 5px; padding: 20px; margin: 1em auto 1em auto; width: 10%;"><b>9 + 7</b></div>'+
        '<p>Your job is to select one of the letters <kbd>T</kbd>, <kbd>S</kbd>, <kbd>F</kbd>, or <kbd>E</kbd> on the keyboard to indicate what letter the sum of the two displayed numbers starts with.</p> <b><p>For example, if you saw 6 + 6 you would select <kbd>T</kbd> for Twelve.</p><p>Or, if you saw 10 + 5 you would select <kbd>F</kbd> for Fifteen.</p></div>',
        '<div class="jumbotron jt-intro"><h2 class="text-warning bg-dark"> -PAUSE-</h2><p>Do you have any questions before moving on?</p></div>',
        '<div class="jumbotron jt-intro"><p>Please click <b>Next</b> when you are ready to begin the task.</p></div>'
    ],
    show_clickable_nav: true,
    show_page_number: true
};

timeline.push(instructions_node);

/**
 * Gets a random arbitrary in the range.
 * @param {number} min 
 * @param {number} max 
 * @returns {number} 
 */
let get_random_arbitrary = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

/**
 * Gets the second value based on the first number.
 * @param {number} first_number 
 * @returns {number}
 */
let get_second_number = (first_number) => {
    let min = 11 - first_number;
    let max = 18 - first_number;

    return get_random_arbitrary(min, max);
};

/**
 * Generates the number set for use in the numbers task 
 * portion.
 * @returns {object} params for number task
 */
let generate_number_set = () => {
    let first_number = get_random_arbitrary(1, 10);
    let second_number = get_second_number(first_number);

    let correct_sum = first_number + second_number;

    return {
        number_set: [first_number, second_number],
        correct_answer: CORRECT_ANSWERS[correct_sum]
    };
}


/**
 * Returns the HTML for the numbers task trial.
 * @param {array} number_set 
 * @returns {string}
 */
let get_numbers_task_html = (number_set) => {
    let presentation_html = "<h2>" + number_set[0] + " + " + number_set[1] + "</h2>";

    return presentation_html;
}

/**
 * Choice HTML.
 * @param {number} index
 * @returns {string} 
 */
let get_task_choice_html = (index) => {
    let params = CONFIGURATION.PARAMETERS[index];

    return get_choice_html(params.easy_offer, params.easy_trials, params.hard_offer, params.hard_trials);
}

/**
 * Returns the html with formatted parameters.
 * @param {*} easy_offer 
 * @param {*} easy_trials 
 * @param {*} hard_offer 
 * @param {*} hard_trials 
 * @returns {string} choice HTML
 */
let get_choice_html = (easy_offer, easy_trials, hard_offer, hard_trials) => {
    return `

    <div class="container-fluid">
        <div class="row">
            <div id="pick" class="col-sm-12"><h2>Pick between:</h2></div>
        </div>
        <div class="row">
            <div id="left_choice" class="jumbotron col-sm-5">$` + easy_offer + `<br>` + easy_trials + ` Trials</div>
            <div id="or" class="col-sm-2">or</div>
            <div id="right_choice" class="jumbotron col-sm-5">$` + hard_offer + `<br>` + hard_trials + ` Trials</div>
        </div>
        <div class="row">
            <div id="left_arrow" class="col-sm-5"><span class="glyphicon glyphicon-arrow-left"></span></div>
            <div id="or" class="col-sm-2"></div>
            <div id="right_arrow" class="col-sm-5"><span class="glyphicon glyphicon-arrow-right"></span></div>
        </div>

    </div>
`;
}

/**
 * This generates the timeline for this task.
 * @param {number} number_of_trials 
 */
let problem_counter = 0;
let problem_indexer = function(){
    problem_counter++;
    return problem_counter;
}

let generate_timeline = (number_of_trials) => {
    /**
     * Created the supplied number of number games trials.
     */
    for (let i = 0; i < number_of_trials; i++) {
        let params = generate_number_set();

        let number_games_trial = {
            type: 'categorize-html',
            stimulus: () => {
                return get_numbers_task_html(params.number_set, params.answer_options_set)
            },
            key_answer: params.correct_answer,
            data: {
                key_answer_character: jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(params.correct_answer),
                SessionID: SESSIONID,
                problem_index: problem_indexer(),

            },
            choices: CONFIGURATION.KEY_OPTIONS,
            response_ends_trial: true,
            show_stim_with_feedback: false,
            feedback_duration: 1250,
            incorrect_text: () => {
                return "<h1 class='animated intensifies' style='color:red;'>Incorrect!</h1>"
            },
            correct_text: "<h1 class='animated strobe' style='color:green'>Correct</h1>",
        };

        /**
         * Add this trial to the experiment timeline.
         */
        jsPsych.addNodeToEndOfTimeline(number_games_trial, () => {
            console.log("Added Number Trial")
        });
    }
}

/**
 * This generates the choice page for the offer.
 * @param {boolean} choice_page_required 
 * @returns {object} 
 */
let get_choice_page = (choice_page_required) => {
    let params = CONFIGURATION.PARAMETERS[CURRENT_INDEX];

    let choice_page = {
        type: 'html-keyboard-response',
        stimulus: get_task_choice_html(CURRENT_INDEX),
        choices: [37, 39],
        data: {
            easy_offer: params.easy_offer,
            hard_offer: params.hard_offer,
            easy_trials: params.easy_trials,
            hard_trials: params.hard_trials,
            SessionID: SESSIONID
        },
        response_ends_trial: true,
        on_finish: () => {
            CURRENT_INDEX++;

            let last_trial_choice = JSON.parse(jsPsych.data.getLastTrialData().json())[0];

            if (last_trial_choice.key_press === 37) {
                CHOSEN.push(params.easy_offer);
                if (ORDER.indexOf(CURRENT_INDEX) !== -1) {
                    generate_timeline(CONFIGURATION.PARAMETERS[CURRENT_INDEX].easy_trials);
                }
            } else {
                CHOSEN.push(params.hard_offer);
                if (ORDER.indexOf(CURRENT_INDEX) !== -1) {
                    generate_timeline(CONFIGURATION.PARAMETERS[CURRENT_INDEX].hard_trials);
                }
            }

            if (choice_page_required === true) {
                if (CURRENT_INDEX === NUMBER_OF_CHOICE_TRIALS) {

                    let thank_you_page = {
                        type: 'html-keyboard-response',
                        stimulus: '<h2 class="animated tada delay-0.5s">Thank you for completing this task! <br />Press <kbd>enter</kbd> to continue.</h2>',
                        choices: [13],
                        response_ends_trial: true,
                    };

                    jsPsych.addNodeToEndOfTimeline(thank_you_page, () => { })

                    let payout_page = {
                        type: 'html-keyboard-response',
                        stimulus: generate_payout_html(CHOSEN),
                        choices: [13],
                        response_ends_trial: true,
                        data: {
                            payment: '$'+PAYOUT
                        }
                    }
                    
                    jsPsych.addNodeToEndOfTimeline(payout_page, () => { })

                } else {
                    jsPsych.addNodeToEndOfTimeline(get_choice_page(true), () => {

                    });
                }
            }


        }
    };

    return choice_page;
}

timeline.push(get_choice_page(true));

let generate_payout_html = function(array) {
    let shuffled_array = jsPsych.randomization.repeat(array, 1);
    PAYOUT = shuffled_array[0];
    return `
    <div class="container">
        <div class="jumbotron animated flipInY">
            <h1>Congratulations!</h1>
            <h2>You will be paid:</h2>
                <span id="cash">$` + PAYOUT + `</span>
            <h2>Press <kbd>enter</kbd> to exit this task.</h2>
        </div>
    </div>
    `
}

let choice_counter = 0;
let choice_indexer = function(){
    choice_counter++;
    return choice_counter;
}
/**
 * jsPsych Initialization.
 */
jsPsych.init({
    timeline: timeline,
    fullscreen: true,
    on_trial_finish: (data) => {
        if (data.key_press !== undefined) {
            data.key_press_character = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press);
            //data.key_answer = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(number_games_trial.key_answer);

            if (data.key_press === 39) {
                data.choice = 'HARD';
                data.choice_index = choice_indexer();
            } else if (data.key_press === 37) {
                data.choice = 'EASY';
                data.choice_index = choice_indexer();
            }
        }
    },
    on_finish: (data) => {
        let JSONdata = JSON.parse(jsPsych.data.get().json());
        let file_name_csv = "add-it-up-subject-" + JSONdata[1]["subject_id"] + JSONdata[2]["timepoint"] + ".csv";
        let file_name_json = "add-it-up-subject-" + JSONdata[1]["subject_id"] + JSONdata[2]["timepoint"] + ".json";

        jsPsych.data.addProperties({SUBID: JSONdata[1]["subject_id"]});
        jsPsych.data.addProperties({SessionTimePoint: JSONdata[2]["timepoint"]});

        if (window.location !== window.parent.location) {
            jsPsych.pauseExperiment();

            jsPsych.data.get().localSave('csv', file_name_csv);
            jsPsych.data.get().localSave('json', file_name_json);

            TaskFlow.Client.sendTaskData(data);
            TaskFlow.Client.endTask();
        } else {
            jsPsych.pauseExperiment();

            jsPsych.data.get().localSave('csv', file_name_csv);
            jsPsych.data.get().localSave('json', file_name_json);
        }
    },
});