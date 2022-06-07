const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    const commentToWait = core.getInput('comment-to-wait', { required: true });

    var body;
    if (
        context.eventName === "issue_comment" &&
        !context.payload.issue.pull_request
    ) {
        // not a pull-request comment, aborting
        core.setOutput("triggered", "false");
        return;
    }

    while (!body.includes(commentToWait)) {
        setTimeout(() => { console.log("Searching for " + commentToWait); }, 10000);
        body =
        (context.eventName === "issue_comment"
            // For comments on pull requests
            ? context.payload.comment.body
            // For the initial pull request description
            : context.payload.pull_request.body) || '';
    }

    core.setOutput('comment_body', body);

    core.setOutput("comment-found", "true");
}

run().catch(err => {
    console.error(err);
    core.setFailed("Unexpected error");
});