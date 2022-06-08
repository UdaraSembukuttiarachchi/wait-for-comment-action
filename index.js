import { getInput, setOutput, setFailed } from '@actions/core';
import { eventName, payload } from '@actions/github';

async function run() {
    const commentToWait = getInput('comment-to-wait', { required: true });
    var body = '';

    if (
        eventName === "issue_comment" &&
        !payload.issue.pull_request
    ) {
        // not a pull-request comment, aborting
        setOutput("comment-found", "false");
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
    const deadline = now + 6*60*1000 //one minute

    Loop:
    while (now <= deadline) {
        console.log('retreiving comments...')
        body =
            (context.eventName === "issue_comment"
                // For comments on pull requests
                ? context.payload.comment.body
                // For the initial pull request description
                : context.payload.pull_request.body) || '';
        if(body.includes(commentToWait)) break Loop;

        console.log('Comment not found. Waiting 10s...')
        setTimeout(() => { console.log("Searching for " + commentToWait); }, 10000);
        now = new Date().getTime()
    }

    console.log('Restrived data:'+ body)
    


    setOutput('comment_body', body);

    setOutput("comment-found", "true");
}

run().catch(err => {
    console.error(err);
    setFailed("Unexpected error");
});