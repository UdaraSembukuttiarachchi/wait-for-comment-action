const core = require("@actions/core");
const { context } = require("@actions/github");

async function run() {
    const commentToWait = core.getInput('comment-to-wait', { required: true });
    console.log('comment-to wait: ' + commentToWait)
    var body = '';

    if (
        context.eventName === "issue_comment" &&
        !context.payload.issue.pull_request
    ) {
        // not a pull-request comment, aborting
        core.setOutput("comment-found", "false");
        return;
    }

    // while (!body.includes(commentToWait)) {
    //     setTimeout(() => { console.log("Searching for " + commentToWait); }, 10000);
    //     body =
    //         (context.eventName === "issue_comment"
    //             // For comments on pull requests
    //             ? context.payload.comment.body
    //             // For the initial pull request description
    //             : context.payload.pull_request.body) || '';
    // }

    let now = new Date().getTime()
    const deadline = now + 6 * 60 * 1000 //one minute

    Loop:
    while (now <= deadline) {
        console.log('retreiving comments...')
        body =
            (context.eventName === "issue_comment"
                // For comments on pull requests
                ? context.payload.comment.body
                // For the initial pull request description
                : context.payload.pull_request.body) || '';
        core.setOutput('comment_body', body);

        if (body.includes(commentToWait)) break Loop;

        console.log('Comment not found. Waiting 10s...')
        setTimeout(() => { console.log("Searching for " + commentToWait); }, 10000);
        now = new Date().getTime()
    }

    console.log('Restrived data:' + body)



    core.setOutput('comment_body', body);

    core.setOutput("comment-found", "true");

    return 0;
}

run().catch(err => {
    console.error(err);
    core.setFailed("Unexpected error");
});