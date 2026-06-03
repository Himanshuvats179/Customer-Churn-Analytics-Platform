<img width="1919" height="903" alt="image" src="https://github.com/user-attachments/assets/947312ff-e5b5-4f69-afc7-276dc0bf04c8" />
# Customer Churn Analytics Platform

## Overview

Customer Churn Analytics Platform is a full-stack machine learning application designed to predict customer churn and provide actionable business insights. The platform combines a React frontend, FastAPI backend, machine learning models, authentication system, and cloud deployment on AWS.

The application enables users to:

* Register and authenticate securely
* Predict customer churn using a trained ML model
* Visualize customer insights
* Analyze business metrics
* Access the application through a cloud-hosted environment

---

## Tech Stack

### Frontend

* React.js
* Redux Toolkit
* Axios
* Vite
* CSS

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* Authentication APIs
* REST Architecture

### Machine Learning

* Scikit-Learn
* XGBoost
* Pandas
* NumPy

### Database

* SQLite

### DevOps & Cloud

* Docker
* Jenkins
* GitHub
* AWS EC2
* Linux (Ubuntu)

---

## Features

### User Authentication

* User Registration
* User Login
* Password Hashing using BCrypt

### Churn Prediction

* ML-powered churn prediction
* Customer risk analysis
* Business insights generation

### Cloud Deployment

* Containerized frontend and backend
* Docker-based deployment
* AWS EC2 hosting
* Publicly accessible application

---

## Project Architecture

User Browser

↓

React Frontend (Nginx Container)

↓

FastAPI Backend (Docker Container)

↓

Machine Learning Model

↓

SQLite Database

Hosted on AWS EC2

---

## DevOps Workflow

GitHub

↓

Jenkins Pipeline

↓

Docker Build

↓

Docker Images

↓

AWS EC2 Deployment

---

## Challenges Solved During Deployment

* Docker image creation and optimization
* Frontend-backend communication issues
* CORS configuration troubleshooting
* AWS Security Group configuration
* EC2 storage limitations
* EBS volume expansion from 8GB to 20GB
* Linux filesystem resizing
* Production deployment debugging

---

## Key Learnings

* Full Stack Development
* REST API Design
* Machine Learning Integration
* Docker Containerization
* Jenkins CI/CD Concepts
* AWS EC2 Deployment
* Linux Administration
* Cloud Troubleshooting

---

## Future Enhancements

* PostgreSQL Integration
* AWS RDS Migration
* HTTPS and Custom Domain
* CloudWatch Monitoring
* Automated CI/CD Deployment
* GenAI-based Customer Retention Assistant

---

## Author

Himanshu Vats

Software Engineer | Full Stack Developer | Aspiring GenAI Engineer

Passionate about building scalable applications using AI, Machine Learning, Cloud, and Modern Web Technologies.
