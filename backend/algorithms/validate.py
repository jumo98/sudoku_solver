import numpy as np

def valid_solution(solution):
    line_sums = np.sum(solution, axis=1)
    return str(np.all(line_sums == 45))