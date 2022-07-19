import numpy as np
import copy

def norm(a):
    return (a/9)-.5

def denorm(a):
    return (a+.5)*9

def solve_sudoku_ml_once(model, board):
    game = norm(board)
    out = model.predict(game.reshape((1,9,9,1)))
    out = out.squeeze()
    pred = np.argmax(out, axis=1).reshape((9,9))+1
    return pred

def solve_sudoku_ml_inference(model, board):
    game = norm(board)
    feat = copy.copy(game)

    while(1):
        out = model.predict(feat.reshape((1,9,9,1)))  
        out = out.squeeze()

        pred = np.argmax(out, axis=1).reshape((9,9))+1 
        prob = np.around(np.max(out, axis=1).reshape((9,9)), 2) 
        
        feat = denorm(feat).reshape((9,9))
        mask = (feat==0)
     
        if(mask.sum()==0):
            break
            
        prob_new = prob*mask
    
        ind = np.argmax(prob_new)
        x, y = (ind//9), (ind%9)

        val = pred[x][y]
        feat[x][y] = val
        feat = norm(feat)
    
    return pred