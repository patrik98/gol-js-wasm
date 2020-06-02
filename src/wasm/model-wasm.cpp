#include<algorithm> // for copy()
#include <stdlib.h>

using namespace std;

#define WASM_EXPORT __attribute__((visibility("default")))

const int livingCell = 1;
const int deadcell = 0;
const int initCell = -1;

const int rows = 115;
const int columns = 80;

static int board[rows][columns];
static int *boardPtr = (int*) &board[0];
static int generation = 0;


WASM_EXPORT
int* getBoardPtr() {
  return boardPtr;
}

WASM_EXPORT
int getGeneration() {
  return generation;
}

WASM_EXPORT
int getlivingCells() {
  int livingCells = 0;
  
  for (int r = 0; r < rows; ++r)
    {
        for (int c = 0; c < columns; ++c)
        {
           if (board[r][c] > 0) {
               livingCells = livingCells + 1;
           }
        }
    }
    
  return livingCells;
}

WASM_EXPORT
void clear() {
  for (int r = 0; r < rows; ++r) {
    for (int c = 0; c < columns; ++c) {
      board[r][c] = initCell;
    }
  }

  generation = 0;
}

float getRandomFloat() {
  float r = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);

  return r;
}

WASM_EXPORT
void randomizeBoard(float probability) {
  clear();

  for (int r = 0; r < rows; ++r) {
    for (int c = 0; c < columns; ++c) {
        float randFloat = getRandomFloat();
        
        if (randFloat <= probability) {
            board[r][c] = livingCell;
      }
    }
  }
}

int countLivingNeighbours(int b[115][80], int row, int column) {
  int count = 0;

  for (int r = row - 1; r <= row + 1; ++r) {
    for (int c = column - 1; c <= column + 1; ++c) {
      if (r >= 0 && r < rows && c >= 0 && c < columns && (c != column || r != row)) {
          if (b[r][c] > 0) {
              count = count + 1;
          }
      }
    }
  }

  return count;
}

int getNextState(int state, int neighbours) {
  if (state <= deadcell && neighbours == 3){
    return livingCell;
  } else if (state == livingCell && neighbours >= 2 && neighbours <= 3) {
    return livingCell;
  } else if (state == initCell) {
    return initCell;
  } else {
    return deadcell;
  }
}

WASM_EXPORT
void transform() {
    generation = generation + 1;
    
    int tmpBoard[rows][columns];
 
    std::copy(&board[0][0], &board[0][0] + rows * columns, &tmpBoard[0][0]);

    for (int r = 0; r < rows; ++r)
    {
        for (int c = 0; c < columns; ++c)
        {
            int state = tmpBoard[r][c];
            int ln = countLivingNeighbours(tmpBoard, r, c);
            int nextState = getNextState(state, ln);

            board[r][c] = nextState;
        }
    }
}

WASM_EXPORT
void writeToArray(int row, int column, int val) {

    board[row][column] = val;
}

int main() {
    
    return 0;
}