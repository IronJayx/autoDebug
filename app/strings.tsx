const broken_function = `def add_numbers_broken(number_1, number_2):
    sum = 0
    for i in [number_1, number_2]:
        sum + - i

    return sum
`

export {
    broken_function
}
