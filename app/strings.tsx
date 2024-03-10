const broken_function = `def add_numbers_broken(number_1, number_2):
    sum = 0
    for i in [number_1, number_2]:
        sum + - i

    return sum
`

const debugMessageNewCode = (new_code) => `I'm encountering an issue with the following code snippet, and I suspect it contains bugs or logical errors. Could you please review it and send it back along with corrections or improvements you see fit to fix the issue? Here's the code:

${new_code}

`

const lintMessageNewCode = (code) => `
I have this piece of code that I want you to lint.

Although the script is functional, I'm concerned about its adherence to coding standards, overall code quality, and consistency across different sections.
I haven't yet applied any linting tools or standardized guidelines to the codebase, and I believe this is an essential step before moving further with the project development.
I want you to modify and return to me the full script following these objectives:

Code Quality Improvement: Enhance the overall quality of the code by identifying and fixing common coding errors, potential bugs, and performance issues.
Consistency Enforcement: Ensure that the code follows a consistent style, making it easier to read, maintain, and collaborate on with others.
Adherence to Standards: Align the code with established coding standards and best practices to improve its robustness and reliability.
Automated Linting Setup: Integrate an automated linting tool into the development workflow to continuously monitor code quality and standards compliance.
Documentation on Linting Decisions: Provide guidelines or documentation on the chosen linting standards, configurations, and any custom rules or exceptions applied to the project.

${code}

Please apply the above guidelines on this code and return to me the full modified version.
`;

const refactorMessageNewCode = (code) => `
I have this piece of code that I want to refactor.

I've observed that the script's current implementation could be improved in terms of efficiency, organization, and modularity. It's also challenging to adapt and reuse portions of the code for different projects due to its monolithic structure.
I want you to modify and return to me the full script with the following goals in mind:

- Improve Efficiency: Make the code more efficient, particularly for processing large datasets.
- Enhance Readability: Revise the code to adhere to the best practices of software development, enhancing its clarity and making it more intuitive for others to understand and maintain.
- Increase Modularity: Transform the script into a set of smaller, reusable components that can be easily imported and utilized in various projects.
- Robust Error Handling: Integrate comprehensive error handling to effectively manage exceptions and provide clear, helpful error messages.
- Comprehensive Documentation: Include detailed comments and documentation to explain the functionality and usage of each component of the script.

Here's the code:

${code}

Please apply the above guidelines on this code and return to me the full modified version.
`;

export {
    broken_function,
    lintMessageNewCode,
    debugMessageNewCode,
    refactorMessageNewCode
}
