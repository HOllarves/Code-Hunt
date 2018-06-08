# The Code Hunt Whitepaper

The Code Hunt is an open source decentralized platform that allows programmers to claim bounties from a wide variety of sources.

There is an undoubtedly large market for programmers and as time moves forward the demand increases. We live in a world where almost everything is run by software and programmers are slowly but surely becoming one of the most important foundations of our modern economies.

That said, the opportunities and freedom for programmers to make money out of their skills haven't changed much in the last years. That brings us to the actual state of the majority of active programmers. Working office hours and on the same line of projects for most of the time and getting the same pay.

## The Freelance alternative

Many developers have then decided to become freelancers using centralized platforms. This allow them to have a greater diversity in their work, more competitive payments and certainly a lot more flexibility. However, working under this platforms still expose hard-working developers to scams, improper management, and wrong dispute resolutions.

As with all centralized systems, such infrastructures come with downsides that most of the times affect users while protecting the platform and its owners.

## State of affairs

The Code Hunt is a decentralized alternative that uses the Github platform to what essentially is the exchange in this situations:  **Companies or entrepreneurs often need developers to fix or build specific parts of their programs.** Most of the times these are presented in form of issues. These issues are solved and a Pull Request is made to merge the new/fixed code to the codebase. 

We could divide the process into 4 simple steps:

1. An issue is posted. In it, the owner of the repository/official explains what needs to be done.

2. A developer fixes/add the code that was requested on the issue.

3. The same developer creates a Pull Request with the new code.

4. The repository owner/official checks for possible conflicts. If the PR is fine, the code is merged, else it's rejected.

Most programmers do this every single day of their lives... **for free**.

## Our Intentions

Our intentions are not to diminish the grand efforts do every day to support Open Source projects. However, it is undeniable that some of this projects would have a lot more support if a reward is involved. Yet, most of the open source projects do not have the time or support available to set up code bounties.

By making a simple to use decentralized platform, leveraging the power of the Ethereum's Smart Contracts and front-faced tools like [Metamask](https://metamask.io/), a simple solution is in line.

In the Code Hunt the process is fairly similar to the one mentioned before:

1. An issue is posted. The project owner or anyone is able to set up a bounty and it's duration on that specific issue by committing the bounty into a smart contract.

2. Developers from across the world will view these bounties and their specifications.

3. A developer will then come up with the fix for the issue and create a PR.

4. The same developer will specify the ID of the Pull Request he/she posted to fix the problem in The Code Hunt platform.

5. Using Github's OAuth, The Code Hunt will verify that said developer is the actual owner of the account that posted the Pull Request in question.

6. If said PR is merged to the codebase, The Code Hunt's Smart Contract will transfer the funds to the developer's address and mark the bounty as finished.

The only infrastructure required for this project is a [web server](https://github.com/HOllarves/Code-Hunt-API) capable of handling all Github related validations. An oracle could be used instead, although these are still in active development.

## Our tools

For The Code Hunt, we intend to use ether (Ethereum's native currency) for all transactions as we don't deem necessary the creation of a new token to what essentially is a simple transfer of value.

For better smart contract code, we are using the [openzeppelin](https://openzeppelin.org) library.

For front-end interactions, we recommend the use of Metamask as it makes the whole process a lot easier.

## Steps missing

The Code Hunt development is just beginning. This project started as the final assignment for [The School of AI's Decentralized Applications Course](https://www.theschool.ai), but I intend to continue it's development and open source it.

__On the front-end__:
1. Issue tracking and better display of it's related information when creating and selecting bounties.
2. A proper issue list with better item arrangments
3. Issue selection logic and subsequent calls to the smart contract.

__On the back-end__:
1. Issue selection real-time responses, that will allow our react front-end to automagically display issue information as it's created.
2. Implementing Github webhooks to track submitted PRs
3. Subsequent contract resolutions on the events fired by the webhooks.

__On the Smart Contract__:
1. Duration limitations on the contract. (I'm just stuck)

## Want to help?
Write an email to achejuega@gmail.com :)