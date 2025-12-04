AI-Powered Chess Game Analysis & Move Prediction

ChessVerse is an AI-driven chess analysis platform that integrates a custom NNUE chess engine, an image-to-FEN converter, real-time move prediction, and a React-flask based learning environment.
This project aims to make advanced chess analysis accessible to everyone—students, hobbyists, and competitive players.

🚀 Features
♟️ Custom NNUE Chess Engine

Built from scratch using PyTorch

Evaluates board states using 772 input features

Trained on 1M+ Stockfish-evaluated positions

~85% move prediction accuracy

Iterative deepening + Alpha-Beta pruning + Quiescence search

Adjustable difficulty (Elo 100–1200)

🖼️ Image → FEN Conversion

Upload any online chessboard screenshot and the system will:

Detect pieces on all 64 squares

Generate FEN notation

Predict the best move instantly

Implemented using:

OpenCV (template matching)

Custom piece templates

python-chess for FEN validation

📊 PGN Game Analysis

Upload or import PGNs

Detect blunders, mistakes, best moves

Move-by-move centipawn graphs

Store & view previous analysis

🤖 AI Bot Gameplay

Play against an AI that adjusts its strength by:

Changing search depth

Adding randomness for lower Elo

NNUE-based evaluations for higher Elo

🧠 Learn From Grandmasters

Integrated grandmaster games

Engine-generated commentary

Key moment detection

📚 Chess Learning Hub

Includes:

Openings and principles

Middlegame tactical patterns

Endgame techniques

GM examples with explanations

🛠️ Tech Stack
Frontend

React.js

Material UI

react-chessboard

Backend

Flask

MongoDB

python-chess

OpenCV

PyTorch

AI / ML

Custom NNUE network

Stockfish-evaluated dataset

Feature extraction + HDF5 preprocessing

⚙️ System Architecture

Modules include:

NNUE engine

Search engine

Image-to-FEN pipeline

PGN parser + analyzer

Authentication + storage

Interactive React dashboard

📈 Results

85% move accuracy vs test dataset

40 ms average analysis time

High accuracy in FEN generation on digital boards

Positive user testing across devices/browsers

🔮 Future Work

Add CNN-based piece detector (physical boards)

Add reinforcement learning for engine improvement

Cloud deployment (Docker + Render/Azure)

Add opening book + endgame tablebases
