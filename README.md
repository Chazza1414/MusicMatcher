# Music Matcher

## Introduction

This project was developed as part of the Team Project module in the second year of my Computer Science and Artificial Intelligence course at the University of Birmingham.

MusicMatcher is a music recommendation application that analyses the user's music library and suggests songs they will like. This is presented in a style similar to a dating app, where the opinion of each song is used to improve the machine learning algorithm to enhance recommendations.

It is a web-based application with an Angular front end, Springboot backend and a PostgreSQL database, all generated using JHipster.
The project heavily relies on the Spotify API which is used to load the user library, return track information and many other things.

This is the link for the University repository where commits and issues were created:
https://git.cs.bham.ac.uk/team-projects-2022-23/teamai49-22

## Usage

**This project is currently broken!**  
This is due to a few reasons:

- The Spotify authentication for the application has expired
- Running locally was configured for the production environment (small changes needed)

To run this project locally use the following steps:

1. Clone the project onto your machine
2. From the parent directory run `.\mvnw` (on Windows), this will take some time

### Dependencies

Ensure the following has been installed prior to running:

1. Java - set the JAVA_HOME environment variable
2. NodeJS
