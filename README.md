# A* pathfinding algorithm visualization applet

## Description

The algorithm computes the shortest path to a given node in a n x n grid using the A* search algorithm. Visited nodes and shortest path are visualised on a HTML canvas. 

Work in progress.

[See the project live on Heroku.](https://pathfinding-visualization.herokuapp.com/)

## Instructions

Specify grid size using the slider (30 x 30 by default). Select a node on the grid by clicking a square on the grid ((n - 1, n - 1) by default). Click the "Run" button.

## Heuristics

- Euclidean distance (currently in use)
- Manhattan distance

## Future improvements

- Obstacles
- Option for selecting start node
- Option menu for choosing a heuristic
- More heuristics
- More algorithms (BFS, Dijkstra's algorithm)